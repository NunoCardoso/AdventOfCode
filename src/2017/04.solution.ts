import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const values = line.split('')
    part1 = values.length
    part2 = values.length
  }

  const solveFor = (): number => {
    return 0
  }

  if (!params.skipPart1) {
    part1 = solveFor()
  }
  if (!params.skipPart2) {
    part2 = solveFor()
  }

  return { part1, part2 }
}
