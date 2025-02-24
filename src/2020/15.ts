import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let maxIterations = Math.max(params.iterations.part1, params.iterations.part2)
  let values: number[] = new Array(maxIterations)
  let cursor: number = 0
  let lastSpokenValue: number = 0
  for await (const line of lineReader) {
    let input = line.split(',')
    cursor = input.length
    input.map(Number).forEach((n: number, i: number) => {
      if (i !== input.length - 1) values[n] = i + 1
      else lastSpokenValue = n
    })
  }

  while (cursor < maxIterations) {
    if (!values[lastSpokenValue]) {
      values[lastSpokenValue] = cursor
      lastSpokenValue = 0
    } else {
      let newLastSpokenValue = cursor - values[lastSpokenValue]
      values[lastSpokenValue] = cursor
      lastSpokenValue = newLastSpokenValue
    }
    cursor++
    if (cursor === params.iterations.part1) part1 = lastSpokenValue
    if (cursor === params.iterations.part2) part2 = lastSpokenValue
  }

  return { part1, part2 }
}
