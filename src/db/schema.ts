import {integer, pgTable, varchar} from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({length: 255}).notNull().unique()
})

export const reviews = pgTable('reviews', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: integer()
    .notNull()
    .references(() => products.id, {onDelete: 'cascade'}),
  rating: integer().notNull(),
  comment: varchar({length: 255}).notNull()
})
