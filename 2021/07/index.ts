import { Params } from '../../aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const crabs: Record<string, number> = {}
  let minCrab: number = 9999999999999
  let maxCrab: number = 0

  for await (const line of lineReader) {
    line.split(',').forEach((crab: string) => {
      const _crab = parseInt(crab)
      if (_crab < minCrab) {
        minCrab = _crab
      }
      if (_crab > maxCrab) {
        maxCrab = _crab
      }
      if (Object.prototype.hasOwnProperty.call(crabs, crab)) {
        crabs[crab]++
      } else {
        crabs[crab] = 1
      }
    })
  }

  let part1 = 9999999999999
  let part2 = 9999999999999

  for (let i = minCrab; i <= maxCrab; i++) {
    let fuelSpentPart1: number = 0
    let fuelSpentPart2: number = 0

    Object.keys(crabs).forEach((key) => {
      const distance = Math.abs(parseInt(key) - i)
      fuelSpentPart1 += distance * crabs[key]
      fuelSpentPart2 += (distance + ((distance - 1) * (distance - 1) + (distance - 1)) / 2) * crabs[key]
    })

    if (fuelSpentPart1 < part1) {
      part1 = fuelSpentPart1
    }
    if (fuelSpentPart2 < part2) {
      part2 = fuelSpentPart2
    }
  }

  return {
    part1,
    part2
  }
}
