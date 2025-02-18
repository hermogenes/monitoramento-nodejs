import {serve} from '@hono/node-server'
import {app} from './app/index.js'

serve(
  {
    fetch: app.fetch,
    port: 3001,
    hostname: '0.0.0.0'
  },
  (info) => {
    console.log(`Server is running on http://${info.address}:${info.port}`)
  }
)
