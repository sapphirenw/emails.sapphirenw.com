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

        await createEmailEvent(pool, {
            type: body.type,
            createdAt: new Date(body.created_at),
            emailId: body.data.email_id,
        })
        logger.info("Successfully inserted email event", {status: body.type})

        return c.text("Success", 200)
    })

export default app