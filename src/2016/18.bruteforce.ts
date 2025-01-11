import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const countDots = (line: string) => line.replaceAll('^', '').length

  const isTrap = (tile: string) => tile === '^'
  const getTile = (left: string, center: string, right: string): string => {
    if (isTrap(left) && isTrap(center) && !isTrap(right)) return '^'
    if (!isTrap(left) && isTrap(center) && isTrap(right)) return '^'
    if (isTrap(left) && !isTrap(center) && !isTrap(right)) return '^'
    if (!isTrap(left) && !isTrap(center) && isTrap(right)) return '^'
    return '.'
  }

  let row: string = ''
  for await (const line of lineReader) row = line

  const solveFor = (row: string, rowNumber: number) => {
    let count = countDots(row)
    let it = 1
    while (it++ < rowNumber) {
      let newLine = ''
      for (let j = 0; j < row.length; j++) {
        newLine += getTile(row[j - 1], row[j], row[j + 1])
      }
      row = newLine
      count += countDots(row)
    }
    return count
  }

  if (!params.skipPart1) part1 = solveFor(row, params.rows.part1)
  if (!params.skipPart2) part2 = solveFor(row, params.rows.part2)

  return { part1, part2 }
}
