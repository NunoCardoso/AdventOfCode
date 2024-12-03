import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let delta: number = 0
  for await (const line of lineReader) delta = +line

  const solveForPart1 = (): number => {
    let path = [0]
    let it = 0
    let currentIndex = 0
    while (it < params.iterations.part1) {
      it++
      currentIndex = ((currentIndex + delta) % path.length) + 1
      path.splice(currentIndex, 0, it)
      if (it % 100000 === 0) console.log('it', it)
    }
    return path[currentIndex + 1]
  }

  const solveForPart2 = (): number => {
    let pathLength = 1
    let it = 0
    let currentIndex = 0
    let numberAfter0 = -1
    while (it < params.iterations.part2) {
      it++
      currentIndex = ((currentIndex + delta) % pathLength) + 1
      if (currentIndex === 1) numberAfter0 = it
      pathLength++
    }
    return numberAfter0
  }

  if (!params.skipPart1) {
    part1 = solveForPart1()
  }
  if (!params.skipPart2) {
    part2 = solveForPart2()
  }

  return { part1, part2 }
}
