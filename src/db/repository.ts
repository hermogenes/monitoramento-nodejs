import {db} from './conn.js'
import {reviews} from './schema.js'

export const repository = {
  getProductById: async (id: number) => {
    return await db.query.products.findFirst({where: (p, {eq}) => eq(p.id, id)}).execute()
  },

  listProducts: async () => {
    return await db.query.products.findMany().execute()
  },

  listReviews: async (productId: number) => {
    return await db.query.reviews.findMany({where: (r, {eq}) => eq(r.productId, productId), columns: {rating: true, comment: true}}).execute()
  },

  createReview: async (productId: number, review: {rating: number; comment: string}): Promise<number> => {
    const inserted = await db
      .insert(reviews)
      .values({productId, ...review})
      .returning()

    return inserted[0].id
  }
}
