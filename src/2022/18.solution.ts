import { Params } from 'aoc.d'
import _ from 'lodash'
import clc from 'cli-color'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Point = [number, number, number]

  let minX: number | undefined,
    maxX: number | undefined,
    minY: number | undefined,
    maxY: number | undefined,
    minZ: number | undefined,
    maxZ: number | undefined

  const isObsidian = (needle: Point, haystack: Record<string, Point>): boolean =>
    Object.prototype.hasOwnProperty.call(haystack, '' + needle[0] + ',' + needle[1] + ',' + needle[2])

  const isOutside = (needle: Point, haystack: Record<string, Point>) => {
    if (outsideBoundaries(needle)) {
      return true
    }
    return Object.prototype.hasOwnProperty.call(haystack, '' + needle[0] + ',' + needle[1] + ',' + needle[2])
  }

  const numberOfExposedSurfaces = (point: Point, obsidianPointKeys: Record<string, Point>): number => {
    return (
      6 -
      (isObsidian([point[0] + 1, point[1], point[2]], obsidianPointKeys) ? 1 : 0) -
      (isObsidian([point[0] - 1, point[1], point[2]], obsidianPointKeys) ? 1 : 0) -
      (isObsidian([point[0], point[1] + 1, point[2]], obsidianPointKeys) ? 1 : 0) -
      (isObsidian([point[0], point[1] - 1, point[2]], obsidianPointKeys) ? 1 : 0) -
      (isObsidian([point[0], point[1], point[2] + 1], obsidianPointKeys) ? 1 : 0) -
      (isObsidian([point[0], point[1], point[2] - 1], obsidianPointKeys) ? 1 : 0)
    )
  }

  const numberOfExposedSurfaces2 = (point: Point, outsidePointKeys: Record<string, Point>): number => {
    return (
      0 +
      (isOutside([point[0] + 1, point[1], point[2]], outsidePointKeys) ? 1 : 0) +
      (isOutside([point[0] - 1, point[1], point[2]], outsidePointKeys) ? 1 : 0) +
      (isOutside([point[0], point[1] + 1, point[2]], outsidePointKeys) ? 1 : 0) +
      (isOutside([point[0], point[1] - 1, point[2]], outsidePointKeys) ? 1 : 0) +
      (isOutside([point[0], point[1], point[2] + 1], outsidePointKeys) ? 1 : 0) +
      (isOutside([point[0], point[1], point[2] - 1], outsidePointKeys) ? 1 : 0)
    )
  }

  const outsideBoundaries = (c: Point) => {
    return c[0] < minX! || c[0] > maxX! || c[1] < minY! || c[1] > maxY! || c[2] < minZ! || c[2] > maxZ!
  }

  const getCandidates = ({
    obsidianPointKeys,
    opened,
    visited,
    current
  }: {
    obsidianPointKeys: Record<string, Point>
    opened: Array<Point>
    visited: Record<string, Point>
    current: Point
  }) => {
    let candidates: Array<Point> = [
      [current[0] + 1, current[1], current[2]],
      [current[0] - 1, current[1], current[2]],
      [current[0], current[1] + 1, current[2]],
      [current[0], current[1] - 1, current[2]],
      [current[0], current[1], current[2] + 1],
      [current[0], current[1], current[2] - 1]
    ]

    candidates = _.reject(candidates, (c: Point) => {
      // reject off bounds
      if (outsideBoundaries(c)) {
        // console.log('rejected', c, 'out of bounds')
        return true
      }
      // reject already visited
      if (isVisited(visited, c)) {
        // console.log('rejected', c, 'already visited')
        return true
      }
      // reject already opened
      if (_.find(opened, (o: Point) => o[0] === c[0] && o[1] === c[1] && o[2] === c[2]) !== undefined) {
        // console.log('rejected', c, 'already opened')
        return true
      }
      // reject Point that are obsidian
      if (isObsidian(c, obsidianPointKeys)) {
        // console.log('rejected', c, 'is in obsidian')
        return true
      }
      return false
    })
    if (candidates.length > 0) {
      opened.push(...candidates)
    }
  }

  const isVisited = (visited: Record<string, Point>, c: Point) =>
    Object.prototype.hasOwnProperty.call(visited, '' + c[0] + ',' + c[1] + ',' + c[2])

  const setVisited = (visited: Record<string, Point>, c: Point): void => {
    visited['' + c[0] + ',' + c[1] + ',' + c[2]] = c
  }

  const exploreOutside = (
    obsidianPointKeys: Record<string, Point>,
    initialPaths: Array<Point>
  ): Record<string, Point> => {
    log.debug('started explore outside')
    const visited: Record<string, Point> = {}
    const opened: Array<Point> = initialPaths
    while (opened.length > 0) {
      const current: Point = opened.splice(-1)[0]
      if (!isVisited(visited, current)) {
        // console.log('Trying opened', current)
        setVisited(visited, current)
        getCandidates({ obsidianPointKeys, opened, visited, current })
      }
    }
    log.debug('ended explore outside, found', Object.keys(visited).length, 'points outside')
    return visited
  }

  const obsidianPointKeys: Record<string, Point> = {}

  for await (const line of lineReader) {
    const matches = line.match(/^(\d+),(\d+),(\d+)$/)
    const x = parseInt(matches![1])
    const y = parseInt(matches![2])
    const z = parseInt(matches![3])
    if (minX === undefined || x < minX) minX = x
    if (maxX === undefined || x > maxX) maxX = x
    if (minY === undefined || y < minY) minY = y
    if (maxY === undefined || y > maxY) maxY = y
    if (minZ === undefined || z < minZ) minZ = z
    if (maxZ === undefined || z > maxZ) maxZ = z
    obsidianPointKeys[line] = [x, y, z]
  }

  let part1: number = 0
  let part2: number = 0
  const maxSpace = (maxX! - minX! + 1) * (maxY! - minY! + 1) * (maxZ! - minZ! + 1)

  if (params.part1?.skip !== true) {
    log.debug('obsidian points total', obsidianPointKeys.length)
    log.debug('dimensions', maxX! - minX! + 1, maxY! - minY! + 1, maxZ! - minZ! + 1, 'total ', maxSpace)
    Object.values(obsidianPointKeys).forEach((point) => {
      part1 += numberOfExposedSurfaces(point, obsidianPointKeys)
    })
  }

  if (params.part2?.skip !== true) {
    // get all the connected points that are outside obsidian
    // then we know which points are inside obsidian
    const initialPaths: Array<[number, number, number]> = []
    for (let x = 0; x <= maxX!; x++) {
      for (let y = 0; y <= maxY!; y++) {
        for (let z = 0; z <= maxZ!; z++) {
          if (x === 0 || x === maxX! || y === 0 || y === maxY! || z === 0 || z === maxZ!) {
            if (!Object.prototype.hasOwnProperty.call(obsidianPointKeys, '' + x + ',' + y + ',' + z)) {
              initialPaths.push([x, y, z])
            }
          }
        }
      }
    }
    const outsidePointKeys: Record<string, Point> = exploreOutside(obsidianPointKeys, initialPaths)
    const insidePoints =
      maxSpace - Object.keys(obsidianPointKeys).length - Object.keys(outsidePointKeys).length
    log.debug(
      'max space',
      maxSpace,
      'obsidians',
      Object.keys(obsidianPointKeys).length,
      'outside',
      Object.keys(outsidePointKeys).length,
      'inside',
      insidePoints
    )
    Object.values(obsidianPointKeys).forEach((point) => {
      part2 += numberOfExposedSurfaces2(point, outsidePointKeys)
    })

    if (params.ui?.show) {
      for (let z = minZ!; z <= maxZ!; z++) {
        const lines = []
        for (let x = minX!; x <= maxX!; x++) {
          let line = ''
          for (let y = minY!; y <= maxY!; y++) {
            if (isOutside([x, y, z], outsidePointKeys)) {
              line += clc.blue('O')
            } else if (isObsidian([x, y, z], obsidianPointKeys)) {
              line += clc.red('X')
            } else {
              line += '.'
            }
          }
          lines.push(line)
        }
        console.log('z=', z)
        lines.forEach((l) => console.log(l))
      }
    }
  }
  return { part1, part2 }
}
