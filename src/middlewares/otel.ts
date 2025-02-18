import {context} from '@opentelemetry/api'
import {getRPCMetadata, setRPCMetadata} from '@opentelemetry/core'
import type {MiddlewareHandler} from 'hono'

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
