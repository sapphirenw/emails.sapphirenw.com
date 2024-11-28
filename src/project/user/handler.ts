import { Hono } from "hono";
import { getLogger } from "@logtape/logtape";
import { fetchUser } from "./user";
import { userUnsubscribe } from "../../database/queries_sql";
import pool from "../../database/database";

const logger = getLogger("app")

const app = new Hono()
    .get("/:email/:projectId", async (c) => {
        const { email, projectId } = c.req.param()
        
        const user = await fetchUser(email, Number(projectId))
        logger.info("Successfully fetched user", {"user": user})

        return c.json(user, 200)
    })
    .post("/:email/:projectId/unsubscribe", async (c) => {
        const { email, projectId } = c.req.param()
        
        const user = await fetchUser(email, Number(projectId))
        logger.info("Successfully fetched user", {"user": user})

        await userUnsubscribe(pool, {email: email, projectId: Number(projectId), notificationAll: 0})

        return c.text("Accepted", 202)
    })

export default app