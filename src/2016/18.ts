import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let row: string = ''
  for await (const line of lineReader) row = line

  // this way of counting is faster than row.replaceAll('^', '').length
  let count = row.split('').filter((x) => x === '.').length
  let iterations = 1
  let maxIterations = Math.max(params.rows.part1 ?? 0, params.rows.part2 ?? 0)
  let newLine, _row
  while (iterations++ < maxIterations) {
    newLine = ''
    _row = `.${row}.`
    for (let i = 1; i < _row.length - 1; i++) {
      if (_row[i - 1] !== _row[i + 1]) newLine += '^'
      else {
        newLine += '.'
        count++
      }
    }
    row = newLine
    if (part1 === 0 && iterations === params.rows.part1) part1 = count
  }
  part2 = count

  return { part1, part2 }
}
