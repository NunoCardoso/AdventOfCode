import { Params } from 'aoc.d'
import { JsonableValue } from 'ts-jest'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let doIt: boolean = true
  for await (const line of lineReader) {
    const values = line.match(/(mul\(\d+,\d+\)|(do\(\))|(don't\(\)))/g)
    values.forEach((value: string) => {
      if (value.startsWith('do(')) doIt = true
      if (value.startsWith("don't(")) doIt = false
      if (value.startsWith('mul(')) {
        let values = value.match(/\((\d+),(\d+)\)/)?.map(Number)
        part1 += values![1] * values![2]
        if (doIt) part2 += values![1] * values![2]
      }
    })
  }

  return { part1, part2 }
}
