import { Hono } from "hono"
import { getLogger } from "@logtape/logtape"
import { createEmailEvent } from "./database/queries_sql"
import pool from "./database/database"

const logger = getLogger("app")

type WebhookPayload = {
    type: string
    created_at: string
    data: {
      created_at: string
      email_id: string
      from: string
      to: string[]
      subject: string
    }
}

const app = new Hono()
    .post("/", async (c) => {
        const body: WebhookPayload = await c.req.json()
        logger.info("handling resend webhook payload", {body: body})

        try {
            await createEmailEvent(pool, {
                type: body.type,
                createdAt: new Date(body.created_at),
                emailId: body.data.email_id,
            })
        } catch (_e) {
            const e = _e as Error
            // check if this is referencing a foreign key contraint
            // because this may be a debug event
            if (e.message.includes("a foreign key constraint fails")) {
                // ignore this message
                logger.info("Foreign key contraint failed")
                return c.text("Success", 200)
            }

			logger.error(e.message, { "stack": e.stack })
            return c.text("There was an unknown error", 500)
        }

        logger.info("Successfully inserted email event", {status: body.type})

        return c.text("Success", 200)
    })

export default app