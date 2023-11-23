import { Params } from 'aoc.d'
import { parseInt } from 'lodash'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const values = line.split('')
    for (let i = 0; i < values.length; i++) {
      const j = (i + 1) % values.length
      const k = (i + values.length / 2) % values.length
      if (values[i] === values[j]) {
        part1 += parseInt(values[i])
      }
      if (values[i] === values[k]) {
        part2 += parseInt(values[i])
      }
    }
  }

  //  1167 to low

  return { part1, part2 }
}
