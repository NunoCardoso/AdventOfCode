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

  const solveForPart1 = (): number =>
    firewall.reduce((acc: number, layer, index) => {
      if (layer !== null) {
        let position = getPosition(layer!, index)
        if (position === 0) {
          return acc + layer * index
        }
      }
      return acc
    }, 0)

  const solveForPart2 = (): number => {
    let delay = 0
    let i = 0
    while (true) {
      let layer = firewall[i]
      if (layer !== null && getPosition(layer!, i + delay) === 0) {
        delay++
        i = -1
      }
      i++
      if (i === firewall.length) break
    }
    return delay
  }

  if (!params.skipPart1) {
    part1 = solveForPart1()
  }
  if (!params.skipPart2) {
    part2 = solveForPart2()
  }

  return { part1, part2, getPosition }
}
