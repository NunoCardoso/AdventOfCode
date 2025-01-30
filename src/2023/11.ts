import { Params } from 'aoc.d'
import { Location } from 'declarations'
import { combination } from 'util/combination'
import { getManhattanDistance } from 'util/location'
import { range } from 'util/range'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let worldColumns: number = 0
  const galaxies: Location[] = []
  const rowsWithoutGalaxies: number[] = []
  const columnsWithoutGalaxies: number[] = []
  const columnsWithGalaxies: Set<number> = new Set()

  let rowIndex = 0
  for await (const line of lineReader) {
    if (worldColumns === 0) worldColumns = line.length
    line.split('').forEach((char: string, colIndex: number) => {
      if (char === '#') {
        columnsWithGalaxies.add(colIndex)
        galaxies.push([rowIndex, colIndex])
      }
    })
    if (line.indexOf('#') < 0) rowsWithoutGalaxies.push(rowIndex)
    rowIndex++
  }

  for (let galaxy of range(worldColumns)) if (!columnsWithGalaxies.has(galaxy)) columnsWithoutGalaxies.push(galaxy)

  const distanceBetweenTwoPoints = (l1: Location, l2: Location, distanceInEmpty: number) =>
    getManhattanDistance(l1, l2) +
    rowsWithoutGalaxies.filter((row: number) => row > Math.min(l2[0], l1[0]) && row < Math.max(l2[0], l1[0])).length *
      distanceInEmpty +
    columnsWithoutGalaxies.filter((col: number) => col > Math.min(l2[1], l1[1]) && col < Math.max(l2[1], l1[1]))
      .length *
      distanceInEmpty

  const solveFor = (distanceInEmpty: number): number =>
    combination(galaxies, 2).reduce(
      (acc, galaxyPair) => acc + distanceBetweenTwoPoints(galaxyPair[0], galaxyPair[1], distanceInEmpty),
      0
    )

  if (!params.skipPart1) part1 = solveFor(1)
  if (!params.skipPart2) part2 = solveFor(params.distance - 1)

  return { part1, part2 }
}
