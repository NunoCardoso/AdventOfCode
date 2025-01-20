import { Params } from 'aoc.d'
import { range } from 'util/range'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let values: number[] = []
  for await (const line of lineReader) values = line.split(',').map(Number)

  const solveFor = (values: number[]): number => {
    let cursor = 0
    while (true) {
      if (values[cursor] === 99) break
      if (values[cursor] === 1) values[values[cursor + 3]] = values[values[cursor + 1]] + values[values[cursor + 2]]
      if (values[cursor] === 2) values[values[cursor + 3]] = values[values[cursor + 1]] * values[values[cursor + 2]]
      cursor += 4
    }
    return values[0]
  }

  if (!params.skipPart1) {
    let valuesPart1 = [...values]
    if (!params.isTest) {
      valuesPart1[1] = 12
      valuesPart1[2] = 2
    }
    part1 = solveFor(valuesPart1)
  }
  if (!params.skipPart2) {
    for (let noun of range(99)) {
      for (let verb of range(99)) {
        let valuesPart2 = [...values]
        valuesPart2[1] = noun
        valuesPart2[2] = verb
        let result = solveFor(valuesPart2)
        if (result === params.target) {
          part2 = 100 * noun + verb
          break
        }
      }
      if (part2 !== 0) break
    }
  }

  return { part1, part2 }
}
