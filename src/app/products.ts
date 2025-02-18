import {repository} from '../db/repository.js'
import {Hono} from 'hono'

export const productApp = new Hono()

productApp.get('/', async (ctx) => {
  const products = await repository.listProducts()
  return ctx.json(products, 200)
})

productApp.get('/:id', async (ctx) => {
  const id = Number(ctx.req.param('id'))
  const product = await repository.getProductById(id)
  return product ? ctx.json(product, 200) : ctx.json({reason: 'Product not found'}, 404)
})

productApp.get('/:id/reviews', async (ctx) => {
  const id = Number(ctx.req.param('id'))
  const product = await repository.getProductById(id)

  if (!product) {
    return ctx.json({reason: 'Product not found'}, 404)
  }

  const items = await repository.listReviews(id)
  return ctx.json(items, 200)
})

productApp.post('/:id/reviews', async (ctx) => {
  const productId = Number(ctx.req.param('id'))
  const product = await repository.getProductById(productId)

  if (!product) {
    return ctx.json({reason: 'Product not found'}, 404)
  }

  const review = await ctx.req.json<{rating: number; comment: string}>()

  const id = await repository.createReview(productId, review)

  return ctx.json({id}, 200)
})
