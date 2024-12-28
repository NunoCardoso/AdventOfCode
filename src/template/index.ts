import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let values: string[]
  for await (const line of lineReader) {
    values = line.split('')
  }

  const solveFor = (): number => {
    log.info('solved')
    return values.length
  }

  if (!params.skipPart1) {
    part1 = solveFor()
  }
  if (!params.skipPart2) {
    part2 = solveFor()
  }

  return { part1, part2 }
}
