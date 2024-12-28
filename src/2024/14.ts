import { Params } from 'aoc.d'
import { Dimension, Point } from 'declarations'

type PAndV = [Point, Point]
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let robots: PAndV[] = []
  for await (const line of lineReader) {
    const [, p0, p1, v0, v1] = line.match(/p=(.+),(.+) v=(.+),(.+)/)
    robots.push([
      [+p0, +p1],
      [+v0, +v1]
    ])
  }

  const countSafetyScore = (robots: PAndV[], size: Dimension) => {
    let partialCounts = [0, 0, 0, 0]
    robots.forEach((robot) => {
      if (robot[0][0] < Math.floor(size[0] / 2)) {
        if (robot[0][1] < Math.floor(size[1] / 2)) partialCounts[0]++
        if (robot[0][1] >= Math.ceil(size[1] / 2)) partialCounts[2]++
      }
      if (robot[0][0] >= Math.ceil(size[0] / 2)) {
        if (robot[0][1] < Math.floor(size[1] / 2)) partialCounts[1]++
        if (robot[0][1] >= Math.ceil(size[1] / 2)) partialCounts[3]++
      }
    })
    return partialCounts.reduce((a, b) => a * b)
  }

  const iterate = (robot: PAndV, size: Dimension) => {
    robot[0][0] = (robot[0][0] + robot[1][0] + size[0]) % size[0]
    robot[0][1] = (robot[0][1] + robot[1][1] + size[1]) % size[1]
  }

  const hasAdjacentRobot = (robot: PAndV, robots: PAndV[]) =>
    robots.some((_robot) => {
      let h = Math.abs(_robot[0][0] - robot[0][0])
      let v = Math.abs(_robot[0][1] - robot[0][1])
      return h <= 1 && v <= 1 && h + v !== 0
    })

  // check that at least 66% of robots have another adjacent robot
  const checkIfAdjacent = (robots: PAndV[]): boolean => robots.reduce((acc, robot) => acc + (hasAdjacentRobot(robot, robots) ? 1 : 0), 0) >= robots.length * (2 / 3)

  const printData = (robots: PAndV[], size: Dimension) => {
    for (var i = 0; i < size[0]; i++) {
      let s: string = ''
      for (var j = 0; j < size[1]; j++) {
        let numberOfRobots = robots.find((r) => r[0][0] === i && r[0][1] === j)?.length ?? 0
        s += numberOfRobots === 0 ? '.' : numberOfRobots
      }
      log.info(s)
    }
  }

  const solveFor = (robots: PAndV[], maxIterations: number, size: Dimension): number => {
    let iterations = 0
    while (iterations < maxIterations) {
      robots.forEach((robot) => iterate(robot, size))
      iterations++
    }
    return countSafetyScore(robots, size)
  }

  const solveForPart2 = (robots: PAndV[], size: Dimension): number => {
    let areAdjacent = false
    let iterations = 0
    while (!areAdjacent) {
      iterations++
      robots.forEach((robot) => iterate(robot, size))
      areAdjacent = checkIfAdjacent(robots)
    }
    if (params.ui.show) printData(robots, size)
    return iterations
  }

  if (!params.skipPart1) {
    part1 = solveFor(global.structuredClone(robots), params.iterations, params.worldSize)
  }
  if (!params.skipPart2) {
    part2 = solveForPart2(global.structuredClone(robots), params.worldSize)
  }

  return { part1, part2 }
}
