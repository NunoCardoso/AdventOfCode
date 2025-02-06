import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let values: number[] = []
  for await (const line of lineReader) values.push(+line)

  const solveFor2 = (values: number[]): number => {
    let res = 0
    for (let i = 0; i < values.length; i++) {
      if (values.includes(2020 - values[i])) {
        res = values[i] * (2020 - values[i])
        break
      }
    }
    return res
  }

  const solveFor3 = (values: number[]): number => {
    let res = 0
    for (let i = 0; i < values.length - 1; i++) {
      for (let j = i + 1; j < values.length; j++) {
        if (values.includes(2020 - values[i] - values[j])) {
          res = values[i] * values[j] * (2020 - values[i] - values[j])
          break
        }
      }
    }
    return res
  }

  if (!params.skipPart1) part1 = solveFor2(values)
  if (!params.skipPart2) part2 = solveFor3(values)

  return { part1, part2 }
}
