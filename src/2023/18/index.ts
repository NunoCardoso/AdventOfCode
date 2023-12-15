import { Params } from 'aoc.d'
import { Point } from 'declarations'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const pointsPart1: Array<Point> = []
  const pointsPart2: Array<Point> = []

  let cursorPart1: Point = [0, 0]
  let cursorPart2: Point = [0, 0]

  let accummulativePart1 = 0
  let accummulativePart2 = 0

  const dirs = ['R', 'D', 'L', 'U']
  const convert = (rgb: string): [number, string] => [parseInt(rgb.slice(0, 5), 16), dirs[+rgb.slice(5, 6)]]

  for await (const line of lineReader) {
    const [, directionPart1, amountPart1, rgb] = line.match(/(.) (\d+) \(#(.+)\)/)
    const [amountPart2, directionPart2] = convert(rgb)
    accummulativePart1 += +amountPart1
    accummulativePart2 += +amountPart2
    const newPointPart1: Point = [...cursorPart1]
    const newPointPart2: Point = [...cursorPart2]
    if (directionPart1 === 'R') newPointPart1[1] += +amountPart1
    if (directionPart1 === 'L') newPointPart1[1] -= +amountPart1
    if (directionPart1 === 'U') newPointPart1[0] -= +amountPart1
    if (directionPart1 === 'D') newPointPart1[0] += +amountPart1
    if (directionPart2 === 'R') newPointPart2[1] += +amountPart2
    if (directionPart2 === 'L') newPointPart2[1] -= +amountPart2
    if (directionPart2 === 'U') newPointPart2[0] -= +amountPart2
    if (directionPart2 === 'D') newPointPart2[0] += +amountPart2
    cursorPart1 = newPointPart1
    cursorPart2 = newPointPart2
    pointsPart1.push(newPointPart1)
    pointsPart2.push(newPointPart2)
  }

  const solveFor = (points: Array<Point>, accummulative: number) => {
    let acc1 = 0
    let acc2 = 0
    points.reverse().forEach((point, i) => {
      acc1 += points[i][0] * points[(i + 1) % points.length][1]
      acc2 += points[i][1] * points[(i + 1) % points.length][0]
    })
    // half of the borders also belong to the area
    return (acc1 - acc2) / 2 + accummulative / 2 + 1
  }
  if (!params.skipPart1) {
    part1 = solveFor(pointsPart1, accummulativePart1)
  }
  if (!params.skipPart2) {
    part2 = solveFor(pointsPart2, accummulativePart2)
  }

  return { part1, part2 }
}
