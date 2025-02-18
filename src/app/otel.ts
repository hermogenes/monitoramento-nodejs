import {context} from '@opentelemetry/api'
import {getRPCMetadata, setRPCMetadata} from '@opentelemetry/core'
import type {MiddlewareHandler} from 'hono'

/**
 * Middleware that sets the route path as the RPC metadata route.
 * When using the OpenTelemetry HTTP instrumentation, this will allow the route to be displayed in traces.
 * It also sets the route path for metrics which prevents the route from being displayed as "unknown".
*/
export const otelMiddleware: MiddlewareHandler = async (ctx, next) => {
  await next()

  const otelCtx = context.active()
  const metadata = getRPCMetadata(otelCtx)

  if (!metadata) {
    return
  }

  metadata.route = ctx.req.routePath
  setRPCMetadata(otelCtx, metadata)
}
