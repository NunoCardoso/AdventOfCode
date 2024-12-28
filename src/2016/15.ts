import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const maxPositions: Array<number> = []
  const positions: Array<number> = []

  for await (const line of lineReader) {
    const [, maxPosition, position] = line
      .match(/Disc #\d+ has (\d+) positions; at time=0, it is at position (\d+)./)
      .map(Number)
    maxPositions.push(maxPosition)
    positions.push(position)
  }

  const areAligned = (discs: Array<number>): boolean => discs.every((disc) => disc === 0)

  const solveFor = (maxPositions: Array<number>, positions: Array<number>): number => {
    let found = 0
    let it = 0
    while (found === 0) {
      const _positions = positions.slice()
      for (let i = 0; i < _positions.length; i++) _positions[i] = (_positions[i] + i + it) % maxPositions[i]
      if (areAligned(_positions)) found = it
      else it++
    }
    return it - 1
  }

  part1 = solveFor(maxPositions, positions)
  maxPositions.push(11)
  positions.push(0)
  part2 = solveFor(maxPositions, positions)
  return { part1, part2 }
}
