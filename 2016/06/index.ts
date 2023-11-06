import { Params } from '../../aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: string = ''

  let data: Array<Record<string, number>> = []

  for await (const line of lineReader) {
    const val = line.split('')
    if (data.length === 0) {
      data = new Array(val.length)
    }
    for (let i = 0; i < val.length; i++) {
      if (data[i] === undefined) {
        data[i] = {}
      }
      if (!Object.prototype.hasOwnProperty.call(data[i], val[i])) {
        data[i][val[i]] = 1
      } else {
        data[i][val[i]]++
      }
    }
  }

  data.forEach((col, i) => {
    const sorted = Object.keys(data[i]).sort((a, b) => data[i][b] - data[i][a])
    part1 += sorted[0]
    part2 += sorted[sorted.length - 1]
  })

  return {
    part1,
    part2
  }
}
