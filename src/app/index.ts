import {Hono} from 'hono'
import {otelMiddleware} from './otel.js'
import {productApp} from './products.js'
import {requestId} from 'hono/request-id'
import {simulationMiddleware} from './simulation.js'

export const app = new Hono()

app.use('*', requestId())

app.use(otelMiddleware)

app.use(simulationMiddleware)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/products', productApp)
