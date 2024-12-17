import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Point, World } from 'declarations'

// row, column, direction, score
type ThisPoint = [number, number, string, number]

type Data = {
  end: Point
  lowestScore: number
  path: ThisPoint[]
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let world: World<string> = []
  let start: Point
  let end: Point
  let rowIndex = 0
  for await (const line of lineReader) {
    const values = line.split('')
    let startIndex = values.findIndex((v: string) => v === 'S')
    let endIndex = values.findIndex((v: string) => v === 'E')
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

  const printWorld = (world: World<string>, paths: ThisPoint[]) => {
    for (var i = 0; i < world.length; i++) {
      let s: string = ''
      for (var j = 0; j < world[i].length; j++) {
        /*if (i === start[0] && j === start[1]) {
          s += clc.yellow('@')
          continue
        }*/
        let cell = world[i][j]
        if (cell === '#') s += clc.red(cell)
        if (cell === '.') s += cell
      }
      log.info(s)
    }
  }

  const getKeyWithDirection = (p: ThisPoint): string => p[0] + ',' + p[1] + ',' + p[2]
  const isSame = (p: ThisPoint, p2: Point | ThisPoint): boolean => p[0] === p2[0] && p[1] === p2[1]

  const inTail = (point: ThisPoint, path: ThisPoint[]): boolean => path.some((p) => isSame(p, point))

  const isWall = (world: World<string>, head: ThisPoint) => world[head[0]][head[1]] === '#'
  const getNewPaths = (world: World<string>, path: ThisPoint[], lowestScore: number): ThisPoint[][] => {
    let head = path[path.length - 1]
    let nextHeads: ThisPoint[][] = []
    let newPoint = [...head] as ThisPoint

    // front
    if (newPoint[2] === '^') newPoint[0] = newPoint[0] - 1
    if (newPoint[2] === 'v') newPoint[0] = newPoint[0] + 1
    if (newPoint[2] === '<') newPoint[1] = newPoint[1] - 1
    if (newPoint[2] === '>') newPoint[1] = newPoint[1] + 1
    newPoint[3] = newPoint[3] + 1
    if (!isWall(world, newPoint) && !inTail(newPoint, path)) nextHeads.push([...path, [...newPoint]])

    newPoint = [...head] as ThisPoint
    // left
    let leftConvertHash: Record<string, string> = { '>': '^', '^': '<', '<': 'v', v: '>' }
    if (newPoint[2] === '>') newPoint[0] = newPoint[0] - 1
    if (newPoint[2] === '<') newPoint[0] = newPoint[0] + 1
    if (newPoint[2] === '^') newPoint[1] = newPoint[1] - 1
    if (newPoint[2] === 'v') newPoint[1] = newPoint[1] + 1
    if (!isWall(world, newPoint)) {
      nextHeads.push([...path, [head[0], head[1], leftConvertHash[head[2]], head[3] + 1000]])
    }

    newPoint = [...head] as ThisPoint
    // right
    let rightConvertHash: Record<string, string> = { '>': 'v', v: '<', '<': '^', '^': '>' }
    if (newPoint[2] === '<') newPoint[0] = newPoint[0] - 1
    if (newPoint[2] === '>') newPoint[0] = newPoint[0] + 1
    if (newPoint[2] === 'v') newPoint[1] = newPoint[1] - 1
    if (newPoint[2] === '^') newPoint[1] = newPoint[1] + 1
    if (!isWall(world, newPoint)) {
      nextHeads.push([...path, [head[0], head[1], rightConvertHash[head[2]], head[3] + 1000]])
    }

    return nextHeads.filter((n) => n[n.length - 1][3] <= lowestScore)
  }
  const doDijkstra = (
    world: World<string>,
    opened: ThisPoint[][],
    bestPositionAndScore: Record<string, number>,
    uniquePath: Set<string>,
    data: Data
  ) => {
    let path: ThisPoint[] = opened.splice(-1)[0]
    let head = path[path.length - 1]
    let headKey = getKeyWithDirection(head)

    log.debug('=== Dijkstra ===', headKey, 'opened', opened.length, 'data', data)

    if (isSame(head, end)) {
      if (head[3] <= data.lowestScore) {
        log.info('got lowest', head[3])
        data.lowestScore = head[3]
        data.path = path
        if (head[3] < data.lowestScore) uniquePath.clear() // throw other ones away if we are really lower
        path.forEach((p) => uniquePath.add(p[0] + ',' + p[1]))
        bestPositionAndScore[getKeyWithDirection(head)] = head[3]
      }
      return
    }

    const newPaths: ThisPoint[][] = getNewPaths(world, path, data.lowestScore)
    //console.log('new paths', newPaths)
    if (newPaths.length !== 0) {
      newPaths.forEach((newPath) => {
        let newHead = newPath[newPath.length - 1]
        const newPathKey = getKeyWithDirection(newHead)
        // never seen position/direction, so keep pursuing this path
        if (bestPositionAndScore[newPathKey] === undefined) {
          opened.push(newPath)
          bestPositionAndScore[newPathKey] = newHead[3]
        } else {
          // This position/direction was seen. where?
          // if I find it in uniquePath, with same score, then it will become part of the solution paths
          // no need to continue, but we will add the extra detour positions
          newPath.forEach((p) => uniquePath.add(newHead[0] + ',' + newHead[1]))

          /* const index = opened.findIndex((p: ThisPoint[]) => isSame(p[p.length - 1], newHead))
          // if so, check scores. If better, replace it
          if (index >= 0 && opened[index][opened[index].length - 1][3] > newHead[3]) opened[index] = path*/
        }
      })
      opened.sort((a, b) => b[b.length - 1][3] - a[a.length - 1][3])
    }
  }

  const solveFor = (world: World<string>, start: Point, end: Point, uniquePath: Set<string>): Data => {
    let data: Data = { end, lowestScore: Number.MAX_SAFE_INTEGER, path: [] }
    let iterations = 0
    let opened: ThisPoint[][] = [[[...start, '>', 0]]]
    const bestPositionAndScore: Record<string, number> = {}
    opened.forEach(
      (step) => (bestPositionAndScore[getKeyWithDirection(step[step.length - 1])] = step[step.length - 1][3])
    )
    while (opened.length > 0) {
      doDijkstra(world, opened, bestPositionAndScore, uniquePath, data)
      if (iterations % 100 === 0) {
        log.debug(
          'it',
          iterations,
          'opened length',
          opened.length,
          'best positions',
          Object.keys(bestPositionAndScore).length
        )
      }
      iterations++
    }
    return data
  }

  const uniquePath: Set<string> = new Set()
  let data: Data = solveFor(world, start!, end!, uniquePath)
  part1 = data.lowestScore
  part2 = uniquePath.size

  return { part1, part2 }
}
