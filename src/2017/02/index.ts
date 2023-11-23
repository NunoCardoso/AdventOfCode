import { Params } from 'aoc.d'
import { parseInt } from 'lodash'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    let min = 9999
    let max = 0
    let values: Array<number> = line.split(/\s+/).map((s: string) => {
      const i = parseInt(s)
      if (i < min) {
        min = i
      }
      if (i > max) {
        max = i
      }
      return i
    })
    part1 += max - min

    values = values.sort((a, b) => (a - b > 0 ? 1 : -1))

    loop: for (let i = 0; i < values.length - 1; i++) {
      for (let j = i + 1; j < values.length; j++) {
        if (values[j] % values[i] === 0) {
          part2 += values[j] / values[i]
          break loop
        }
      }
    }
  }

  return { part1, part2 }
}
