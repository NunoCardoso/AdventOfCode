import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    let sequence: number[] = line.split(/\s+/).map(Number)

    const lastNumbers = []
    const firstNumbers = []
    while (sequence.some((value: number) => value !== 0)) {
      const newSequence: number[] = []
      lastNumbers.push(sequence[sequence.length - 1])
      firstNumbers.push(sequence[0])
      for (let i = 0; i < sequence.length - 1; i++) newSequence.push(sequence[i + 1] - sequence[i])
      sequence = newSequence
    }
    part1 += lastNumbers.reduce((a, b) => a + b)
    part2 += firstNumbers.reverse().reduce((a, b) => b - a)
  }

  return { part1, part2 }
}
