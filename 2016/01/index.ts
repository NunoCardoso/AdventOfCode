import { Params } from 'aoc.d'
import { Point } from 'declarations'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0
  const instructions: Array<[string, number]> = []
  const point: Point = [0, 0]
  const directions: Array<string> = ['>', 'v', '<', '^']
  const directionsMap: Record<string, Point> = { '>': [1, 0], v: [0, 1], '<': [-1, 0], '^': [0, -1] }
  let currentDirection: string = ''
  const visitedPoints: Array<Point> = []
  let visitedPoint: Point | undefined

  for await (const line of lineReader) {
    const values = line.split(', ')
    values.forEach((value: string) =>
      instructions.push([value.substring(0, 1), parseInt(value.substring(1, value.length))])
    )
  }

  instructions.forEach((instruction) => {
    if (currentDirection === '') {
      currentDirection = instruction[0] === 'L' ? '<' : '>'
    } else {
      let newIndex: number = 0
      if (instruction[0] === 'L') {
        newIndex = (directions.indexOf(currentDirection) - 1 + directions.length) % directions.length
      } else {
        newIndex = (directions.indexOf(currentDirection) + 1) % directions.length
      }
      currentDirection = directions[newIndex]
    }

    if (visitedPoint === undefined) {
      for (let i = 0; i < instruction[1]; i++) {
        point[0] += directionsMap[currentDirection][0]
        point[1] += directionsMap[currentDirection][1]
        const isVisited: number = _.findIndex(
          visitedPoints,
          (v: Point) => v[0] === point[0] && v[1] === point[1]
        )
        if (isVisited >= 0 && visitedPoint === undefined) {
          visitedPoint = [point[0], point[1]]
        }
        if (visitedPoint === undefined) {
          visitedPoints.push([point[0], point[1]])
        }
      }
    } else {
      point[0] += directionsMap[currentDirection][0] * instruction[1]
      point[1] += directionsMap[currentDirection][1] * instruction[1]
    }
    log.debug(instruction, currentDirection, point)
    log.debug(visitedPoints, visitedPoint)
  })

  part1 = Math.abs(point[0]) + Math.abs(point[1])
  if (visitedPoint !== undefined) {
    part2 = Math.abs(visitedPoint[0]) + Math.abs(visitedPoint[1])
  }

  return { part1, part2 }
}
