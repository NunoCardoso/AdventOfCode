import { Params } from 'aoc.d'
import { Point } from 'declarations'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let worldColumns: number = 0
  const galaxies: Array<Point> = []
  let it = 0
  const rowsWithoutGalaxies: Array<number> = []
  const columnsWithoutGalaxies: Array<number> = []
  const columnsWithGalaxies: Set<number> = new Set()

  for await (const line of lineReader) {
    if (worldColumns === 0) worldColumns = line.length
    line.split('').forEach((char: string, i: number) => {
      if (char === '#') {
        columnsWithGalaxies.add(i)
        galaxies.push([it, i])
      }
    })
    if (line.indexOf('#') < 0) rowsWithoutGalaxies.push(it)
    it++
  }

  for (let i = 0; i < worldColumns; i++) {
    if (!columnsWithGalaxies.has(i)) columnsWithoutGalaxies.push(i)
  }

  const distanceBetweenTwoPoints = (p1: Point, p2: Point, distanceInEmpty: number) =>
    Math.abs(p2[0] - p1[0]) +
    Math.abs(p2[1] - p1[1]) +
    rowsWithoutGalaxies.filter((row: number) => row > Math.min(p2[0], p1[0]) && row < Math.max(p2[0], p1[0])).length *
      distanceInEmpty +
    columnsWithoutGalaxies.filter((col: number) => col > Math.min(p2[1], p1[1]) && col < Math.max(p2[1], p1[1]))
      .length *
      distanceInEmpty

  const solveFor = (distanceInEmpty: number): number => {
    let lowestSum = 0
    for (let i = 0; i < galaxies.length - 1; i++) {
      for (let j = i + 1; j < galaxies.length; j++) {
        lowestSum += distanceBetweenTwoPoints(galaxies[i], galaxies[j], distanceInEmpty)
      }
    }
    return lowestSum
  }

  if (!params.skipPart1) {
    part1 = solveFor(1)
  }
  if (!params.skipPart2) {
    part2 = solveFor(params.distance - 1)
  }

  return { part1, part2 }
}
