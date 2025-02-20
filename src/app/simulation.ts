import type {MiddlewareHandler} from 'hono/types'
import {flagClient} from '../flags.js'
import {HTTPException} from 'hono/http-exception'

const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const addLatency = async (latency: [number, number]) => {
  if (latency[0] === 0 && latency[1] === 0) {
    return
  }

  const extraLatency = randomNum(latency[0], latency[1])

  console.log(`Adding ${extraLatency}ms of latency. Range: ${latency[0]}-${latency[1]}`)

  await sleep(extraLatency)
}

type LatencyConfig = {latency: [number, number]}

export const simulationMiddleware: MiddlewareHandler = async (ctx, next) => {
  const targetingKey = ctx.get('requestId')
  const [simulateError, simulateLatency] = await Promise.all([
    flagClient.getBooleanValue('simulate-server-error', false, {targetingKey}),
    flagClient.getObjectValue<LatencyConfig>('simulate-server-latency', {latency: [0, 0]}, {targetingKey})
  ])

  await addLatency(simulateLatency.latency)

  await next()

  if (simulateError) {
    console.log('Simulating server error')
    throw new HTTPException(500, {message: 'Simulated server error'})
  }
}
