import { Hono } from "hono";
import { render } from "@react-email/components";
import { renderEmail } from "./render"
import pool from "../database/database";
import { createEmail, getEmail, getEmailEvents } from "../database/queries_sql";
import { fetchUser } from "../project/user/user";
import { getLogger } from "@logtape/logtape";
import { getResend } from "../resend/resend";

const app = new Hono()
	.patch("/", async (c) => {
		const rawBody = await c.req.json()
		if (!rawBody) {
			return c.json({ message: "failed to read the body" }, 400)
		}

		// parse the body
		const { body, template, react, plainText } = await renderEmail(rawBody)

		// render as html
		return c.html(await render(react), 200)
	})
	.post("/", async (c) => {
		const logger = await getLogger("app")
		try {
			// read and parse the body
			const rawBody = await c.req.json()
			if (rawBody === undefined) {
				return c.json({ message: "failed to read the body" }, 400)
			}

			// parse the body
			const { body, template, react, plainText, headers } = await renderEmail(rawBody)

			// get a connection
			const conn = await pool.getConnection()

			// get the user
			const user = await fetchUser(body.to, body.projectId)
			logger.info("Successfully fetched user", user)

			// check email preferences
			if (!user.user.notificationAll) {
				return c.json({ "message": "this user has notifications disabled" }, 201)
			}

			if (body.type === "marketing") {
				if (!user.user.notificationMarketing) {
					return c.json({ "message": "this user has marketing notifications disabled" }, 201)
				}
			}

			// get the resend client
			const resend = getResend()

			// send the email
			const { data, error } = await resend.emails.send({
				from: body.from,
				subject: body.subject,
				to: user.user.email,
				cc: body.cc,
				bcc: body.bcc,
				scheduledAt: body.scheduledAt,
				tags: body.tags,
				react: react,
				text: plainText,
				headers: headers,
			});

			if (error) {
				return c.json(error, 400);
			}

			// create the record inside of the 	database
			await createEmail(conn, {
				id: data!.id,
				recipient: body.to,
				projectId: template.projectId,
				templateId: template.id,
				attributes: JSON.stringify(body.attributes),
				subject: body.subject,
				cc: body.cc ?? null,
				bcc: body.bcc ?? null,
				scheduledAt: body.scheduledAt ?? null,
				tags: body.tags === undefined ? null : body.tags.map((v) => `${v.name}=${v.value}`).join(","),
			})

			logger.info("Successfully created email", { id: data!.id })

			return c.json(data);
		} catch (_e) {
			const e = _e as Error
			logger.error(e.message, { stack: e.stack })
			return c.json({ message: `${e.message}` }, 400)
		}
	})
	.get("/:id", async (c) => {
		const { id } = c.req.param()

		// fetch the database record
		const email = await getEmail(pool, { id: id })
		if (!email) {
			return c.json({ error: `failed to fetch an email with the id: ${id}` }, 400)
		}

		// get the events
		const events = await getEmailEvents(pool, { emailId: id })

		// get the resend client
		const resend = getResend()

		// get the resend record
		const resendData = await resend.emails.get(email.id)
		if (!resendData) {
			return c.json({ error: `failed to get the resend data with id: ${email.id}` }, 400)
		}

		return c.json({ email: email, events: events, resend: resendData }, 200)
	})
	.post("/:id/cancel") //const { username } = c.req.param()

export default app