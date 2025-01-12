import { Params } from 'aoc.d'
import { Range } from 'declarations'
import { mergeRange } from 'util/range'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let ranges: Range[] = []
  for await (const line of lineReader) ranges.push(line.split('-').map(Number))

  ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1])
  ranges = mergeRange(ranges)

  if (!params.skipPart1) part1 = ranges[0][1] + 1
  if (!params.skipPart2) {
    // + 1, because 0 is also a IP
    part2 = params.limit + 1 - ranges.reduce((acc, range) => acc + (range[1] - range[0] + 1), 0)
  }

  return { part1, part2 }
}
