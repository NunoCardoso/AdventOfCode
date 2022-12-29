import { Params } from '../../aoc.d'
import _ from 'lodash'
import clc from 'cli-color'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Point = {
    x: number
    y: number
    cost: number
    distance?: number
  }
  type Points = Array<Point>
  type World = Array<Array<string>>

  type Visited = Record<string, number>
  const world: World = []
  let start: Point
  const starts: Array<Point> = []
  let end: Point

  const getHeight = (level: string): number => 'abcdefghijklmnopqrstuvwxyz'.indexOf(level)

  const getDistanceToFinish = (path: Partial<Point>, end: Point): number =>
    Math.sqrt((path.x! - end.x) * (path.x! - end.x) +
      (path.y! - end.y) * (path.y! - end.y))

  const isSame = (p: Point, p2: Point) : boolean => p.x === p2.x && p.y === p2.y

  const getKey = (p: Point): string => '' + p.x + ',' + p.y

  let finished: number | undefined = undefined

  const getThemPaths = (point: Point, visited: Visited): number => {

    const searchAlgorithm = (point: Point) => {

      const key: string = getKey(point)

      //console.log(point, Object.keys(visited).length)
      if (isSame(point, end)) {
        if (!finished || finished > point.cost) {
          console.log("Better finish", finished, point.cost)
          finished = point.cost
        }
        return
      }

      if (Object.prototype.hasOwnProperty.call(visited, key) && visited[key] > point.cost) {
        return
      }
      visited[key] = point.cost

      let newPoints: Points = [
        {x: point.x - 1, y: point.y, cost: point.cost + 1, distance: getDistanceToFinish({x: point.x - 1, y: point.y}, end)},
        {x: point.x + 1, y: point.y, cost: point.cost + 1, distance: getDistanceToFinish({x: point.x + 1, y: point.y}, end)},
        {x: point.x, y: point.y - 1, cost: point.cost + 1, distance: getDistanceToFinish({x: point.x, y: point.y - 1}, end)},
        {x: point.x, y: point.y + 1, cost: point.cost + 1, distance: getDistanceToFinish({x: point.x, y: point.y + 1}, end)}
       ].sort((a: Point, b: Point) => a.distance! - b.distance!)

      _.reject(newPoints, (newPoint: Point) => {
        if (newPoint.x < 0 || newPoint.y < 0 || newPoint.x >= world.length || newPoint.y >= world[0].length) {
          return true
        }
        if (getHeight(world[newPoint.x][newPoint.y]) - getHeight(world[point.x][point.y]) > 1) {
          return true
        }
        const newKey = getKey(newPoint)
        if (Object.prototype.hasOwnProperty.call(visited, newKey) && visited[newKey] < newPoint.cost) {
          return true
        }
        return false
      })?.forEach(newPoint => searchAlgorithm(newPoint))
    }

    searchAlgorithm(point)
    return finished!
  }

  for await (const line of lineReader) {
    const vals = line.split('')
    vals.forEach((val: string, i: number) => {
      if (val === 'S') {
        start = {
          x: world.length,
          y: i,
          distance: 1000,
          cost: 0
        }
      }
      if (val === 'a') {
        starts.push({
          x: world.length,
          y: i,
          distance: 1000,
          cost: 0
        })
      }
      if (val === 'E') {
        end = {
          x: world.length,
          y: i,
          distance: 0,
          cost: 0
        }
      }
    })
    world.push(line.replaceAll('E', 'z').split(''))
  }

  log.info('world dimensions', world.length, world[0].length)

  let part1: number = 0, part2: number = 0

  if (params.part1?.skip !== true) {
    part1 = getThemPaths(start!, {})
  }

  if (params.part2?.skip !== true) {
    part2 = Math.min(...starts!.map((s: Point) => getThemPaths(s, {})))
  }

  return {
    part1,
    part2
  }
}
