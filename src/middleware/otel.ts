import { getLogger } from "@logtape/logtape";
import { type Tracer } from "@opentelemetry/api";
import {
  context,
  propagation,
  SpanKind,
  SpanStatusCode,
  trace,
} from "@opentelemetry/api";
import type { MiddlewareHandler } from "hono";

// simple hono otel middleware from: https://github.com/honojs/hono/issues/1176

let rawTracer: Tracer | undefined;

export const otelMiddleware = (): MiddlewareHandler => async (ctx, next) => {
  const logger = getLogger("app")

  if (!rawTracer) {
    rawTracer = trace.getTracer("hono", process.env.APP_VERSION);
  }

  const span = rawTracer.startSpan(
    "opentelemetry.infrastructure.middleware",
    {
      attributes: {
        "http.method": ctx.req.method,
        "http.url": ctx.req.url,
      },
      kind: SpanKind.SERVER,
    },
    propagation.extract(context.active(), ctx.req.raw.headers),
  );

  try {
    await context.with(trace.setSpan(context.active(), span), async () => {
      await next();
    });
    if (ctx.error) {
      logger.error(ctx.error.message);
      span.recordException(ctx.error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: ctx.error.message,
      });
    } else {
      const statusCode = ctx.res.status;
      if (statusCode >= 400) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: `${statusCode}`,
        });
      } else {
        // you can omit this since OK/UNSET is the default
        span.setStatus({ code: SpanStatusCode.OK });
      }
    }
  } catch (error) {
    logger.error(error instanceof Error ? error.message : "unknown error");
    span.recordException(error as Error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : "unknown error",
    });
    throw error;
  }
  span.end();
};