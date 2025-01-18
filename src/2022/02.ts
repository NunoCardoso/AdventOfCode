import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const scoresPart1: Record<string, Record<string, number[]>> = {
    A: { X: [1, 3], Y: [2, 6], Z: [3, 0] },
    B: { X: [1, 0], Y: [2, 3], Z: [3, 6] },
    C: { X: [1, 6], Y: [2, 0], Z: [3, 3] }
  }
  const scoresPart2: Record<string, Record<string, number[]>> = {
    A: { X: [3, 0], Y: [1, 3], Z: [2, 6] },
    B: { X: [1, 0], Y: [2, 3], Z: [3, 6] },
    C: { X: [2, 0], Y: [3, 3], Z: [1, 6] }
  }

  for await (const line of lineReader) {
    const [left, right] = line.split(/\s+/)
    part1 += scoresPart1[left][right][0] + scoresPart1[left][right][1]
    part2 += scoresPart2[left][right][0] + scoresPart2[left][right][1]
  }

  return { part1, part2 }
}
