import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Dimension, World, Point } from 'declarations'
import _, { isEmpty } from 'lodash'

type Finished = {
  path: Array<Point>
  inners: number
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World<string> = []
  let start: Point | undefined

  const getKey = (p: Point) => '' + p[0] + '-' + p[1]

  let it = 0
  for await (const line of lineReader) {
    world.push(line.split(''))
    const index = line.indexOf('S')
    if (index >= 0) {
      start = [it, index]
    }
    it++
  }

  const worldDimensions: Dimension = [world.length, world[0].length]
  log.info('world', worldDimensions)

  const printGrid = (world: World<string>, situationWorld: World<string>) => {
    for (let i = 0; i < world.length; i++) {
      let l = ''
      for (let j = 0; j < world[i].length; j++) {
        const type = situationWorld[i][j]
        if (type === 'P') {
          l += clc.red(world[i][j])
        } else if (type === 'I') {
          l += clc.blue(world[i][j])
        } else if (type === 'O') {
          l += clc.yellow(world[i][j])
        } else {
          l += world[i][j]
        }
      }
      console.log(l)
    }
    console.log('')
  }

  const outOfBounds = (newPoint: Point) =>
    newPoint[0] < 0 ||
    newPoint[0] >= worldDimensions[0] ||
    newPoint[1] < 0 ||
    newPoint[1] >= worldDimensions[1]

  const isSame = (p: Point, p2: Point) => p[0] === p2[0] && p[1] === p2[1]

  const getValue = (p: Point) => world[p[0]][p[1]]

  const getNextPoints = (point: Point, visited: Record<string, number>) => {
    return _.filter(
      [
        [point[0] - 1, point[1]],
        [point[0] + 1, point[1]],
        [point[0], point[1] - 1],
        [point[0], point[1] + 1]
      ],
      (newPoint: Point) => {
        if (outOfBounds(newPoint)) {
          return false
        }
        const newKey = getKey(newPoint)
        if (_.isNumber(visited[newKey])) {
          return false
        }
        const pointValue = getValue(point)
        const newPointValue = getValue(newPoint)

        const isTop = (newPointValue: string, point: Point, newPoint: Point): boolean =>
          (newPointValue === 'S' ||
            newPointValue === '7' ||
            newPointValue === '|' ||
            newPointValue === 'F') &&
          newPoint[0] === point[0] - 1

        const isBottom = (newPointValue: string, point: Point, newPoint: Point): boolean =>
          (newPointValue === 'S' ||
            newPointValue === 'J' ||
            newPointValue === '|' ||
            newPointValue === 'L') &&
          newPoint[0] === point[0] + 1

        const isLeft = (newPointValue: string, point: Point, newPoint: Point): boolean =>
          (newPointValue === 'S' ||
            newPointValue === 'L' ||
            newPointValue === '-' ||
            newPointValue === 'F') &&
          newPoint[1] === point[1] - 1

        const isRight = (newPointValue: string, point: Point, newPoint: Point): boolean =>
          (newPointValue === 'S' ||
            newPointValue === 'J' ||
            newPointValue === '-' ||
            newPointValue === '7') &&
          newPoint[1] === point[1] + 1

        if (
          pointValue === '|' &&
          (isTop(newPointValue, point, newPoint) || isBottom(newPointValue, point, newPoint))
        ) {
          return true
        }
        if (
          pointValue === '-' &&
          (isLeft(newPointValue, point, newPoint) || isRight(newPointValue, point, newPoint))
        ) {
          return true
        }
        if (
          pointValue === 'L' &&
          (isTop(newPointValue, point, newPoint) || isRight(newPointValue, point, newPoint))
        ) {
          return true
        }
        if (
          pointValue === 'J' &&
          (isTop(newPointValue, point, newPoint) || isLeft(newPointValue, point, newPoint))
        ) {
          return true
        }
        if (
          pointValue === '7' &&
          (isLeft(newPointValue, point, newPoint) || isBottom(newPointValue, point, newPoint))
        ) {
          return true
        }
        if (
          pointValue === 'F' &&
          (isRight(newPointValue, point, newPoint) || isBottom(newPointValue, point, newPoint))
        ) {
          return true
        }
        if (
          pointValue === 'S' &&
          (((newPointValue === '7' || newPointValue === '|' || newPointValue === 'F') &&
            newPoint[0] === point[0] - 1) ||
            ((newPointValue === 'J' || newPointValue === '|' || newPointValue === 'L') &&
              newPoint[0] === point[0] + 1) ||
            ((newPointValue === 'J' || newPointValue === '-' || newPointValue === '7') &&
              newPoint[1] === point[1] + 1) ||
            ((newPointValue === 'L' || newPointValue === '-' || newPointValue === 'F') &&
              newPoint[1] === point[1] - 1))
        ) {
          // top
          return true
        }
        return false
      }
    )
  }

  const breathFirst = (
    opened: Array<Point>,
    visited: Record<string, number>,
    finished: Finished,
    distance: number
  ) => {
    const point = opened.splice(-1)[0]
    const firstKey = getKey(point)
    visited[firstKey] = distance + 1
    const nextPoints = getNextPoints(point, visited)
    if (isEmpty(nextPoints)) {
      // cleanup
      opened.splice(0, opened.length)
      return
    }
    finished.path.push(nextPoints[0])
    opened.push(nextPoints[0])
    // no sort, so it's a dephth first
  }

  const guessPipeValue = (p: Point, pipeBefore: Point, pipeAfter: Point): string => {
    if (
      (isSame([p[0], p[1] - 1], pipeBefore) && isSame([p[0], p[1] + 1], pipeAfter)) ||
      (isSame([p[0], p[1] - 1], pipeAfter) && isSame([p[0], p[1] + 1], pipeBefore))
    ) {
      return '-'
    }
    if (
      (isSame([p[0] - 1, p[1]], pipeBefore) && isSame([p[0] + 1, p[1]], pipeAfter)) ||
      (isSame([p[0] - 1, p[1]], pipeAfter) && isSame([p[0] + 1, p[1]], pipeBefore))
    ) {
      return '|'
    }
    if (
      (isSame([p[0] + 1, p[1]], pipeBefore) && isSame([p[0], p[1] - 1], pipeAfter)) ||
      (isSame([p[0] + 1, p[1]], pipeAfter) && isSame([p[0], p[1] - 1], pipeBefore))
    ) {
      return '7'
    }
    if (
      (isSame([p[0] + 1, p[1]], pipeBefore) && isSame([p[0], p[1] + 1], pipeAfter)) ||
      (isSame([p[0] + 1, p[1]], pipeAfter) && isSame([p[0], p[1] + 1], pipeBefore))
    ) {
      return 'F'
    }
    if (
      (isSame([p[0] - 1, p[1]], pipeBefore) && isSame([p[0], p[1] - 1], pipeAfter)) ||
      (isSame([p[0] - 1, p[1]], pipeAfter) && isSame([p[0], p[1] - 1], pipeBefore))
    ) {
      return 'J'
    }
    if (
      (isSame([p[0] - 1, p[1]], pipeBefore) && isSame([p[0], p[1] + 1], pipeAfter)) ||
      (isSame([p[0] - 1, p[1]], pipeAfter) && isSame([p[0], p[1] + 1], pipeBefore))
    ) {
      return 'L'
    }
    return ''
  }

  const makeSituationWorld = (world: World<string>, finished: Finished) => {
    const _world = _.cloneDeep(world)
    let inners = 0
    for (let i = 0; i < world.length; i++) {
      const points = _.filter(finished.path, (point: Point) => point[0] === i)
      const pointsIndex: any = {}
      let inner: boolean = false
      points.forEach((point: Point) => {
        pointsIndex[getKey(point)] = ''
      })
      for (let j = 0; j < world[i].length; j++) {
        if (Object.prototype.hasOwnProperty.call(pointsIndex, getKey([i, j]))) {
          _world[i][j] = 'P'
          let val = getValue([i, j])
          if (val === 'S') {
            // S point is always the finished.path[0], the one in front and back are [1] and the [length -1]
            val = guessPipeValue([i, j], finished.path[finished.path.length - 1], finished.path[1])
            log.debug('Guessed', val)
          }
          if (['|', 'L', 'J'].indexOf(val) >= 0) {
            inner = !inner
          }
        } else {
          _world[i][j] = inner ? 'I' : 'O'
          if (inner) {
            inners++
          }
        }
      }
    }
    finished.inners = inners
    return _world
  }
  const solveFor = (start: Point): Finished => {
    const visited: Record<string, number> = { [getKey(start)]: 0 }
    const finished: Finished = { path: [start], inners: 0 }
    const opened = [start]
    let it = 0

    while (opened.length > 0) {
      breathFirst(opened, visited, finished, it)
      it++
    }

    const situationWorld = makeSituationWorld(world, finished)
    printGrid(world, situationWorld)
    return finished
  }

  let finished: Finished | undefined
  if (params.skip !== true) {
    finished = solveFor(start!)
    part1 = finished.path.length / 2
  }

  if (params.skip !== true && params.skip !== 'part2') {
    part2 = finished?.inners ?? 0
  }

  return { part1, part2 }
}
