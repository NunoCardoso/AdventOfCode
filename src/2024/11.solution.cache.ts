import { Params } from 'aoc.d'

type Rocks = number[]
export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let rocks: Rocks = []
  for await (const line of lineReader) rocks = line.split(' ').map(Number)

  const changeStone = (rock: number): number[] => {
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

  const blink = (rock: number, iterationsLeft: number, cache: Map<string, number>): number => {
    if (iterationsLeft === 0) return 1
    const key = `${rock}:${iterationsLeft}`
    if (cache.has(key)) return cache.get(key)!
    const result = changeStone(rock)
      .map((s) => blink(s, iterationsLeft - 1, cache))
      .reduce((a, b) => a + b)
    cache.set(key, result)
    return result
  }

  let cache: Map<string, number>

  if (!params.skipPart1) {
    cache = new Map<string, number>()
    part1 = rocks.map((rock) => blink(rock, params.iterations.part1, cache)).reduce((acc, val) => acc + val)
  }

  if (!params.skipPart2) {
    cache = new Map<string, number>()
    part2 = rocks.map((rock) => blink(rock, params.iterations.part2, cache)).reduce((acc, val) => acc + val)
  }

  return { part1, part2 }
}
