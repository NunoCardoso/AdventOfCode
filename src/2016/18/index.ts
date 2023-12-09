import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const countDots = (line: string) => line.replaceAll('^', '').length

  const isTrap = (tile: string) => tile === '^'
  const getTile = (left: string, center: string, right: string): string => {
    if (isTrap(left) && isTrap(center) && !isTrap(right)) {
      return '^'
    }
    if (!isTrap(left) && isTrap(center) && isTrap(right)) {
      return '^'
    }
    if (isTrap(left) && !isTrap(center) && !isTrap(right)) {
      return '^'
    }
    if (!isTrap(left) && !isTrap(center) && isTrap(right)) {
      return '^'
    }
    return '.'
  }

  let row: string = ''

  for await (const line of lineReader) {
    row = line
  }

  // 1, because input is already line 0 and counted

  const doIt = (row: string, rowNumber: number) => {
    console.log('rowNumber:', rowNumber)
    let count = countDots(row)

    let _row = row
    for (let i = 1; i < rowNumber; i++) {
      let newLine = ''
      for (let j = 0; j < _row.length; j++) {
        newLine += getTile(_row[j - 1], _row[j], _row[j + 1])
      }
      _row = newLine
      count += countDots(_row)
    }
    return count
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = doIt(row, params.rows.part1)
  }
  if (params.skip !== true && params.skip !== 'part2') {
    part2 = doIt(row, params.rows.part2)
  }

  return { part1, part2 }
}
