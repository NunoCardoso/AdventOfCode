import { Params } from 'aoc.d'
import { range } from 'util/range'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getID = (row: number, column: number) => row * 8 + column

  let seats: Record<string, number[]> = {}

  for await (const line of lineReader) {
    let row = parseInt(line.substring(0, 7).replaceAll('F', '0').replaceAll('B', '1'), 2)
    let column = parseInt(line.substring(7, 10).replaceAll('R', '1').replaceAll('L', '0'), 2)
    if (!seats[row.toString()]) seats[row.toString()] = []
    seats[row.toString()].push(column)
    if (getID(row, column) > part1) part1 = getID(row, column)
  }

  for (let row of Object.keys(seats)) {
    if (seats[row].length !== 8 && +row !== 0) {
      let column = range(8).find((n) => !seats[row].includes(n))
      if (column) {
        part2 = getID(+row, column)
        break
      }
    }
  }

  return { part1, part2 }
}
