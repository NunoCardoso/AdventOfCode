import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let delta: number = 0
  for await (const line of lineReader) delta = +line

  let positions = [0]
  let positionsLength = 1
  let iterations = 0
  let currentIndexPart1 = 0
  let currentIndexPart2 = 0

  while (++iterations <= params.iterations.part1) {
    currentIndexPart1 = ((currentIndexPart1 + delta) % positions.length) + 1
    positions.splice(currentIndexPart1, 0, iterations)
  }
  iterations = 0
  while (++iterations <= params.iterations.part2) {
    currentIndexPart2 = ((currentIndexPart2 + delta) % positionsLength) + 1
    if (currentIndexPart2 === 1) part2 = iterations
    positionsLength++
  }
  part1 = positions[currentIndexPart1 + 1]

  return { part1, part2 }
}
