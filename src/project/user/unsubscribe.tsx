import { Hono } from "hono"
import { fetchUser } from "./user"
import { userUnsubscribe } from "../../database/queries_sql"
import pool from "../../database/database"
import { getLogger } from "@logtape/logtape"
import { render } from "@react-email/components"
import WNUnsubscribe from "../../../emails/workout-notepad/WNUnsubscribe"

const logger = getLogger("app")

export function encodeUnsubscribe(email: string, projectId: number): string {
    return Buffer.from(`${email}::${projectId}`, 'utf-8').toString('base64');
}

export function decodeUnsubscribe(payload: string): {email: string, projectId: number} {
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    const split = decoded.split("::")
    if (split.length < 2) {
        throw Error(`failed to decode the unsubscribe link. Length was: ${split.length}`)
    }
    return {
        email: split[0],
        projectId: Number(split[1])
    }
}

const app = new Hono()
    .get("/:payload", async (c) => {
        const { payload } = c.req.param()

        const { email, projectId } = decodeUnsubscribe(payload)
        
        const user = await fetchUser(email, Number(projectId))
        
        await userUnsubscribe(pool, {email: email, projectId: Number(projectId), notificationAll: 0})
        logger.info("User unsubscribed", {"user": user})

        return c.html(await render(<WNUnsubscribe recipient={email} />), 200)
    })
    .post("/:payload", async (c) => {
        const { payload } = c.req.param()

        const { email, projectId } = decodeUnsubscribe(payload)
        
        const user = await fetchUser(email, Number(projectId))
        
        await userUnsubscribe(pool, {email: email, projectId: Number(projectId), notificationAll: 0})
        logger.info("User unsubscribed", {"user": user})

        return c.html(await render(<WNUnsubscribe recipient={email} />, {plainText: true}), 200)
    })

export default app