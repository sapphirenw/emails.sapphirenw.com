import { Hono } from "hono";
import { getLogger } from "@logtape/logtape";
import { fetchUser } from "./user";

const logger = getLogger("app")

const app = new Hono()
    .get("/:email/:projectId", async (c) => {
        const { email, projectId } = c.req.param()
        
        const user = await fetchUser(email, Number(projectId))
        logger.info("Successfully fetched user", {"user": user})

        return c.json(user, 200)
    })

export default app