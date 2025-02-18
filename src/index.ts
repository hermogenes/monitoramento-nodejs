import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {otelMiddleware} from './middlewares/otel.js'

const app = new Hono()

app.use(otelMiddleware)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/products/:id/reviews', (c) => {
  const params = c.req.param()
  if (params.id === 'error') {
    throw new Error('Error')
  }
  return c.json(params)
})

serve(
  {
    fetch: app.fetch,
    port: 3001,
    hostname: '0.0.0.0',
  },
  (info) => {
    console.log(`Server is running on http://${info.address}:${info.port}`)
  }
)
