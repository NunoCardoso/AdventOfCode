import { Params } from 'aoc.d'
import { Combination } from 'js-combinatorics'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const packages: Array<number> = []
  for await (const line of lineReader) {
    packages.push(+line)
  }

  const calculateEntanglement = (packages: Array<number>) => packages.reduce((x: number, y: number) => x * y, 1)

  const solveFor = (packages: Array<number>, compartments: number) => {
    const totalWeight = packages.reduce((a, b) => a + b)
    const targetWeight = totalWeight / compartments

    log.debug('Total Weight', totalWeight, 'Target Weight', targetWeight)

    let solutions: Array<Array<number>> = []
    let numberOfPackages = 1

    while (solutions.length === 0) {
      solutions = new Combination(packages, numberOfPackages).toArray().filter((a) => a.reduce((x, y) => x + y) === targetWeight)
      numberOfPackages++
    }

    return solutions.map(calculateEntanglement).sort((a, b) => a - b)[0]
  }
  part1 = solveFor(packages, params.compartments.part1)
  part2 = solveFor(packages, params.compartments.part2)

  return { part1, part2 }
}
