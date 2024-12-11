import { Params } from 'aoc.d'

type Rocks = number[]
export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let rocks: Rocks = []
  for await (const line of lineReader) rocks = line.split(' ').map(Number)

  const doRock = (rock: number): number[] => {
    if (rock === 0) return [1]
    if (rock.toString().length % 2 === 0) {
      let numberAsString = rock.toString()
      return [
        +numberAsString.substring(0, numberAsString.length / 2),
        +numberAsString.substring(numberAsString.length / 2, numberAsString.length)
      ]
    }
    return [(rock as number) * 2024]
  }

  const processRock = (rocks: Record<number, number>): Record<number, number> => {
    let newRocks: Record<number, number> = {}
    Object.keys(rocks).forEach((rock) => {
      doRock(+rock).forEach((newRock) => {
        if (!newRocks[newRock]) newRocks[newRock] = 0
        newRocks[newRock] += rocks[+rock]
      })
    })
    return newRocks
  }

  const solveFor = (rocks: Rocks, maxIterations: number): number => {
    let it = 0
    let rocksObj: Record<number, number> = Object.fromEntries(rocks.map((rock) => [rock, 1]))
    while (it < maxIterations) {
      rocksObj = processRock(rocksObj)
      it++
    }
    return Object.values(rocksObj).reduce((acc, v) => acc + v, 0)
  }

  if (!params.skipPart1) {
    part1 = solveFor([...rocks], params.iterations.part1)
  }
  if (!params.skipPart2) {
    part2 = solveFor([...rocks], params.iterations.part2)
  }

  return { part1, part2 }
}
