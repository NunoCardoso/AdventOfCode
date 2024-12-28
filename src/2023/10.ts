import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Dimension, Point, World } from 'declarations'

type Data = {
  path: Array<Point>
  numberOfInnerPoints: number
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World<string> = []
  let start: Point | undefined

  const getKey = (p: Point) => '' + p[0] + '-' + p[1]

  let it: number = 0
  for await (const line of lineReader) {
    world.push(line.split(''))
    const index = line.indexOf('S')
    if (index >= 0) start = [it, index]
    it++
  }

  const worldDimensions: Dimension = [world.length, world[0].length]
  log.debug('world', worldDimensions)

  const boxChars: any = { '|': '│', 7: '╮', J: '╯', F: '╭', L: '╰', '-': '─' }

  const convert = (s: string): string => boxChars[s] ?? s

  const printGrid = (world: World<string>, situationWorld: World<string>) => {
    world.forEach((row, i) => {
      console.log(
        row
          .map((cell, j) => {
            const type = situationWorld[i][j]
            switch (type) {
              case 'P':
                return clc.red(convert(cell))
              case 'I':
                return clc.blue(convert(cell))
              case 'O':
                return clc.yellow(convert(cell))
              default:
                return world[i][j]
            }
          })
          .join('')
      )
    })
    console.log('')
  }

  const outOfBounds = (newPoint: Point) =>
    newPoint[0] < 0 || newPoint[0] >= worldDimensions[0] || newPoint[1] < 0 || newPoint[1] >= worldDimensions[1]

  const isSame = (p: Point, p2: Point) => p[0] === p2[0] && p[1] === p2[1]

  const getValue = (p: Point) => world[p[0]][p[1]]

  const getNextPoints = (point: Point, visited: Map<string, number>) =>
    (
      [
        [point[0] - 1, point[1]],
        [point[0] + 1, point[1]],
        [point[0], point[1] - 1],
        [point[0], point[1] + 1]
      ] as Array<Point>
    ).filter((newPoint: Point) => {
      if (outOfBounds(newPoint)) {
        return false
      }
      const newKey = getKey(newPoint)
      if (visited.has(newKey)) {
        return false
      }
      const pointValue = getValue(point)
      const newPointValue = getValue(newPoint)

      const isTop = (newPointValue: string, point: Point, newPoint: Point): boolean =>
        ['S', '7', '|', 'F'].includes(newPointValue) && newPoint[0] === point[0] - 1

      const isBottom = (newPointValue: string, point: Point, newPoint: Point): boolean =>
        ['S', 'J', '|', 'L'].includes(newPointValue) && newPoint[0] === point[0] + 1

      const isLeft = (newPointValue: string, point: Point, newPoint: Point): boolean =>
        ['S', 'L', '-', 'F'].includes(newPointValue) && newPoint[1] === point[1] - 1

      const isRight = (newPointValue: string, point: Point, newPoint: Point): boolean =>
        ['S', 'J', '-', '7'].includes(newPointValue) && newPoint[1] === point[1] + 1

      if (pointValue === '|' && (isTop(newPointValue, point, newPoint) || isBottom(newPointValue, point, newPoint))) {
        return true
      }
      if (pointValue === '-' && (isLeft(newPointValue, point, newPoint) || isRight(newPointValue, point, newPoint))) {
        return true
      }
      if (pointValue === 'L' && (isTop(newPointValue, point, newPoint) || isRight(newPointValue, point, newPoint))) {
        return true
      }
      if (pointValue === 'J' && (isTop(newPointValue, point, newPoint) || isLeft(newPointValue, point, newPoint))) {
        return true
      }
      if (pointValue === '7' && (isLeft(newPointValue, point, newPoint) || isBottom(newPointValue, point, newPoint))) {
        return true
      }
      if (pointValue === 'F' && (isRight(newPointValue, point, newPoint) || isBottom(newPointValue, point, newPoint))) {
        return true
      }
      if (
        pointValue === 'S' &&
        ((['7', '|', 'F'].includes(newPointValue) && newPoint[0] === point[0] - 1) ||
          (['J', '|', 'L'].includes(newPointValue) && newPoint[0] === point[0] + 1) ||
          (['J', '-', '7'].includes(newPointValue) && newPoint[1] === point[1] + 1) ||
          (['L', '-', 'F'].includes(newPointValue) && newPoint[1] === point[1] - 1))
      ) {
        // top
        return true
      }
      return false
    })

  const breathFirst = (opened: Array<Point>, visited: Map<string, number>, data: Data, distance: number) => {
    const point = opened.splice(-1)[0]
    const key = getKey(point)
    visited.set(key, distance + 1)
    const nextPoints = getNextPoints(point, visited)
    if (nextPoints.length === 0) {
      // cleanup
      opened.splice(0, opened.length)
      return
    }
    // no sort, so it's a depth first. Also, search only one pipe edge
    data.path.push(nextPoints[0])
    opened.push(nextPoints[0])
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

  const labelPipesAndSpaces = (world: World<string>, data: Data) =>
    world.map((row, i) => {
      const pipePointKeysInRow: Set<string> = new Set(data.path.filter((point: Point) => point[0] === i).map(getKey))
      let inner: boolean = false
      return row.map((cell, j) => {
        let val: string
        if (pipePointKeysInRow.has(getKey([i, j]))) {
          val = 'P'
          if (getValue([i, j]) === 'S') {
            // S point is always the data.path[0], use the point in front and back ([1] and [length -1]) to guess value
            cell = guessPipeValue([i, j], data.path[data.path.length - 1], data.path[1])
          }
          if (['|', 'L', 'J'].includes(cell)) inner = !inner
        } else {
          val = inner ? 'I' : 'O'
          if (inner) data.numberOfInnerPoints++
        }
        return val
      })
    })

  if (!params.skipPart1) {
    const visited: Map<string, number> = new Map().set(getKey(start!), 0)
    const data: Data = { path: [start!], numberOfInnerPoints: 0 }
    const opened = [start!]
    let it = 0

    while (opened.length > 0) {
      breathFirst(opened, visited, data, it)
      it++
    }
    const situationWorld = labelPipesAndSpaces(world, data)
    if (params.ui.show) {
      printGrid(world, situationWorld)
    }

    part1 = data.path.length / 2
    if (!params.skipPart2) part2 = data.numberOfInnerPoints
  }

  return { part1, part2 }
}
