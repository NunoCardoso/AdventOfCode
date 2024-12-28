import { Params } from 'aoc.d'
import { World } from 'declarations'

// x, y, cost, path
type Point = [number, number, number, Set<string>?]
type Data = { lowestScore: number; end: Point; path: Set<string> }

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World<string> = []

  const getSpaceOrWall = (world: World<string>, [row, column]: [number, number]): string => {
    if (!world[row]) world[row] = []
    if (!world[row][column]) {
      const val: number = row * row + 3 * row + 2 * row * column + column + column * column + params.designerNumber
      const bin = (val >>> 0).toString(2)
      const countOnes = bin.split('').filter((x: string) => x === '1').length
      world[row][column] = countOnes % 2 === 0 ? '.' : '#'
    }
    return world[row][column]
  }

  for (let row = 0; row < 2; row++) {
    for (let column = 0; column < 2; column++) {
      getSpaceOrWall(world, [row, column])
    }
  }

  const getKey = (p: Point): string => p[0] + ',' + p[1]

  const isSame = (p: Point, p2: Point): boolean => p[0] === p2[0] && p[1] === p2[1]

  const outOfBounds = (p: Point) => p[0] < 0 || p[1] < 0

  const getNewPoints = (point: Point, world: World<string>, visited: Set<string>) =>
    (
      [
        [point[0] - 1, point[1], point[2] + 1],
        [point[0] + 1, point[1], point[2] + 1],
        [point[0], point[1] - 1, point[2] + 1],
        [point[0], point[1] + 1, point[2] + 1]
      ] as Array<Point>
    ).filter((newPoint: Point) => {
      if (outOfBounds(newPoint)) return false
      if (getSpaceOrWall(world, [newPoint[0], newPoint[1]]) === '#') return false
      newPoint[3] = new Set(point[3])!.add(getKey(newPoint))
      return !visited.has(getKey(newPoint))
    })

  const doDijkstra = async (
    world: World<string>,
    opened: Array<Point>,
    openedIndex: Set<string>,
    visited: Set<string>,
    data: Data,
    type: string
  ) => {
    const point: Point = opened.splice(-1)[0]
    const pointKey: string = getKey(point)
    log.debug('=== Dijkstra ===', point, 'opened', opened.length, 'data', data)

    // if part1, we return when getting to the end
    if (type === 'part1' && isSame(point, data.end)) {
      if (data.lowestScore > point[2]) {
        log.debug('Got lowest score with', point)
        data.lowestScore = point[2]
        data.path = point[3]!
      }
      return
    }

    // if part2, return when we do X steps
    if (type === 'part2' && point[2] > params.cutoff) return

    visited.add(pointKey)
    openedIndex.delete(pointKey)

    const newPoints: Array<Point> = getNewPoints(point, world, visited)

    if (newPoints.length > 0) {
      newPoints.forEach((newPoint) => {
        const newPointKey = getKey(newPoint)
        if (!openedIndex.has(newPointKey)) {
          opened.push(newPoint)
          openedIndex.add(newPointKey)
        } else {
          const index = opened.findIndex((p: Point) => isSame(p, newPoint))
          if (opened[index][2] > newPoint[2]) opened[index] = newPoint
        }
      })
      opened.sort((a, b) => b[2] - a[2])
    }
  }

  const solveFor = (world: World<string>, target: Point, type: string): number => {
    const visited: Set<string> = new Set()
    const data: Data = { lowestScore: Number.POSITIVE_INFINITY, end: target, path: new Set() }
    const start: Point = [1, 1, 0]
    const opened: Array<Point> = [start]
    const openedIndex: Set<string> = new Set()
    opened.forEach((point) => openedIndex.add(getKey(point)))
    while (opened.length > 0) {
      doDijkstra(world, opened, openedIndex, visited, data, type)
    }
    if (type === 'part1') return data.lowestScore
    if (type === 'part2') return visited.size
    return 0
  }

  if (!params.skipPart1) {
    part1 = solveFor(world.slice(), params.target, 'part1')
  }
  part2 = solveFor(world.slice(), params.target, 'part2')

  return { part1, part2 }
}
