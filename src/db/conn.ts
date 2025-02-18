import 'dotenv/config'
import {drizzle} from 'drizzle-orm/node-postgres'
import * as schema from './schema.js'

const dbUrl = process.env.DATABASE_URL

if (!dbUrl) {
  throw new Error('DATABASE_URL is required')
}

export const db = drizzle(dbUrl, {schema})
