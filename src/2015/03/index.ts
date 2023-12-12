import { Params } from 'aoc.d'
import { Point } from 'declarations'

export default async (lineReader: any, params: Params) => {
  const positionsPart1 = new Set<string>()
  const currentPositionPart1: Point = [0, 0]
  const positionsPart2 = new Set<string>()
  const currentPositionSantaPart2: Point = [0, 0]
  const currentPositionRobotSantaPart2: Point = [0, 0]

  const move = (direction: string, point: Point, map: Set<string>) => {
    if (direction === '^') point[1]--
    if (direction === 'v') point[1]++
    if (direction === '<') point[0]--
    if (direction === '>') point[0]++
    map.add(point[0] + ';' + point[1])
  }

  for await (const line of lineReader) {
    line.split('').forEach((val: string, i: number) => {
      move(val, currentPositionPart1, positionsPart1)
      if (i % 2 === 1) {
        move(val, currentPositionRobotSantaPart2, positionsPart2)
      } else {
        move(val, currentPositionSantaPart2, positionsPart2)
      }
    })
  }

  return {
    part1: positionsPart1.size,
    part2: positionsPart2.size
  }
}
