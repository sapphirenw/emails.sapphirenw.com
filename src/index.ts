import "./utils/env"
import "./instrumentation"

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import emails from "./email/handler"
import users from "./project/user/handler"
import unsubscribe from "./project/user/unsubscribe"
import webhooks from "./webhooks"
import { exit } from 'process'
import pool from "./database/database"
import { configure, getConsoleSink, getLogger } from "@logtape/logtape";
import { loggerMiddleware } from "./middleware/logger"
import { requestId } from "hono/request-id"
import { bearerAuth } from "hono/bearer-auth"
import { logfmt } from "./utils/logfmt"
import { otelMiddleware } from "./middleware/otel"
import { getOpenTelemetrySink } from "@logtape/otel";
import { timeoutMiddleware } from "./middleware/timeout"

// setup environment
const VERSION = process.env.APP_VERSION ?? "v0.0.1-dev"
const PORT = Number(process.env.APP_PORT ?? "3000")

await configure({
    sinks: {
        otel: getOpenTelemetrySink({
            serviceName: process.env.OTEL_SERVICE_NAME ?? "emails.sapphirenw.com",
            otlpExporterConfig: {
                url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/logs`,
            },
        }),
        console: getConsoleSink({
            formatter: (record) => {
                switch (process.env.LOG_FORMAT ?? "") {
                    case "json": return JSON.stringify(record)
                    default: return logfmt(record)
                }
            }
        }),
    },
    loggers: [
        { category: ["logtape", "meta"], sinks: [] }, // hide metadata logging
        { category: ["app"], lowestLevel: "debug", sinks: VERSION.includes("dev") ? ["console"] : ["otel"] },
        { category: ["middleware"], lowestLevel: "debug", sinks: VERSION.includes("dev") ? ["console"] : ["otel"] },
    ]
});

// create the logger
const logger = getLogger(["app"])

// ensure a resend api key was set
if (process.env.RESEND_API_KEY === undefined) {
    logger.fatal("FATAL: An environment variable with the value: `RESEND_API_KEY` must be set")
    exit(1)
}

// ensure an api key was set
if (process.env.APP_API_KEY === undefined) {
    logger.fatal("FATAL: An environment variable with the value: `APP_API_KEY` must be set")
    exit(1)
}

// create the app with middleware
const app = new Hono()
app.use(requestId())
app.use(otelMiddleware())
app.use(loggerMiddleware)
app.use(timeoutMiddleware)

// auth middleware
const authMiddleware = bearerAuth({ token: process.env.APP_API_KEY })
app.use('*', (ctx, next) => {
    if (!ctx.req.path.startsWith('/unsubscribe') && !ctx.req.path.startsWith('/webhooks')) {
        return authMiddleware(ctx, next)
    }
    return next()
})

// default index route
app.get("/", async (c) => {
    try {
        // perform a test query
        const [rows, fields] = await pool.execute("SELECT 1")
        return c.json({
            message: "Successfully authenticated.",
            databaseResponse: rows,
            version: VERSION,
        }, 200)
    } catch (_e) {
        const e = _e as Error
        logger.fatal("failed to get the index", {
            "stack": e.stack,
        })
        return c.json({ message: `${e.message}`, version: VERSION }, 400)
    }
})

// create routes
app.route("/emails", emails)
app.route("/users", users)
app.route("/unsubscribe", unsubscribe)
app.route("/webhooks", webhooks)

// for when only using otel collector to show that app started
console.log(`Server is running on http://localhost:${PORT}`)
serve({
    fetch: app.fetch,
    port: PORT,
})
