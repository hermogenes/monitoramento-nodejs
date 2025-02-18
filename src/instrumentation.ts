import module from 'node:module'
import {diag, DiagConsoleLogger, DiagLogLevel, metrics} from '@opentelemetry/api'
import {NodeSDK} from '@opentelemetry/sdk-node'
import {getNodeAutoInstrumentations} from '@opentelemetry/auto-instrumentations-node'
import defaultMetrics from 'opentelemetry-node-metrics'

if (typeof module.register === 'function') {
  module.register("@opentelemetry/instrumentation/hook.mjs", import.meta.url);
}

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO)

const sdk = new NodeSDK({
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: (req) => req.headers.host?.endsWith(':9464') ?? false
      }
    })
  ]
})

sdk.start()

defaultMetrics(metrics.getMeterProvider())
