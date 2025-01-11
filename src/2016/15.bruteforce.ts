import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const maxPositions: number[] = []
  const positions: number[] = []

  for await (const line of lineReader) {
    const [, maxPosition, position] = line
      .match(/Disc #\d+ has (\d+) positions; at time=0, it is at position (\d+)./)
      .map(Number)
    maxPositions.push(maxPosition)
    positions.push(position)
  }

  const areAligned = (discs: number[]): boolean => discs.every((disc) => disc === 0)

  const solveFor = (maxPositions: number[], positions: number[]): number => {
    let found = 0
    let iterations = 0
    while (found === 0) {
      const _positions = [...positions]
      for (let i = 0; i < _positions.length; i++) _positions[i] = (_positions[i] + i + iterations) % maxPositions[i]
      if (areAligned(_positions)) found = iterations
      else iterations++
    }
    return iterations - 1
  }

  if (!params.skipPart1) part1 = solveFor(maxPositions, positions)
  if (!params.skipPart2) {
    maxPositions.push(11)
    positions.push(0)
    part2 = solveFor(maxPositions, positions)
  }
  return { part1, part2 }
}
