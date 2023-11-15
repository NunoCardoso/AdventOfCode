import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Point = [number, number, number, number]

  type Points = Array<Point>
  type World = Record<string, string>
  type WorldSize = [number, number]

  const world: World = {}
  let start: Point
  const starts: Points = []
  let end: Point
  const worldSize: WorldSize = [0, 0]

  const getHeight = (level: string): number => 'abcdefghijklmnopqrstuvwxyz'.indexOf(level)

  const getDistanceToFinish = (x: number, y: number, end: Point): number =>
    Math.sqrt((x - end[0]) * (x - end[0]) + (y - end[1]) * (y - end[1]))

  const isSame = (p: Point, p2: Point): boolean => p[0] === p2[0] && p[1] === p2[1]

  const getKey = (p: Point): string => '' + p[0] + ',' + p[1]

  const getThemPath = (opened: Points, visited: Record<string, number>) => {
    let lowestDistance: number = 1000

    const searchAlgorithm = async (opened: Points, visited: Record<string, number>) => {
      const head: Point = opened.splice(-1)[0]
      const key: string = getKey(head)
      log.debug('=== Starting ===', head)
      log.debug('path', head, 'opened', opened.length)

      if (isSame(head, end)) {
        if (lowestDistance > head[3]) {
          lowestDistance = head[3]
        }
        return
      }

      if (!Object.prototype.hasOwnProperty.call(visited, key)) {
        visited[key] = head[3]
      } else {
        if (visited[key] > head[3]) {
          visited[key] = head[3]
        }
      }

      const newPoints: Points = _.reject(
        [
          [head[0] - 1, head[1], getDistanceToFinish(head[0] - 1, head[1], end), head[3] + 1],
          [head[0] + 1, head[1], getDistanceToFinish(head[0] + 1, head[1], end), head[3] + 1],
          [head[0], head[1] - 1, getDistanceToFinish(head[0], head[1] - 1, end), head[3] + 1],
          [head[0], head[1] + 1, getDistanceToFinish(head[0], head[1] + 1, end), head[3] + 1]
        ],
        (newPoint: Point) => {
          const newKey = getKey(newPoint)
          if (
            newPoint[0] < 0 ||
            newPoint[1] < 0 ||
            newPoint[0] >= worldSize[0] ||
            newPoint[1] >= worldSize[1]
          ) {
            return true
          }
          // console.log(newKey, key,world[newKey] , world[key], getHeight(world[newKey]), getHeight(world[key]))
          if (getHeight(world[newKey]) - getHeight(world[key]) > 1) {
            return true
          }
          const matchOpenedPathIndex = _.findIndex(opened, (p: Point) => isSame(p, newPoint))
          if (matchOpenedPathIndex >= 0) {
            if (opened[matchOpenedPathIndex][3] <= newPoint[3]) {
              return true
            } else {
              opened.splice(matchOpenedPathIndex, 1)
            }
          }

          // reject if it's in the visited list, and it has a worst cost; otherwise, keep it
          if (Object.prototype.hasOwnProperty.call(visited, newKey) && visited[newKey] <= newPoint[3]) {
            return true
          }
          return false
        }
      )

      if (newPoints.length !== 0) {
        opened.push(...newPoints)
        opened.sort((a, b) => b[2] - a[2])
      }
    }

    while (opened.length > 0) {
      searchAlgorithm(opened, visited)
    }
    return lowestDistance
  }

  let it: number = 0
  for await (const line of lineReader) {
    const vals = line.split('')
    if (worldSize[1] === 0) {
      worldSize[1] = vals.length
    }
    vals.forEach((val: string, i: number) => {
      if (val === 'S') {
        start = [it, i, 1000, 0]
      }
      if (val === 'a') {
        starts.push([it, i, 1000, 0])
      }
      if (val === 'E') {
        end = [it, i, 0, 0]
      }
      world['' + it + ',' + i] = val === 'E' ? 'z' : val
    })
    it++
  }
  worldSize[0] = it

  log.info('world dimensions', worldSize)
  let part1: number = 0
  let part2: number = 0

  if (params.part1?.skip !== true) {
    part1 = getThemPath([start!], {})
  }

  if (params.part2?.skip !== true) {
    part2 = getThemPath(starts, {})
  }

  return {
    part1,
    part2
  }
}
