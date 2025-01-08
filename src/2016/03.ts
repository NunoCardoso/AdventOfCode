import { Params } from 'aoc.d'

type Triangle = [number, number, number]

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const numbers: number[][] = [[], [], []]

  const checkTriangle = (triangle: Triangle): boolean =>
    triangle[0] + triangle[1] > triangle[2] &&
    triangle[0] + triangle[2] > triangle[1] &&
    triangle[1] + triangle[2] > triangle[0]

  for await (const line of lineReader) {
    const values = line.trim().split(/\s+/).map(Number)
    values.forEach((val: number, i: number) => numbers[i].push(val))
    if (checkTriangle(values)) part1++
  }

  const bigRow: number[] = numbers.flat()
  for (let i = 0; i < bigRow.length; i += 3) if (checkTriangle([bigRow[i], bigRow[i + 1], bigRow[i + 2]])) part2++

  return { part1, part2 }
}
