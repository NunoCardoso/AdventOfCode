import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Dimension, World } from 'declarations'
import { range } from 'util/range'

type LocationPlus = [x: number, y: number, height: number, basin?: number]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const isLocationSeen = (locations: LocationPlus[], location: LocationPlus) =>
    locations.some((l: LocationPlus) => l[0] === location[0] && l[1] === location[1])

  const getKey = (location: LocationPlus): string => location[0] + ',' + location[1]

  const printGrid = (world: World, lowPoints: LocationPlus[], basins: string[]) => {
    world.forEach((row, i) => {
      let line = ''
      row.forEach((cell, j) => {
        const location: LocationPlus = [i, j, world[i][j]]
        const key = getKey(location)
        if (isLocationSeen(lowPoints, location)) line += clc.bgRed(location[2])
        else if (basins.includes(key)) line += clc.bgCyanBright(location[2])
        else line += clc.bgGreen.bold(location[2])
      })
      log.info(line)
    })
  }

  const getAdjacentLocations = (
    location: LocationPlus,
    world: World,
    worldDimension: Dimension,
    visited: Set<string> = new Set<string>()
  ): LocationPlus[] => {
    const locations: LocationPlus[] = []
    let newLocation: LocationPlus
    if (location[1] > 0) {
      newLocation = [location[0], location[1] - 1, world[location[0]][location[1] - 1]]
      if (!visited.has(getKey(newLocation))) locations.push(newLocation)
    }
    if (location[1] < worldDimension[1] - 1) {
      newLocation = [location[0], location[1] + 1, world[location[0]][location[1] + 1]]
      if (!visited.has(getKey(newLocation))) locations.push(newLocation)
    }
    if (location[0] > 0) {
      newLocation = [location[0] - 1, location[1], world[location[0] - 1][location[1]]]
      if (!visited.has(getKey(newLocation))) locations.push(newLocation)
    }
    if (location[0] < worldDimension[0] - 1) {
      newLocation = [location[0] + 1, location[1], world[location[0] + 1][location[1]]]
      if (!visited.has(getKey(newLocation))) locations.push(newLocation)
    }
    return locations
  }

  const getMoreLocations = (locations: LocationPlus[]): LocationPlus[] =>
    locations.filter((c: LocationPlus) => c[2] !== 9)

  const isLowerPoint = (location: LocationPlus, otherLocations: LocationPlus[]) =>
    otherLocations.every((l) => l[2] > location[2])

  const doSearch = (opened: LocationPlus[], visited: Set<string>, world: World, worldDimension: Dimension) => {
    const head: LocationPlus = opened.pop()!
    const neighbors: LocationPlus[] = getAdjacentLocations(head, world, worldDimension, visited)
    visited.add(getKey(head))
    const newLocations: LocationPlus[] = getMoreLocations(neighbors)
    newLocations.forEach((newLocation) => {
      if (!opened.some((l) => getKey(l) === getKey(newLocation))) opened.push(newLocation)
    })
  }

  const world: World = []
  for await (const line of lineReader) world.push(line.split('').map(Number))
  let worldDimension: Dimension = [world.length, world[0].length]

  log.debug('world of ', worldDimension)

  const lowPoints: LocationPlus[] = []
  const basins: string[] = [] // this is just for UI

  for (let row of range(worldDimension[0])) {
    for (let column of range(worldDimension[1])) {
      const location: LocationPlus = [row, column, world[row][column], undefined]
      const adjacentLocations = getAdjacentLocations(location, world, worldDimension)
      if (isLowerPoint(location, adjacentLocations)) lowPoints.push(location)
    }
  }

  for (let lowPoint of lowPoints) {
    const visited: Set<string> = new Set<string>()
    const opened: LocationPlus[] = [lowPoint]
    while (opened.length > 0) doSearch(opened, visited, world, worldDimension)
    lowPoint[3] = visited.size
    if (params.ui?.show) basins.push(...visited)
  }

  const part1 = lowPoints.reduce((acc, lowPoint) => acc + lowPoint[2] + 1, 0)

  const part2 = lowPoints
    .sort((a, b) => b[3]! - a[3]!)
    .slice(0, 3)
    .reduce((acc, point) => acc * point[3]!, 1)

  if (params.ui?.show && params.ui?.end) printGrid(world, lowPoints, basins)

  return { part1, part2 }
}
