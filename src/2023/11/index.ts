import { Params } from 'aoc.d'
import { Matrix, Point } from 'declarations'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: Matrix<string> = []
  const galaxies: Array<Point> = []
  let it = 0
  const rowsWithoutGalaxies: Array<number> = []
  const columnsWithoutGalaxies: Array<number> = []
  const columnsWithGalaxies: Record<string, number> = {}

  for await (const line of lineReader) {
    const values = line.split('')
    world.push(values)
    for (let i = 0; i < values.length; i++) {
      if (values[i] === '#') {
        if (!Object.prototype.hasOwnProperty.call(columnsWithGalaxies, i.toString())) {
          columnsWithGalaxies[i.toString()] = 1
        }
        galaxies.push([it, i])
      }
    }
    if (line.indexOf('#') < 0) {
      rowsWithoutGalaxies.push(it)
    }
    it++
  }

  const worldDimensions = [world.length, world[0].length]
  for (let i = 0; i < worldDimensions[1]; i++) {
    if (!Object.prototype.hasOwnProperty.call(columnsWithGalaxies, i.toString())) {
      columnsWithoutGalaxies.push(i)
    }
  }

  const distanceBetweenTwoPoints = (p1: Point, p2: Point, distanceInEmpty: number) => {
    return (
      Math.abs(p2[0] - p1[0]) +
      Math.abs(p2[1] - p1[1]) +
      _.filter(
        rowsWithoutGalaxies,
        (row: number) => row > Math.min(p2[0], p1[0]) && row < Math.max(p2[0], p1[0])
      ).length *
        distanceInEmpty +
      _.filter(
        columnsWithoutGalaxies,
        (col: number) => col > Math.min(p2[1], p1[1]) && col < Math.max(p2[1], p1[1])
      ).length *
        distanceInEmpty
    )
  }

  const solveFor = (distanceInEmpty: number): number => {
    let lowestSum = 0
    for (let i = 0; i < galaxies.length - 1; i++) {
      for (let j = i + 1; j < galaxies.length; j++) {
        lowestSum += distanceBetweenTwoPoints(galaxies[i], galaxies[j], distanceInEmpty)
      }
    }
    return lowestSum
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = solveFor(1)
  }
  if (params.skip !== true && params.skip !== 'part2') {
    part2 = solveFor(params.distance - 1)
  }

  return { part1, part2 }
}
