import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Point, World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let world: World<string> = []
  let rowIndex = 0
  let start: Point = [0, 0]
  let end: Point = [0, 0]
  for await (const line of lineReader) {
    let values = line.split('')
    let startIndex = line.indexOf('S')
    let endIndex = line.indexOf('E')
    if (startIndex >= 0) {
      start = [rowIndex, startIndex]
      values[startIndex] = '.'
    }
    if (endIndex >= 0) {
      end = [rowIndex, endIndex]
      values[endIndex] = '.'
    }
    world.push(values)
    rowIndex++
  }

  const getKey = (p: Point) => p[0] + ',' + p[1]
  const fromKey = (s: string): Point => s.split(',').map(Number) as Point

  const isSame = (p1: Point, p2: Point) => p1[0] === p2[0] && p1[1] === p2[1]

  const getMoreHeads = (world: World<string>, head: Point, visited: Set<string>) =>
    (
      [
        [head[0] - 1, head[1]],
        [head[0] + 1, head[1]],
        [head[0], head[1] + 1],
        [head[0], head[1] - 1]
      ] as Point[]
    ).filter((point) => {
      if (world[point[0]][point[1]] === '#') return false
      if (visited.has(getKey(point))) return false // do not go back
      return true
    })

  const doSearch = (world: World<string>, opened: Point[], visited: Set<string>, end: Point) => {
    let head = opened.splice(-1)[0]
    visited.add(getKey(head))
    if (isSame(head, end)) return
    getMoreHeads(world, head, visited).forEach((newHead) => opened.push(newHead))
  }

  const isValidPoint = (world: World<string>, point: Point) => {
    if (point[0] < 0 || point[0] >= world.length || point[1] < 0 || point[1] >= world[0].length) return false
    if (world[point[0]][point[1]] === '#') return false
    return true
  }

  const getAllManhattanDistance = (world: World<string>, center: Point, maxDistance: number): Point[] => {
    let points: Point[] = []
    for (var rowDistance = -1 * maxDistance; rowDistance <= maxDistance; rowDistance++) {
      let rowIndex = center[0] + rowDistance
      let leftoverDistance = maxDistance - Math.abs(rowDistance)
      if (leftoverDistance === 0) {
        // only add one point
        let candidatePoint: Point = [rowIndex, center[1]]
        if (isValidPoint(world, candidatePoint)) points.push(candidatePoint)
      } else {
        let candidatePoint1: Point = [rowIndex, center[1] - leftoverDistance]
        let candidatePoint2: Point = [rowIndex, center[1] + leftoverDistance]
        if (isValidPoint(world, candidatePoint1)) points.push(candidatePoint1)
        if (isValidPoint(world, candidatePoint2)) points.push(candidatePoint2)
      }
    }
    return points
  }

  const getPossibleCheatPoints = (world: World<string>, cheatLength: number, head: Point): Point[] => {
    let newPoints: Point[] = []
    // to be a cheat, needs at least 2 steps
    for (var i = 2; i <= cheatLength; i++) {
      newPoints = newPoints.concat(getAllManhattanDistance(world, head, i))
    }
    return newPoints
  }

  const countCheats = (
    world: World<string>,
    threshold: number,
    cheatLength: number,
    visited: Point[]
  ): number => {
    let count = 0
    visited.forEach((startPoint, index) => {
      log.debug('Startpoint', index, 'of', visited.length)
      for (var i = 2; i <= cheatLength; i++) {
        let possibleCheatPoints: Point[] = getAllManhattanDistance(world, startPoint, i)
        log.trace('possible cheats for', startPoint, possibleCheatPoints.length)
        count += possibleCheatPoints.reduce((acc2, cheatPoint) => {
          let otherIndex = visited.findIndex((p) => isSame(p, cheatPoint))
          // this means that the cheat ended on another step that is ahead in tha path
          // note that I do not count cheats twice as I only look ahead
          let savedTime = otherIndex - index - i
          log.trace('From ', startPoint, 'to', cheatPoint, 'length', i, 'savedTime is', savedTime)
          return acc2 + (savedTime >= threshold ? 1 : 0)
        }, 0)
      }
    })
    return count
  }

  const solveFor = (
    world: World<string>,
    start: Point,
    end: Point,
    threshold: number,
    cheatLength: number
  ): number => {
    let opened: Point[] = [start]
    let visited = new Set<string>()
    while (opened.length > 0) doSearch(world, opened, visited, end)
    console.log('Number of steps', visited.size - 1) // start node is not a step
    return countCheats(
      world,
      threshold,
      cheatLength,
      [...visited].map((v) => fromKey(v))
    )
  }

  if (!params.skipPart1) {
    part1 = solveFor(world, start, end, params.threshold, params.cheatLength.part1)
  }
  if (!params.skipPart2) {
    part2 = solveFor(world, start, end, params.threshold, params.cheatLength.part2)
  }

  return { part1, part2 }
}
