import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const calculateFuelFor = (mass: number): number => {
    let result = Math.floor(mass / 3) - 2
    return result < 0 ? 0 : result
  }

  const calculateFuel2for = (mass: number): number => {
    let totalFuel: number = 0
    let fuel: number = mass
    do {
      fuel = calculateFuelFor(fuel)
      totalFuel += fuel
    } while (fuel > 0)
    return totalFuel
  }

  for await (const mass of lineReader) {
    part1 += calculateFuelFor(+mass)
    part2 += calculateFuel2for(+mass)
  }

  return { part1, part2 }
}
