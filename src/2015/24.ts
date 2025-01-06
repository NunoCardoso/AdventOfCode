import { Params } from 'aoc.d'
import { Combination } from 'js-combinatorics'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const packages: number[] = []
  for await (const line of lineReader) packages.push(+line)
  // Sort numbers in descending order
  packages.sort((a, b) => b - a)

  const solveFor = (packages: number[], numberOfCompartments: number): number => {
    const totalWeight = packages.reduce((a, b) => a + b)
    const targetWeight = totalWeight / numberOfCompartments

    let minPackages = 0
    let sum = 0
    while (sum < targetWeight) sum += packages[minPackages++]

    let answer

    while (!answer) {
      for (let c of new Combination(packages, minPackages)) {
        if (c.reduce((a: number, b: number) => a + b, 0) === targetWeight) {
          answer = Math.min(
            answer ?? Number.MAX_VALUE,
            c.reduce((a: number, b: number) => a * b, 1)
          )
        }
      }
      minPackages++
    }

    return answer
  }

  if (!params.skipPart1) part1 = solveFor(packages, params.compartments.part1)
  if (!params.skipPart2) part2 = solveFor(packages, params.compartments.part2)

  return { part1, part2 }
}
