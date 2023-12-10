import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const sequences: Array<Array<number>> = []
  for await (const line of lineReader) {
    sequences.push(line.split(/\s+/).map(Number))
  }

  const solveFor = (sequences: Array<Array<number>>, mode: string): number => {
    let sum: number = 0

    sequences.forEach((sequence, index: number) => {
      log.debug('#', index, 'sequence', sequence)

      const lastNumbers = []
      const firstNumbers = []

      while (_.some(sequence, (x: number) => x !== 0)) {
        const newSequence: Array<number> = []
        lastNumbers.push(sequence[sequence.length - 1])
        firstNumbers.push(sequence[0])
        for (let i = 0; i < sequence.length - 1; i++) {
          newSequence.push(sequence[i + 1] - sequence[i])
        }
        sequence = newSequence
      }
      if (mode === 'part1') {
        sum += lastNumbers.reduce((a, b) => a + b, 0)
      } else {
        sum += firstNumbers.reverse().reduce((a, b) => b - a, 0)
      }
    })
    return sum
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = solveFor(sequences, 'part1')
  }
  if (params.skip !== true && params.skip !== 'part2') {
    part2 = solveFor(sequences, 'part2')
  }

  return { part1, part2 }
}
