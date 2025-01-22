import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Location3D } from 'declarations'

type Dimension = [minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let dimension: Dimension = [0, 0, 0, 0, 0, 0]

  const isObsidian = (needle: Location3D, haystack: Record<string, Location3D>): boolean =>
    !!haystack[needle[0] + ',' + needle[1] + ',' + needle[2]]

  const isOutside = (needle: Location3D, haystack: Record<string, Location3D>) =>
    outsideBoundaries(needle) ? true : isObsidian(needle, haystack)

  const numberOfExposedSurfaces = (location: Location3D, obsidianLocationsMap: Record<string, Location3D>): number =>
    (
      [
        [location[0] + 1, location[1], location[2]],
        [location[0] - 1, location[1], location[2]],
        [location[0], location[1] + 1, location[2]],
        [location[0], location[1] - 1, location[2]],
        [location[0], location[1], location[2] + 1],
        [location[0], location[1], location[2] - 1]
      ] as Location3D[]
    ).reduce((acc, location) => acc + (!isObsidian(location, obsidianLocationsMap) ? 1 : 0), 0)

  const numberOfExposedSurfacesToOutside = (
    location: Location3D,
    outsideLocation3DKeys: Record<string, Location3D>
  ): number =>
    (
      [
        [location[0] + 1, location[1], location[2]],
        [location[0] - 1, location[1], location[2]],
        [location[0], location[1] + 1, location[2]],
        [location[0], location[1] - 1, location[2]],
        [location[0], location[1], location[2] + 1],
        [location[0], location[1], location[2] - 1]
      ] as Location3D[]
    ).reduce((acc, location) => acc + (isOutside(location, outsideLocation3DKeys) ? 1 : 0), 0)

  const outsideBoundaries = (c: Location3D) =>
    c[0] < dimension[0]! ||
    c[0] > dimension[1]! ||
    c[1] < dimension[2]! ||
    c[1] > dimension[3]! ||
    c[2] < dimension[4]! ||
    c[2] > dimension[5]!

  const getMoreLocations = (
    obsidianLocationsMap: Record<string, Location3D>,
    queue: Location3D[],
    visited: Record<string, Location3D>,
    current: Location3D
  ): Location3D[] =>
    (
      [
        [current[0] + 1, current[1], current[2]],
        [current[0] - 1, current[1], current[2]],
        [current[0], current[1] + 1, current[2]],
        [current[0], current[1] - 1, current[2]],
        [current[0], current[1], current[2] + 1],
        [current[0], current[1], current[2] - 1]
      ] as Location3D[]
    ).filter((c: Location3D) => {
      // reject off bounds
      if (outsideBoundaries(c)) return false
      // reject already visited
      if (isVisited(visited, c)) return false
      // reject already opened
      if (queue.some((o: Location3D) => o[0] === c[0] && o[1] === c[1] && o[2] === c[2])) return false
      // reject Location3D that are obsidian
      if (isObsidian(c, obsidianLocationsMap)) return false
      return true
    })

  const isVisited = (visited: Record<string, Location3D>, c: Location3D) =>
    Object.prototype.hasOwnProperty.call(visited, '' + c[0] + ',' + c[1] + ',' + c[2])

  const setVisited = (visited: Record<string, Location3D>, c: Location3D): void => {
    visited['' + c[0] + ',' + c[1] + ',' + c[2]] = c
  }

  const printObsidian = (
    dimension: Dimension,
    outsideLocationsMap: Record<string, Location3D>,
    obsidianLocationsMap: Record<string, Location3D>
  ) => {
    for (let z = dimension[4]!; z <= dimension[5]!; z++) {
      const lines = []
      for (let x = dimension[0]!; x <= dimension[1]!; x++) {
        let line = ''
        for (let y = dimension[2]!; y <= dimension[3]!; y++) {
          if (isOutside([x, y, z], outsideLocationsMap)) line += clc.blue('O')
          else if (isObsidian([x, y, z], obsidianLocationsMap)) line += clc.red('X')
          else line += '.'
        }
        lines.push(line)
      }
      log.info('z=', z)
      lines.forEach((l) => log.info(l))
    }
  }

  const exploreOutside = (
    obsidianLocationsMap: Record<string, Location3D>,
    initialPaths: Location3D[]
  ): Record<string, Location3D> => {
    log.debug('started explore outside')
    const visited: Record<string, Location3D> = {}
    const queue: Location3D[] = initialPaths
    while (queue.length > 0) {
      const current: Location3D = queue.pop()!
      if (!isVisited(visited, current)) {
        setVisited(visited, current)
        let moreLocations: Location3D[] = getMoreLocations(obsidianLocationsMap, queue, visited, current)
        if (moreLocations.length > 0) queue.push(...moreLocations)
      }
    }
    log.debug('ended explore outside, found', Object.keys(visited).length, 'Location3Ds outside')
    return visited
  }

  const obsidianLocationsMap: Record<string, Location3D> = {}

  for await (const line of lineReader) {
    const [, x, y, z] = line.match(/^(\d+),(\d+),(\d+)$/).map(Number)
    if (x < dimension[0]) dimension[0] = x
    if (x > dimension[1]) dimension[1] = x
    if (y < dimension[2]) dimension[2] = y
    if (y > dimension[3]) dimension[3] = y
    if (z < dimension[4]) dimension[4] = z
    if (z > dimension[5]) dimension[5] = z
    obsidianLocationsMap[line] = [x, y, z]
  }

  let part1: number = 0
  let part2: number = 0
  const maxSpace =
    (dimension[1]! - dimension[0]! + 1) * (dimension[3]! - dimension[2]! + 1) * (dimension[5]! - dimension[4]! + 1)

  if (params.part1?.skip !== true)
    part1 = Object.values(obsidianLocationsMap).reduce(
      (acc, location) => acc + numberOfExposedSurfaces(location, obsidianLocationsMap),
      0
    )

  if (params.part2?.skip !== true) {
    // get all the connected Location3Ds that are outside obsidian
    // then we know which Location3Ds are inside obsidian
    const initialPaths: Location3D[] = []
    for (let x = 0; x <= dimension[1]!; x++) {
      for (let y = 0; y <= dimension[3]!; y++) {
        for (let z = 0; z <= dimension[5]!; z++) {
          if (x === 0 || x === dimension[1]! || y === 0 || y === dimension[3]! || z === 0 || z === dimension[5]!) {
            if (!obsidianLocationsMap[x + ',' + y + ',' + z]) initialPaths.push([x, y, z])
          }
        }
      }
    }
    const outsideLocationsMap: Record<string, Location3D> = exploreOutside(obsidianLocationsMap, initialPaths)

    part2 = Object.values(obsidianLocationsMap).reduce(
      (acc, location) => acc + numberOfExposedSurfacesToOutside(location, outsideLocationsMap),
      0
    )

    if (params.ui?.show) printObsidian(dimension, outsideLocationsMap, obsidianLocationsMap)
  }
  return { part1, part2 }
}
