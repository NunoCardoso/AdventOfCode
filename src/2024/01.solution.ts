import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let leftList: number[] = [],
    rightList: number[] = []
  let similarity: Record<number, number> = {}
  for await (const line of lineReader) {
    const [value1, value2] = line.split(/\s+/).map(Number)
    leftList.push(value1)
    rightList.push(value2)
    if (!similarity[value2]) similarity[value2] = 0
    similarity[value2]++
  }

  if (!params.skipPart1) {
    leftList.sort((a, b) => a - b)
    rightList.sort((a, b) => a - b)
    part1 = leftList.reduce((acc, val, i) => acc + Math.abs(rightList[i] - val), 0)
  }

  if (!params.skipPart2) {
    part2 = leftList.reduce((acc, val, i) => acc + (similarity[leftList[i]] ?? 0) * leftList[i], 0)
  }

  return { part1, part2 }
}
