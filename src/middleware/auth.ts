import { getLogger } from '@logtape/logtape'
import { createMiddleware } from 'hono/factory'

const logger = getLogger("middleware")

// check either the header or the url param
export const authMiddleware = createMiddleware(async (c, next) => {
    // ensure the api key matches
    if (c.req.header("Authorization") !== `Bearer ${process.env.APP_API_KEY}`) {
        logger.warn("authentication failed", {
            token: c.req.header("Authorization")
        })
        c.status(403)
        throw Error("UNAUTHORIZED")
    }

    await next()
})