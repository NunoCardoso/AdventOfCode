import { Params } from 'aoc.d'
import * as console from 'console'
import { Dimension, PointPlus, World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let world: World<string> = []
  let initialPosition: PointPlus<string> = [0, 0, '^']
  let i = 0
  for await (const line of lineReader) {
    const values = line.split('')
    const pos = line.indexOf('^')
    if (pos >= 0) {
      initialPosition = [i, pos, '^']
      values[pos] = '.'
    }
    world.push(values)
    i++
  }

  const isOutOfBounds = (world: World<string>, position: PointPlus<string>) =>
    position[0] < 0 || position[1] < 0 || position[0] >= world.length || position[1] >= world[0].length

  const nextDirection = (direction: string): string => {
    let directions = ['^', '>', 'v', '<']
    let current = directions.indexOf(direction)
    return directions[(current + 1) % directions.length]
  }

  const justPoint2string = (p: PointPlus<string>): string => p[0] + ':' + p[1]
  const fullPoint2string = (p: PointPlus<string>): string => p[0] + ':' + p[1] + ':' + p[2]

  const move = (
    position: PointPlus<string>,
    world: World<string>
  ): [PointPlus<string>, PointPlus<string>[], string] => {
    let visitedPositions: PointPlus<string>[] = []
    let currentPosition: PointPlus<string> = position
    let newPosition: PointPlus<string> | undefined = undefined
    let status: string = ''
    while (true) {
      if (currentPosition[2] === '^') newPosition = [currentPosition[0] - 1, currentPosition[1], currentPosition[2]]
      if (currentPosition[2] === 'v') newPosition = [currentPosition[0] + 1, currentPosition[1], currentPosition[2]]
      if (currentPosition[2] === '>') newPosition = [currentPosition[0], currentPosition[1] + 1, currentPosition[2]]
      if (currentPosition[2] === '<') newPosition = [currentPosition[0], currentPosition[1] - 1, currentPosition[2]]
      if (isOutOfBounds(world, newPosition!)) {
        status = 'out of bounds'
        break
      }
      if (world[newPosition![0]][newPosition![1]] === '#') break
      visitedPositions.push(newPosition!)
      currentPosition = newPosition!
    }
    currentPosition[2] = nextDirection(currentPosition[2]!)
    return [currentPosition, visitedPositions, status]
  }

  const solveFor = (world: World<string>, initialPosition: PointPlus<string>): number => {
    let visitedPositions: Set<string> = new Set()
    visitedPositions.add(justPoint2string(initialPosition))
    let position = initialPosition
    let status: string = ''
    while (status === '') {
      const [newPosition, newVisitedPositions, newStatus] = move(position, world)
      newVisitedPositions.forEach((p: PointPlus<string>) => visitedPositions.add(justPoint2string(p)))
      position = newPosition
      status = newStatus
    }
    return visitedPositions.size
  }

  const solveForPart2 = (world: World<string>, initialPosition: PointPlus<string>): number => {
    let visitedPositions: Set<string> = new Set()
    visitedPositions.add(fullPoint2string(initialPosition))
    let position = initialPosition
    let status: string = ''

    while (status === '') {
      const [newPosition, newVisitedPositions, newStatus] = move(position, world)
      newVisitedPositions.forEach((p: PointPlus<string>) => {
        let pString = fullPoint2string(p)
        if (visitedPositions.has(pString)) {
          status = 'stuck'
        }
        visitedPositions.add(pString)
      })
      position = newPosition
      if (status === '') status = newStatus
    }
    return status === 'stuck' ? 1 : 0
  }

  if (!params.skipPart1) {
    part1 = solveFor(global.structuredClone(world), [...initialPosition])
  }

  if (!params.skipPart2) {
    let worldWithObstruction = global.structuredClone(world)
    let previousRow: number = Number.NaN
    let previousCol: number = Number.NaN
    for (var row = 0; row < world.length; row++) {
      for (var col = 0; col < world[0].length; col++) {
        if (world[row][col] === '.') {
          if (!Number.isNaN(previousRow)) {
            worldWithObstruction[previousRow!][previousCol] = '.'
          }
          worldWithObstruction[row][col] = '#'
          part2 += solveForPart2(worldWithObstruction, [...initialPosition])
          previousRow = row
          previousCol = col
        }
      }
    }
  }

  return { part1, part2 }
}
