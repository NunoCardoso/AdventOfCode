import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0

  let data: number[] = []
  for await (const line of lineReader) data = line.match(/\d+/g).map(Number)

  const generateNewCode = (code: number): number => (code * 252533) % 33554393

  let row = 1
  let column = 1
  let code = params.firstCode

  while (part1 === 0) {
    if (row === 1) {
      row = column + 1
      column = 1
    } else {
      column++
      row--
    }
    code = generateNewCode(code)
    if (row === data[0] && column === data[1]) part1 = code
    log.debug('code', code, 'column', column, 'row', row)
  }

  return { part1 }
}
