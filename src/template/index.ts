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

  return { part1, part2 }
}
