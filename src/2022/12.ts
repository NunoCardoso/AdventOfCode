import { Params } from 'aoc.d'
import clc from 'cli-color'
import { World } from 'declarations'

// x, y, score, path
type Point = [number, number, number, Set<string>?]
type Data = {
  lowestScore: number
  path: Set<string>
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let it: number = 0
  let start: Point
  const starts: Array<Point> = []
  let end: Point
  const world: World<string> = []

  const isSame = (p: Point, p2: Point): boolean => p[0] === p2[0] && p[1] === p2[1]

  const getHeight = (level: string): number => 'abcdefghijklmnopqrstuvwxyz'.indexOf(level)

  const getKey = (p: Point): string => '' + p[0] + ',' + p[1]

  const outOfBounds = (p: Point) => p[0] < 0 || p[1] < 0 || p[0] >= world.length || p[1] >= world[0].length
  const getNewPoints = (point: Point, visited: Set<string>): Array<Point> =>
    (
      [
        [point[0] - 1, point[1], point[2] + 1],
        [point[0] + 1, point[1], point[2] + 1],
        [point[0], point[1] - 1, point[2] + 1],
        [point[0], point[1] + 1, point[2] + 1]
      ] as Array<Point>
    ).filter((newPoint: Point) => {
      if (outOfBounds(newPoint)) return false
      if (getHeight(world[newPoint[0]][newPoint[1]]) - getHeight(world[point[0]][point[1]]) > 1) return false
      newPoint[3] = new Set(point[3])!.add(getKey(newPoint))
      return !visited.has(getKey(newPoint))
    })

  const doDijkstra = (opened: Array<Point>, openedIndex: Set<string>, visited: Set<string>, data: Data) => {
    const point: Point = opened.splice(-1)[0]
    const pointKey = getKey(point)
    log.debug('=== Dijkstra ===', point, 'opened', opened.length, 'data', data)

    if (isSame(point, end)) {
      if (data.lowestScore > point[2]) {
        log.debug('got lowest', point)
        data.lowestScore = point[2]
        data.path = point[3]!
      }
      return
    }
    visited.add(pointKey)
    openedIndex.delete(pointKey)

    const newPoints: Array<Point> = getNewPoints(point, visited)
    if (newPoints.length !== 0) {
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

  const printData = (world: World<string>, data: Data) => {
    world.forEach((row, i) => {
      console.log(
        row.map((cell, j) => (data.path.has(i + ',' + j) ? clc.red(world[i][j]) : world[i][j])).join('')
      )
    })
    console.log('')
  }

  const solveFor = (opened: Array<Point>): number => {
    const visited: Set<string> = new Set()
    const data: Data = { lowestScore: Number.POSITIVE_INFINITY, path: new Set() }
    const openedIndex: Set<string> = new Set()
    opened.forEach((point) => openedIndex.add(getKey(point)))
    let iterations = 0
    while (opened.length > 0) {
      doDijkstra(opened, openedIndex, visited, data)
      if (it % 100 === 0) {
        log.debug('it', iterations, 'opened length', opened.length)
        iterations++
      }
    }
    if (params.ui?.show && params.ui?.end) printData(world, data)
    return data.lowestScore
  }

  for await (const line of lineReader) {
    const row: Array<string> = []
    line.split('').forEach((char: string, i: number) => {
      if (char === 'S') {
        start = [it, i, 0, new Set<string>().add(it + ',' + i)]
        row.push('a')
      } else if (char === 'a') {
        starts.push([it, i, 0, new Set<string>().add(it + ',' + i)])
        row.push(char)
      } else if (char === 'E') {
        end = [it, i, 0]
        row.push('z')
      } else {
        row.push(char)
      }
    })
    world.push(row)
    it++
  }

  let part1: number = 0
  let part2: number = 0

  if (!params.skipPart1) {
    part1 = solveFor([start!])
  }

  if (!params.skipPart2) {
    part2 = solveFor(starts)
  }

  return { part1, part2 }
}
