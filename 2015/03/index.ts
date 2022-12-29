import { Params } from '../../aoc.d'

export default async (lineReader: any, params: Params) => {
  type Point = [number, number]
  type Map = Record<string, any>

  const matrixOfPositionsPart1: Map = {}
  const currentPositionPart1: Point = [0, 0]
  const matrixOfPositionsPart2: Map = {}
  const currentPositionSantaPart2: Point = [0, 0]
  const currentPositionRobotSantaPart2: Point = [0, 0]

  const move = (direction: string, point: Point, map: Map) => {
    if (direction === '^') point[1]--
    if (direction === 'v') point[1]++
    if (direction === '<') point[0]--
    if (direction === '>') point[0]++
    map['' + point[0] + ';' + point[1]] = 1
  }

  for await (const line of lineReader) {
    const vals = line.split('')
    for (let i = 0; i < vals.length; i++) {
      move(vals[i], currentPositionPart1, matrixOfPositionsPart1)
      if (i % 2 === 1) {
        move(vals[i], currentPositionRobotSantaPart2, matrixOfPositionsPart2)
      } else {
        move(vals[i], currentPositionSantaPart2, matrixOfPositionsPart2)
      }
    }
  }

  return {
    part1: Object.keys(matrixOfPositionsPart1).length,
    part2: Object.keys(matrixOfPositionsPart2).length
  }
}
