import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const sequences: Array<Array<number>> = []
  for await (const line of lineReader) {
    sequences.push(line.split(/\s+/).map(Number))
  }

  const solveFor = (sequences: Array<Array<number>>, mode: string): number =>
    sequences.reduce((acc: number, sequence, index: number) => {
      const lastNumbers = []
      const firstNumbers = []
      while (sequence.some((value: number) => value !== 0)) {
        const newSequence: Array<number> = []
        lastNumbers.push(sequence[sequence.length - 1])
        firstNumbers.push(sequence[0])
        for (let i = 0; i < sequence.length - 1; i++) {
          newSequence.push(sequence[i + 1] - sequence[i])
        }
        sequence = newSequence
      }
      return acc + (mode === 'part1' ? lastNumbers.reduce((a, b) => a + b) : firstNumbers.reverse().reduce((a, b) => b - a))
    }, 0)

  if (!params.skipPart1) {
    part1 = solveFor(sequences, 'part1')
  }
  if (!params.skipPart2) {
    part2 = solveFor(sequences, 'part2')
  }

  return { part1, part2 }
}
