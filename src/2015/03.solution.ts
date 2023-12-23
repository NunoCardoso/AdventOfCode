import { Point } from 'declarations'

export default async (lineReader: any) => {
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
    line.split('').forEach((direction: string, i: number) => {
      move(direction, currentPositionPart1, positionsPart1)
      move(
        direction,
        i % 2 === 1 ? currentPositionRobotSantaPart2 : currentPositionSantaPart2,
        positionsPart2
      )
    })
  }

  return {
    part1: positionsPart1.size,
    part2: positionsPart2.size
  }
}
