import { getLogger } from "@logtape/logtape";
import { createMiddleware } from "hono/factory";

// create a reference to the middleware
const logger = getLogger("middleware")

// check either the header or the url param
export const loggerMiddleware = createMiddleware(async (c, next) => {
    const begin = Date.now()
    const message = `${c.req.method} ${c.req.path}` 
    const rawHeaders = c.req.header();
    const filteredHeaders = Object.fromEntries(
        Object.entries(rawHeaders).filter(([key]) => key.toLowerCase() !== 'authorization')
    );
    const metadata = {
        method: c.req.method,
        path: c.req.path,
        headers: filteredHeaders,
        requestId: c.get("requestId")
    };

    logger.info(message, metadata)

    await next()

    const finishedData = {
        duration: Date.now() - begin,
        durationUnit: "ms",
        status: c.res.status,
    }

    if (c.error || c.res.status > 299) {
        logger.error(message, {
            ...metadata,
            ...finishedData,
        });
    } else {
        logger.info(message, {
            ...metadata,
            ...finishedData,
        });
    }
})