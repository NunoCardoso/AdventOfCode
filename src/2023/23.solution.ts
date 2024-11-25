import { Params } from 'aoc.d'
import clc from 'cli-color'
import { World } from 'declarations'

type Path = Array<string>
type Step = {
  path: Path
  distance: number
  cost: number
}

type Data = {
  highestCost: number
  end: PointPlus
  path: Path
  careForSlopes: boolean
}

// x, y, direction
type PointPlus = [number, number, string]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let world: World<string> = []

  for await (const line of lineReader) {
    world.push(line.split(''))
  }

  let start: PointPlus = [0, world[0].indexOf('.'), 'v']
  let end: PointPlus = [world.length - 1, world[world.length - 1].indexOf('.'), 'v']

  const getKey = (p: PointPlus): string => p[0] + ',' + p[1] + ',' + p[2]

  const readKey = (s: string): PointPlus => {
    let [_0, _1, _2] = s.split(',')
    return [+_0, +_1, _2]
  }
  const isSame = (s: string, p2: PointPlus): boolean => s === getKey(p2)

  const getDistanceToFinish = (s: string, end: PointPlus): number => {
    let p = readKey(s)
    return Math.abs(end[0] - p[0]) + Math.abs(end[1] - p[1])
  }

  const getNewHeads = (headPoint: PointPlus, data: Data): Array<string> => {
    return (
      [
        [headPoint[0] - 1, headPoint[1], '^'],
        [headPoint[0] + 1, headPoint[1], 'v'],
        [headPoint[0], headPoint[1] - 1, '<'],
        [headPoint[0], headPoint[1] + 1, '>']
      ] as Array<PointPlus>
    )
      .filter((newHead: PointPlus) => {
        // reject if out of bounds
        if (newHead[0] < 0 || newHead[1] < 0) return false
        // reject if it's a wall
        if (world[newHead[0]][newHead[1]] === '#') return false
        // reject if it's against a slope
        if (
          data.careForSlopes &&
          ['>', '<', '^', 'v'].includes(world[newHead[0]][newHead[1]]) &&
          world[newHead[0]][newHead[1]] !== newHead[2]
        )
          return false
        return true
      })
      .map(getKey)
  }

  const getNewPaths = (head: PointPlus, data: Data): Array<Path> => {
    let current: Path = []

    let newHeads: Array<string> = getNewHeads(head, data)
    if (newHeads.length === 0) return []

    while (newHeads.length === 1) {
      current.push(newHeads[0])
      if (isSame(newHeads[0], data.end)) {
        return [current]
      }
      let newStep = {
        path: step.path.concat(current),
        cost: step.cost + current.length,
        distance: getDistanceToFinish(newHeads[0], data.end)
      }
      newHeads = getNewHeads(newHeads[0], data)
    }
    return newHeads.map((newHead) => current.concat([newHead]))
  }

  const depthFirst = (step: Step, data: Data): number => {
    const head: string = step.path[step.path.length - 1]
    log.trace('=== Starting ===')
    log.trace('head', head, 'cost', step.cost)

    if (isSame(head, data.end)) {
      if (data.highestCost < step.cost) {
        log.debug('Got highestCost cost with', step.cost)
        data.highestCost = step.cost
        data.path = step.path
      } else {
        //  log.debug('finished but cost is', step.cost, 'skipping')
      }
      return step.cost
    }

    let newPaths: Array<Path> = getNewPaths(readKey(head), data)

    // TODO whatever I was trying here
    /*newPaths = newPaths.filter(path => {
      // reject if hitting the tail
      let found = path.every(p =>
        step.path.find(x => x.startsWith(0[0] + ',' + head[1] + ',')))

      TODO if ())) return false
      return
    })*/

    if (newPaths.length === 0) return 0
    return Math.max(
      ...newPaths.map((newPath) =>
        depthFirst(
          {
            path: step.path.concat(newPath),
            cost: step.cost + newPath.length,
            distance: getDistanceToFinish(newPath[newPath.length - 1], data.end)
          },
          data
        )
      )
    )
  }

  const printGrid = (path: Array<string>) => {
    world.forEach((row, i) => {
      let line = ''
      row.forEach((cell, j) => {
        if (path.includes(i + ',' + j)) {
          line += clc.blue('O')
        } else {
          line += world[i][j]
        }
      })
      console.log(line)
    })
  }

  const solveFor = (careForSlopes: boolean): number => {
    const data: Data = { highestCost: 0, end, path: [], careForSlopes }
    // const visitedIndex: Map<string, any> = new Map()
    const step: Step = {
      path: [getKey(start)],
      cost: 0,
      distance: getDistanceToFinish(getKey(start), end)
    }
    let answer = depthFirst(step, data)
    log.info('answer', answer, 'data', data)
    printGrid(data.path)
    return data.highestCost
  }

  // 5858 too low

  if (!params.skipPart1) {
    part1 = solveFor(true)
  }
  if (!params.skipPart2) {
    part2 = solveFor(false)
  }

  return { part1, part2 }
}
