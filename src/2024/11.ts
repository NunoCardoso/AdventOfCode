import { Params } from 'aoc.d'

type Stones = number[]
export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let stones: Stones = []
  for await (const line of lineReader) stones = line.split(' ').map(Number)

  const changeStone = (stone: number): number[] => {
    if (stone === 0) return [1]
    if (stone.toString().length % 2 === 0) {
      let numberAsString = stone.toString()
      return [
        +numberAsString.substring(0, numberAsString.length / 2),
        +numberAsString.substring(numberAsString.length / 2, numberAsString.length)
      ]
    }
    return [(stone as number) * 2024]
  }

  const blink = (stones: Record<number, number>): Record<number, number> => {
    let newStones: Record<number, number> = {}
    Object.keys(stones).forEach((stone) => {
      changeStone(+stone).forEach((newStone) => {
        if (!newStones[newStone]) newStones[newStone] = 0
        newStones[newStone] += stones[+stone]
      })
    })
    return newStones
  }

  const solveFor = (stones: Stones, maxIterations: number): number => {
    let it = 0
    let stonesObj: Record<number, number> = Object.fromEntries(stones.map((stone) => [stone, 1]))
    while (it < maxIterations) {
      stonesObj = blink(stonesObj)
      it++
    }
    return Object.values(stonesObj).reduce((acc, v) => acc + v, 0)
  }

  if (!params.skipPart1) {
    part1 = solveFor(stones, params.iterations.part1)
  }
  if (!params.skipPart2) {
    part2 = solveFor(stones, params.iterations.part2)
  }

  return { part1, part2 }
}
