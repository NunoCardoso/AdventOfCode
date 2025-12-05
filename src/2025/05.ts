import type { Params } from 'aoc.d'
import type { Range } from 'declarations.d'
import { mergeRange } from 'util/range'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let ranges: Range[] = []
  let values: number[] = []
  for await (const line of lineReader) {
    if (line.length > 0) {
      let v = line.split('-').map(Number)
      if (v.length === 2) ranges.push(v)
      if (v.length === 1) values.push(v[0])
    }
  }

  const inRange = (v: number): boolean => ranges.some((r) => r[0] <= v && v <= r[1])

  if (!params.skipPart1) part1 = values.filter((v) => inRange(v)).length

  if (!params.skipPart2) part2 = mergeRange(ranges).reduce((acc, val) => acc + (val[1] - val[0]) + 1, 0)

  return { part1, part2 }
}
