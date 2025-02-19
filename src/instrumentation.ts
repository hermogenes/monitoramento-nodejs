import module from 'node:module'
import {diag, DiagConsoleLogger, DiagLogLevel, metrics} from '@opentelemetry/api'
import {NodeSDK} from '@opentelemetry/sdk-node'
import {DnsInstrumentation} from '@opentelemetry/instrumentation-dns'
import {FsInstrumentation} from '@opentelemetry/instrumentation-fs'
import {GrpcInstrumentation} from '@opentelemetry/instrumentation-grpc'
import {HttpInstrumentation} from '@opentelemetry/instrumentation-http'
import {NetInstrumentation} from '@opentelemetry/instrumentation-net'
import {PgInstrumentation} from '@opentelemetry/instrumentation-pg'
import {PinoInstrumentation} from '@opentelemetry/instrumentation-pino'
import {UndiciInstrumentation} from '@opentelemetry/instrumentation-undici'

import defaultMetrics from 'opentelemetry-node-metrics'

if (typeof module.register === 'function') {
  module.register('@opentelemetry/instrumentation/hook.mjs', import.meta.url)
}

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO)

const sdk = new NodeSDK({
  instrumentations: [
    new DnsInstrumentation(),
    new FsInstrumentation(),
    new GrpcInstrumentation(),
    new HttpInstrumentation({
      ignoreIncomingRequestHook: (req) => req.headers.host?.endsWith(':3001') !== true,
    }),
    new NetInstrumentation(),
    new PgInstrumentation(),
    new PinoInstrumentation(),
    new UndiciInstrumentation()
  ]
})

sdk.start()

const meterProvider = metrics.getMeterProvider()

defaultMetrics(meterProvider)

process.on('SIGINT', () => {
  sdk.shutdown().then(() => {
    process.exit()
  })
})
