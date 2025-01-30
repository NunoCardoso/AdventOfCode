import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Dimension, Location, World } from 'declarations'
import { getKey } from 'util/location'

type Data = {
  path: Location[]
  numberOfInnerLocations: number
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

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

  const outOfBounds = (newLocation: Location) =>
    newLocation[0] < 0 ||
    newLocation[0] >= worldDimensions[0] ||
    newLocation[1] < 0 ||
    newLocation[1] >= worldDimensions[1]

  const isSame = (p: Location, p2: Location) => p[0] === p2[0] && p[1] === p2[1]

  const getPipe = (p: Location): string => world[p[0]][p[1]]

  const getNextLocations = (location: Location, visited: Set<string>) =>
    (
      [
        [location[0] - 1, location[1]],
        [location[0] + 1, location[1]],
        [location[0], location[1] - 1],
        [location[0], location[1] + 1]
      ] as Location[]
    ).filter((newLocation: Location) => {
      if (outOfBounds(newLocation)) return false
      const newKey = getKey(newLocation)
      if (visited.has(newKey)) return false
      const locationPipe = getPipe(location)
      const newLocationPipe = getPipe(newLocation)
      const isTop = (newLocationValue: string, location: Location, newLocation: Location): boolean =>
        ['S', '7', '|', 'F'].includes(newLocationValue) && newLocation[0] === location[0] - 1
      const isBottom = (newLocationValue: string, location: Location, newLocation: Location): boolean =>
        ['S', 'J', '|', 'L'].includes(newLocationValue) && newLocation[0] === location[0] + 1
      const isLeft = (newLocationValue: string, location: Location, newLocation: Location): boolean =>
        ['S', 'L', '-', 'F'].includes(newLocationValue) && newLocation[1] === location[1] - 1
      const isRight = (newLocationValue: string, location: Location, newLocation: Location): boolean =>
        ['S', 'J', '-', '7'].includes(newLocationValue) && newLocation[1] === location[1] + 1
      if (
        locationPipe === '|' &&
        (isTop(newLocationPipe, location, newLocation) || isBottom(newLocationPipe, location, newLocation))
      )
        return true
      if (
        locationPipe === '-' &&
        (isLeft(newLocationPipe, location, newLocation) || isRight(newLocationPipe, location, newLocation))
      )
        return true
      if (
        locationPipe === 'L' &&
        (isTop(newLocationPipe, location, newLocation) || isRight(newLocationPipe, location, newLocation))
      )
        return true
      if (
        locationPipe === 'J' &&
        (isTop(newLocationPipe, location, newLocation) || isLeft(newLocationPipe, location, newLocation))
      )
        return true
      if (
        locationPipe === '7' &&
        (isLeft(newLocationPipe, location, newLocation) || isBottom(newLocationPipe, location, newLocation))
      )
        return true
      if (
        locationPipe === 'F' &&
        (isRight(newLocationPipe, location, newLocation) || isBottom(newLocationPipe, location, newLocation))
      )
        return true
      if (
        locationPipe === 'S' &&
        ((['7', '|', 'F'].includes(newLocationPipe) && newLocation[0] === location[0] - 1) ||
          (['J', '|', 'L'].includes(newLocationPipe) && newLocation[0] === location[0] + 1) ||
          (['J', '-', '7'].includes(newLocationPipe) && newLocation[1] === location[1] + 1) ||
          (['L', '-', 'F'].includes(newLocationPipe) && newLocation[1] === location[1] - 1))
      )
        return true
      return false
    })

  const breathFirst = (queue: Location[], visited: Set<string>, data: Data) => {
    const location = queue.pop()!
    const key = getKey(location)
    visited.add(key)
    const nextLocations = getNextLocations(location, visited)
    if (nextLocations.length === 0) {
      // empty the queue
      queue.splice(0, queue.length)
      return
    }
    data.path.push(nextLocations[0])
    queue.push(nextLocations[0])
  }

  const guessPipeValue = (p: Location, pipeBefore: Location, pipeAfter: Location): string => {
    if (
      (isSame([p[0], p[1] - 1], pipeBefore) && isSame([p[0], p[1] + 1], pipeAfter)) ||
      (isSame([p[0], p[1] - 1], pipeAfter) && isSame([p[0], p[1] + 1], pipeBefore))
    )
      return '-'
    if (
      (isSame([p[0] - 1, p[1]], pipeBefore) && isSame([p[0] + 1, p[1]], pipeAfter)) ||
      (isSame([p[0] - 1, p[1]], pipeAfter) && isSame([p[0] + 1, p[1]], pipeBefore))
    )
      return '|'
    if (
      (isSame([p[0] + 1, p[1]], pipeBefore) && isSame([p[0], p[1] - 1], pipeAfter)) ||
      (isSame([p[0] + 1, p[1]], pipeAfter) && isSame([p[0], p[1] - 1], pipeBefore))
    )
      return '7'
    if (
      (isSame([p[0] + 1, p[1]], pipeBefore) && isSame([p[0], p[1] + 1], pipeAfter)) ||
      (isSame([p[0] + 1, p[1]], pipeAfter) && isSame([p[0], p[1] + 1], pipeBefore))
    )
      return 'F'
    if (
      (isSame([p[0] - 1, p[1]], pipeBefore) && isSame([p[0], p[1] - 1], pipeAfter)) ||
      (isSame([p[0] - 1, p[1]], pipeAfter) && isSame([p[0], p[1] - 1], pipeBefore))
    )
      return 'J'
    if (
      (isSame([p[0] - 1, p[1]], pipeBefore) && isSame([p[0], p[1] + 1], pipeAfter)) ||
      (isSame([p[0] - 1, p[1]], pipeAfter) && isSame([p[0], p[1] + 1], pipeBefore))
    )
      return 'L'
    return ''
  }

  // while I am changing the world for print, I am also counting inner spaces
  const labelPipesAndSpaces = (world: World<string>, data: Data) =>
    world.map((row, rowIndex) => {
      const pipeLocationKeysInRow: Set<string> = new Set(
        data.path.filter((location: Location) => location[0] === rowIndex).map(getKey)
      )
      let inner: boolean = false
      return row.map((cell, colIndex) => {
        let value: string
        if (pipeLocationKeysInRow.has(getKey([rowIndex, colIndex]))) {
          value = 'P'
          if (getPipe([rowIndex, colIndex]) === 'S') {
            // S Location is always the data.path[0], use the Location in front and back ([1] and [length -1]) to guess value
            cell = guessPipeValue([rowIndex, colIndex], data.path[data.path.length - 1], data.path[1])
          }
          if (['|', 'L', 'J'].includes(cell)) inner = !inner
        } else {
          value = inner ? 'I' : 'O'
          if (inner) data.numberOfInnerLocations++
        }
        return value
      })
    })

  const world: World<string> = []
  let start: Location = [0, 0]
  let rowIndex: number = 0

  for await (const line of lineReader) {
    world.push(line.split(''))
    const index = line.indexOf('S')
    if (index >= 0) start = [rowIndex, index]
    rowIndex++
  }

  const worldDimensions: Dimension = [world.length, world[0].length]
  log.debug('world', worldDimensions)

  const visited: Set<string> = new Set<string>()
  visited.add(getKey(start!))
  const data: Data = { path: [start!], numberOfInnerLocations: 0 }
  const queue = [start!]
  while (queue.length > 0) breathFirst(queue, visited, data)
  const situationWorld = labelPipesAndSpaces(world, data)

  if (params.ui.show) {
    printGrid(world, situationWorld)
  }

  part1 = data.path.length / 2
  part2 = data.numberOfInnerLocations

  return { part1, part2 }
}
