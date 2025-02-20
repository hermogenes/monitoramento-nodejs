import http from 'k6/http'
import {check, sleep} from 'k6'
import type {Options} from 'k6/options'

export const options: Options = {
  scenarios: {
    readonly: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      stages: [
        {target: 20, duration: '1m30s'},
        {target: 40, duration: '3m'},
        {target: 50, duration: '3m'},
        {target: 20, duration: '3m'},
        {target: 30, duration: '3m'},
        {target: 0, duration: '1m30s'},
        {target: 20, duration: '1m30s'},
        {target: 40, duration: '3m'},
        {target: 50, duration: '3m'},
        {target: 20, duration: '3m'},
        {target: 30, duration: '3m'},
        {target: 0, duration: '1m30s'},
        {target: 20, duration: '1m30s'},
        {target: 40, duration: '3m'},
        {target: 50, duration: '3m'},
        {target: 20, duration: '3m'},
        {target: 30, duration: '3m'},
        {target: 0, duration: '1m30s'}
      ],
      preAllocatedVUs: 50,
      maxVUs: 1000,
      exec: 'readOnlyTest'
    }
  }
}

export function readOnlyTest() {
  const res = http.get('http://localhost:3001/products', {
    tags: {name: 'list-products'}
  })

  check(res, {'status is 200': (res) => res.status === 200})

  const products = res.status === 200 ? (res.json() as {id: number}[]) : []

  for (const product of products) {
    const resProduct = http.get(`http://localhost:3001/products/${product.id}`, {
      tags: {name: 'get-product-by-id'}
    })

    check(resProduct, {'status is 200': (res) => res.status === 200})

    const resReviews = http.get(`http://localhost:3001/products/${product.id}/reviews`, {
      tags: {name: 'list-reviews'}
    })

    check(resReviews, {'status is 200': (res) => res.status === 200})
  }
  sleep(1)
}
