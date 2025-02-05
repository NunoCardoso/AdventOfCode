import { Params } from 'aoc.d'
import clc from 'cli-color'
import { World } from 'declarations'

type Location = [x: number, y: number, score: number, path?: Set<string>]
type Data = {
  lowestScore: number
  path: Set<string>
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let it: number = 0
  let start: Location
  const starts: Location[] = []
  let end: Location
  const world: World<string> = []

  const isSame = (p: Location, p2: Location): boolean => p[0] === p2[0] && p[1] === p2[1]

  const getHeight = (level: string): number => 'abcdefghijklmnopqrstuvwxyz'.indexOf(level)

  const getKey = (p: Location): string => '' + p[0] + ',' + p[1]

  const outOfBounds = (p: Location) => p[0] < 0 || p[1] < 0 || p[0] >= world.length || p[1] >= world[0].length
  const getNewLocations = (point: Location, visited: Set<string>): Location[] =>
    (
      [
        [point[0] - 1, point[1], point[2] + 1],
        [point[0] + 1, point[1], point[2] + 1],
        [point[0], point[1] - 1, point[2] + 1],
        [point[0], point[1] + 1, point[2] + 1]
      ] as Location[]
    ).filter((newLocation: Location) => {
      if (outOfBounds(newLocation)) return false
      if (getHeight(world[newLocation[0]][newLocation[1]]) - getHeight(world[point[0]][point[1]]) > 1) return false
      newLocation[3] = new Set(point[3])!.add(getKey(newLocation))
      return !visited.has(getKey(newLocation))
    })

  const doDijkstra = (opened: Location[], openedIndex: Set<string>, visited: Set<string>, data: Data) => {
    const point: Location = opened.splice(-1)[0]
    const pointKey = getKey(point)
    log.debug('=== Dijkstra ===', point, 'opened', opened.length, 'data', data)

    if (isSame(point, end)) {
      if (data.lowestScore > point[2]) {
        log.debug('got lowest', point)
        data.lowestScore = point[2]
        data.path = point[3]!
      }
      return
    }
    visited.add(pointKey)
    openedIndex.delete(pointKey)

    const newLocations: Location[] = getNewLocations(point, visited)
    if (newLocations.length !== 0) {
      newLocations.forEach((newLocation) => {
        const newLocationKey = getKey(newLocation)
        if (!openedIndex.has(newLocationKey)) {
          opened.push(newLocation)
          openedIndex.add(newLocationKey)
        } else {
          const index = opened.findIndex((p: Location) => isSame(p, newLocation))
          if (opened[index][2] > newLocation[2]) opened[index] = newLocation
        }
      })
      opened.sort((a, b) => b[2] - a[2])
    }
  }

  const printData = (world: World<string>, data: Data) => {
    world.forEach((row, i) => {
      log.info(row.map((cell, j) => (data.path.has(i + ',' + j) ? clc.red(world[i][j]) : world[i][j])).join(''))
    })
    log.info('')
  }

  const solveFor = (opened: Location[]): number => {
    const visited: Set<string> = new Set()
    const data: Data = { lowestScore: Number.POSITIVE_INFINITY, path: new Set() }
    const openedIndex: Set<string> = new Set()
    opened.forEach((point) => openedIndex.add(getKey(point)))
    let iterations = 0
    while (opened.length > 0) {
      doDijkstra(opened, openedIndex, visited, data)
      if (it % 100 === 0) {
        log.debug('it', iterations, 'opened length', opened.length)
        iterations++
      }
    }
    if (params.ui?.show && params.ui?.end) printData(world, data)
    return data.lowestScore
  }

  for await (const line of lineReader) {
    const row: string[] = []
    line.split('').forEach((char: string, i: number) => {
      if (char === 'S') {
        start = [it, i, 0, new Set<string>().add(it + ',' + i)]
        row.push('a')
      } else if (char === 'a') {
        starts.push([it, i, 0, new Set<string>().add(it + ',' + i)])
        row.push(char)
      } else if (char === 'E') {
        end = [it, i, 0]
        row.push('z')
      } else {
        row.push(char)
      }
    })
    world.push(row)
    it++
  }

  let part1: number = 0
  let part2: number = 0

  if (!params.skipPart1) {
    part1 = solveFor([start!])
  }

  if (!params.skipPart2) {
    part2 = solveFor(starts)
  }

  return { part1, part2 }
}
