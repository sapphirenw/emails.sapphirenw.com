import { getLogger } from "@logtape/logtape"
import { createMiddleware } from "hono/factory"

const logger = getLogger("middleware")

const TIMEOUT_MS = parseInt(process.env.TIMEOUT_MS || '10000', 10); // default 10s

export const timeoutMiddleware = createMiddleware(async (c, next) => {
    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request Timeout')), TIMEOUT_MS)
    );

    try {
        // Run the logic and enforce timeout
        await Promise.race([next(), timeout]);
    } catch (err) {
        if (err instanceof Error && err.message === 'Request Timeout') {
            return c.text('Request Timeout', 408);
        }
        throw err
    }
})