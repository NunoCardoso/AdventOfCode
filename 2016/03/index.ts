import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0,
    part2: number = 0

  type Triangle = [number, number, number]

  const dataForPart1: Array<Triangle> = []
  const dataForPart2: Array<Triangle> = []
  const auxRows: any = [[], [], []]

  const checkTriangle = (triangle: Triangle): boolean =>
    triangle[0] + triangle[1] > triangle[2] &&
    triangle[0] + triangle[2] > triangle[1] &&
    triangle[1] + triangle[2] > triangle[0]

  for await (const line of lineReader) {
    const values = line
      .trim()
      .split(/\s+/)
      .map((s: string) => parseInt(s))
    dataForPart1.push([values[0], values[1], values[2]])
    auxRows[0].push(values[0])
    auxRows[1].push(values[1])
    auxRows[2].push(values[2])
  }
  const bigRow: Array<number> = _.flatten(auxRows)
  for (let i = 0; i < bigRow.length; i += 3) {
    dataForPart2.push([bigRow[i], bigRow[i + 1], bigRow[i + 2]])
  }

  dataForPart1.forEach((d) => {
    if (checkTriangle(d)) part1++
  })
  dataForPart2.forEach((d) => {
    if (checkTriangle(d)) part2++
  })

  return {
    part1,
    part2
  }
}
