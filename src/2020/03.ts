import { Params } from 'aoc.d'
import { getKey } from 'util/location'
import { range } from 'util/range'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let trees: Set<string> = new Set<string>()
  let rowIndex: number = 0
  let numberOfColumns: number = 0
  for await (const line of lineReader) {
    ;[...line.matchAll(/#/g)].forEach((match) => trees.add(getKey([rowIndex, match.index])))
    rowIndex++
    if (numberOfColumns === 0) numberOfColumns = line.length
  }

  let increments: [number, number][] = [
    [1, 3],
    [1, 1],
    [1, 5],
    [1, 7],
    [2, 1]
  ]
  let sums: number[] = Array(increments.length).fill(0)
  for (let current of range(rowIndex)) {
    for (let i = 0; i < increments.length; i++) {
      let inc = increments[i]
      let row = inc[0] * current
      let column = (current * inc[1]) % numberOfColumns
      if (row < rowIndex && trees.has(getKey([row, column]))) sums[i]++
    }
  }

  part1 = sums[0]
  part2 = sums.reduce((a, b) => a * b, 1)

  return { part1, part2 }
}
