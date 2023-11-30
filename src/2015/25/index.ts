import { Params } from 'aoc.d'
import { parseInt } from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  const part2: number = 0

  let data: Array<number> = []

  for await (const line of lineReader) {
    data = [...line.matchAll(/\d+/g)].map((x: any) => parseInt(x[0]))
  }

  const generateNewCode = (code: number): number => {
    return (code * 252533) % 33554393
  }

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
    if (row === data[0] && column === data[1]) {
      part1 = code
    }
    log.debug('code', code, 'column', column, 'row', row)
  }

  return { part1, part2 }
}
