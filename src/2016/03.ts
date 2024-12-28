import { Params } from 'aoc.d'

type Triangle = [number, number, number]

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const dataForPart1: Array<Triangle> = []
  const dataForPart2: Array<Triangle> = []
  const auxRows: Array<Array<number>> = [[], [], []]

  const checkTriangle = (triangle: Triangle): boolean => triangle[0] + triangle[1] > triangle[2] && triangle[0] + triangle[2] > triangle[1] && triangle[1] + triangle[2] > triangle[0]

  for await (const line of lineReader) {
    const values = line.trim().split(/\s+/).map(Number)
    dataForPart1.push([values[0], values[1], values[2]])
    ;([0, 1, 2] as Array<number>).forEach((i: number) => auxRows[i].push(values[i]))
  }

  const bigRow: Array<number> = auxRows.flat()
  for (let i = 0; i < bigRow.length; i += 3) dataForPart2.push([bigRow[i], bigRow[i + 1], bigRow[i + 2]])

  part1 = dataForPart1.filter(checkTriangle).length
  part2 = dataForPart2.filter(checkTriangle).length

  return { part1, part2 }
}
