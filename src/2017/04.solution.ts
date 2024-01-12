import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const values = line.split(/\s+/g)
    const values2 = values
      .map((word: string) => {
        let w = word.split('')
        .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0) > 0 ? 1 : -1)
        .join('')
        return w
      })

    const set: Set<string> = new Set(values)
    const set2: Set<string> = new Set(values2)
  //  console.log(set, values)
    part1 += values.length === set.size ? 1 : 0
    part2 += values2.length === set2.size ? 1 : 0


  }
  console.log(part1, part2)

  return { part1, part2 }
}
