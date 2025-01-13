import { Params } from 'aoc.d'

// depth, range
type Layer = [number, number]

type Firewall = (number | null)[]
export const getPosition = (range: number, i: number): number | null => {
  // all positions are repeated within layer.depth + layer.depth - 1
  let repeating = (range - 1) * 2
  let firstPosition = i % repeating
  return firstPosition < range ? firstPosition : range - 1 - firstPosition - (range - 1)
}

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let maxLayers: number = -1
  let tempFirewall: Layer[] = []

  for await (const line of lineReader) {
    let layer = line.split(': ').map(Number)
    tempFirewall.push(layer)
    if (layer[0] > maxLayers) maxLayers = layer[0]
  }

  let firewall: Firewall = new Array(maxLayers).fill(null)
  tempFirewall.forEach((layer) => (firewall[layer[0]] = layer[1]))

  part1 = firewall.reduce((acc: number, layer, index) => {
    if (layer !== null) {
      let position = getPosition(layer!, index)
      if (position === 0) return acc + layer * index
    }
    return acc
  }, 0)

  let iterations = 0
  while (true) {
    let layer = firewall[iterations]
    if (layer !== null && getPosition(layer!, iterations + part2) === 0) {
      part2++
      iterations = -1
    }
    iterations++
    if (iterations === firewall.length) break
  }

  return { part1, part2, getPosition }
}
