import { Params } from 'aoc.d'
import { World, Point } from 'declarations'

type Step = {
  path: Array<Point>
  cost: number
  distance: number
}

type Data = {
  lowestCost: number
  end: Point
  step: Step | undefined
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World<string> = []

  const getSpaceOrWall = (world: World<string>, row: number, column: number): string => {
    if (!world[row]) world[row] = []
    if (!world[row][column]) {
      const val: number =
        row * row + 3 * row + 2 * row * column + column + column * column + params.designerNumber
      const bin = (val >>> 0).toString(2)
      const countOnes = bin.split('').filter((x: string) => x === '1').length
      world[row][column] = countOnes % 2 === 0 ? '.' : '#'
    }
    return world[row][column]
  }

  for (let row = 0; row < 2; row++) {
    for (let column = 0; column < 2; column++) {
      getSpaceOrWall(world, row, column)
    }
  }

  const getKey = (p: Point): string => '[' + p[0] + ',' + p[1] + ']'

  const isSame = (p: Point, p2: Point): boolean => p[0] === p2[0] && p[1] === p2[1]

  const getDistanceToFinish = (p: Point, end: Point): number =>
    Math.abs(end[0] - p[0]) + Math.abs(end[1] - p[1])

  const outOfBounds = (p: Point) => p[0] < 0 || p[1] < 0

  const breathFirst = async (
    world: World<string>,
    opened: Array<Step>,
    visitedIndex: Map<string, number>,
    data: Data,
    type: string
  ) => {
    const currentStep: Step = opened.splice(-1)[0]
    const head: Point = currentStep.path[currentStep.path.length - 1]
    const key: string = getKey(head)
    log.debug('=== Starting ===')
    log.debug('head', key, 'opened', opened.length)
    log.debug('data', data)

    if (type === 'part1' && isSame(head, data.end)) {
      if (data.lowestCost > currentStep.cost) {
        log.debug('Got lowest cost with', currentStep.cost, 'path', currentStep.path)
        data.lowestCost = currentStep.cost
        data.step = currentStep
        // remove opened values that have higher cost than current cost
        for (let i = opened.length - 1; i >= 0; i--) {
          if (opened[i].cost > data.lowestCost) {
            opened.splice(i, 1)
          }
        }
      }
      return
    }

    if (type === 'part2' && currentStep.cost > params.cutoff) {
      return
    }

    if (!visitedIndex.has(key)) visitedIndex.set(key, currentStep.cost)
    else if (visitedIndex.get(key)! > currentStep.cost) visitedIndex.set(key, currentStep.cost)

    const newHeads: Array<Point> = (
      [
        [head[0] - 1, head[1]],
        [head[0] + 1, head[1]],
        [head[0], head[1] - 1],
        [head[0], head[1] + 1]
      ] as Array<Point>
    ).filter((newHead: Point) => {
      // reject if out of bounds
      if (outOfBounds(newHead)) return false

      // reject if cost will never be better than what we have
      if (currentStep.cost + 1 + getDistanceToFinish(newHead, data.end) > data.lowestCost) {
        return false
      }

      // ok, let's unravel this new point, reject if it's wall
      if (getSpaceOrWall(world, newHead[0], newHead[1]) === '#') return false

      const newKey = getKey(newHead)

      // reject if it's in the visited list, and it has a worse cost; otherwise, keep it
      if (visitedIndex.has(newKey) && visitedIndex.get(newKey)! <= currentStep.cost + 1) {
        return false
      }

      // same reject, but with opened
      const matchOpenedPathIndex = opened.findIndex((s: Step) => isSame(s.path[s.path.length - 1], newHead))
      if (matchOpenedPathIndex >= 0) {
        // worse cost
        if (opened[matchOpenedPathIndex].cost <= currentStep.cost + 1) return false
        else opened.splice(matchOpenedPathIndex, 1)
      }
      return true
    })

    if (newHeads.length > 0) {
      newHeads.forEach((newHead) => {
        const newStep = global.structuredClone(currentStep)
        newStep.cost++
        newStep.distance = getDistanceToFinish(newHead, data.end)
        newStep.path.push(newHead)
        opened.push(newStep)
      })
      opened.sort((a, b) => b.cost - a.cost)
    }
  }

  const solveFor = (world: World<string>, target: Point, type: string): number => {
    const visitedIndex: Map<string, number> = new Map()
    const data: Data = { lowestCost: 1000, end: target, step: undefined }
    const opened: Array<Step> = [{ path: [[1, 1]], cost: 0, distance: 1000 }]
    while (opened.length > 0) {
      breathFirst(world, opened, visitedIndex, data, type)
    }
    if (type === 'part1') return data.lowestCost
    if (type === 'part2') return visitedIndex.size
    return 0
  }

  part1 = solveFor(world.slice(), params.target, 'part1')
  part2 = solveFor(world.slice(), params.target, 'part2')

  return { part1, part2 }
}
