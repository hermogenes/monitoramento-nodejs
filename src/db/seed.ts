import {products} from './schema.js'
import {db} from './conn.js'

async function main() {
  await db
    .insert(products)
    .values([{name: 'Apple AirPods'}, {name: 'Apple Watch'}, {name: 'Apple iPhone'}, {name: 'Samsung S25'}, {name: 'Airfryer'}])
    .onConflictDoNothing()
    .execute()

  const allProducts = await db.select().from(products).execute()

  console.table(allProducts)

  process.exit()
}

main()
