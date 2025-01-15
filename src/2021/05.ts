import { Params } from 'aoc.d'

export default async (lineReader: any) => {
  let part1: number = 0
  let part2: number = 0

  const setPart1: Set<string> = new Set<string>()
  const setPart2: Set<string> = new Set<string>()
  const set2Part1: Set<string> = new Set<string>()
  const set2Part2: Set<string> = new Set<string>()

  const increment = (data: Record<string, number>, key: string) =>
    data[key] !== undefined ? data[key]++ : (data[key] = 1)

  for await (const line of lineReader) {
    const [X1, Y1, X2, Y2] = line.match(/\d+/g).map(Number)
    const diffX = X2 - X1
    const diffY = Y2 - Y1
    const maxDiff = Math.max(Math.abs(diffX), Math.abs(diffY))
    for (let tick = 0; tick <= maxDiff; tick++) {
      const X = X1 === X2 ? X1 : X1 > X2 ? X1 - tick : X1 + tick
      const Y = Y1 === Y2 ? Y1 : Y1 > Y2 ? Y1 - tick : Y1 + tick
      const key = X + ',' + Y
      if (diffX === 0 || diffY === 0) {
        if (setPart1.has(key)) set2Part1.add(key)
        else setPart1.add(key)
      }
      if (setPart2.has(key)) set2Part2.add(key)
      else setPart2.add(key)
    }
  }

  return {
    part1: set2Part1.size,
    part2: set2Part2.size
  }
}
