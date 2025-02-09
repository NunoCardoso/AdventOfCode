import { Params } from 'aoc.d'
import { permutation } from 'util/permutation'
import { range } from 'util/range'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let values: number[] = []
  for await (const line of lineReader) values.push(+line)

  const solveForPart1 = (preamble: number[], values: number[]): number => {
    for (let value of values) {
      if (permutation(preamble, 2).every((p) => p[0] + p[1] !== value)) return value
      preamble.shift()
      preamble.push(value)
    }
    return 0
  }

  const solveForPart2 = (values: number[], target: number): number => {
    for (let cursorLeft of range(values.length)) {
      let acc: number = 0
      let cursorRight = cursorLeft
      while (acc < target) acc += values[cursorRight++]
      if (acc === target) {
        let numberRange = values.slice(cursorLeft, cursorRight)
        return Math.max(...numberRange) + Math.min(...numberRange)
      }
    }
    return 0
  }

  part1 = solveForPart1(values.slice(0, params.preamble), values.slice(params.preamble, values.length))
  part2 = solveForPart2(values, part1)

  return { part1, part2 }
}
