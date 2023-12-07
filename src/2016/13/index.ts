import { Params } from 'aoc.d'
import { Matrix, Point } from 'declarations'
import _ from 'lodash'

type Step = {
  path: Array<Point>
  cost: number
  distance: number
}

type Finished = {
  lowestCost: number
  end: Point
  step: Step | undefined
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: Matrix<string> = []

  const getSpaceOrWall = (world: Matrix<string>, row: number, column: number): string => {
    if (!Object.prototype.hasOwnProperty.call(world, row)) {
      world[row] = []
    }
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

  const searchAlgorithm = async (
    world: Matrix<string>,
    opened: Array<Step>,
    visitedIndex: Record<string, number>,
    finished: Finished,
    type: string
  ) => {
    const currentStep: Step = opened.splice(-1)[0]
    const head: Point = currentStep.path[currentStep.path.length - 1]
    const key: string = getKey(head)
    log.debug('=== Starting ===')
    log.debug('head', key, 'opened', opened.length)
    log.debug('finished', finished)

    if (type === 'part1' && isSame(head, finished.end)) {
      if (finished.lowestCost > currentStep.cost) {
        log.info('Got lowest cost with', currentStep.cost, 'path', currentStep.path)
        finished.lowestCost = currentStep.cost
        finished.step = currentStep
        // remove opened values that have higher cost than current cost
        for (let i = opened.length - 1; i >= 0; i--) {
          if (opened[i].cost > finished.lowestCost) {
            opened.splice(i, 1)
          }
        }
      }
      return
    }

    if (type === 'part2' && currentStep.cost > 50) {
      return
    }

    if (!Object.prototype.hasOwnProperty.call(visitedIndex, key)) {
      visitedIndex[key] = currentStep.cost
    } else {
      if (visitedIndex[key] > currentStep.cost) {
        visitedIndex[key] = currentStep.cost
      }
    }
    const newHeads: Array<Point> = _.reject(
      [
        [head[0] - 1, head[1]],
        [head[0] + 1, head[1]],
        [head[0], head[1] - 1],
        [head[0], head[1] + 1]
      ],
      (newHead: Point) => {
        // reject if out of bounds
        if (outOfBounds(newHead)) {
          return true
        }
        // reject if cost will never be better than what we have
        if (currentStep.cost + 1 + getDistanceToFinish(newHead, finished.end) > finished.lowestCost) {
          return true
        }

        // ok, let's unravel this new point, reject if it's wall
        const value = getSpaceOrWall(world, newHead[0], newHead[1])
        if (value === '#') {
          return true
        }

        const newKey = getKey(newHead)

        // reject if it's in the visited list, and it has a worse cost; otherwise, keep it
        if (
          Object.prototype.hasOwnProperty.call(visitedIndex, newKey) &&
          visitedIndex[newKey] <= currentStep.cost + 1
        ) {
          return true
        }

        // same reject, but with opened
        const matchOpenedPathIndex = _.findIndex(opened, (s: Step) =>
          isSame(s.path[s.path.length - 1], newHead)
        )
        if (matchOpenedPathIndex >= 0) {
          // worse cost
          if (opened[matchOpenedPathIndex].cost <= currentStep.cost + 1) {
            return true
          } else {
            opened.splice(matchOpenedPathIndex, 1)
          }
        }

        return false
      }
    )

    if (newHeads.length > 0) {
      newHeads.forEach((newHead) => {
        const newStep = _.cloneDeep(currentStep)
        newStep.cost++
        newStep.distance = getDistanceToFinish(newHead, finished.end)
        newStep.path.push(newHead)
        opened.push(newStep)
      })
      opened.sort((a, b) => {
        // lowest cost first.
        // for same cost, lowest distance first
        return b.cost - a.cost > 0 ? 1 : b.cost - a.cost < 0 ? -1 : b.distance - a.distance
      })
    }
  }

  const doIt = (world: Matrix<string>, target: Point, type: string): number => {
    const visitedIndex: any = {}
    const finished: Finished = { lowestCost: 1000, end: target, step: undefined }
    const opened: Array<Step> = [{ path: [[1, 1]], cost: 0, distance: 1000 }]
    let it = 0
    while (opened.length > 0) {
      searchAlgorithm(world, opened, visitedIndex, finished, type)
      if (it % 100 === 0) {
        log.debug('it', it, 'opened', opened.length, 'finished', finished)
      }
      it++
    }
    if (type === 'part1') {
      return finished.lowestCost
    }
    if (type === 'part2') {
      return Object.keys(visitedIndex).length
    }
    return 0
  }

  part1 = doIt(world.slice(), params.target, 'part1')
  part2 = doIt(world.slice(), params.target, 'part2')

  return { part1, part2 }
}
