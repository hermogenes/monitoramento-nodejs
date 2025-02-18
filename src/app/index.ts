import {otelMiddleware} from './otel.js'
import {productApp} from './products.js'
import {Hono} from 'hono'

export const app = new Hono()

app.use(otelMiddleware)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/products', productApp)
