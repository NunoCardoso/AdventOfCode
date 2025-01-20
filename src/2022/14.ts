import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Location, World } from 'declarations'

type Dimensions = Record<string, number>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const rocks: Location[] = []

  const fillOutData = (rocks: Location[], d: Dimensions): [World<string>, Dimensions] => {
    const world: World<string> = new Array(d.maxY + 1)
    for (let y = 0; y <= d.maxY; y++) world[y] = new Array(d.maxX + 1).fill('.')
    // grid works in rows/cols, start is in x/y, so we invert
    rocks.forEach((rock: Location) => (world[rock[1]][rock[0]] = '#'))
    world[params.start[1]][params.start[0]] = '+'
    return [world, d]
  }

  const render = (world: World<string>, dimensions: Dimensions) => {
    const lines = []
    for (let y = dimensions.minY; y <= dimensions.maxY; y++) {
      let line: string = ''
      for (let x = dimensions.minX; x <= dimensions.maxX; x++)
        line +=
          world[y][x] === '#'
            ? clc.red('#')
            : world[y][x] === 'o'
              ? clc.yellow('o')
              : world[y][x] === '+'
                ? clc.green('+')
                : world[y][x]

      lines.push(line)
    }
    lines.forEach((b, i) => log.info(i.toString().padStart(3, '0'), b))
  }

  const dropSand = (world: World<string>, dimensions: Dimensions, location: Location): Location | null => {
    let newLocation: Location = [location[0], location[1] + 1]
    if (newLocation[1] > dimensions.maxY) return null
    let below = world[newLocation[1]][newLocation[0]]
    if (below === '.') return dropSand(world, dimensions, newLocation)
    if (below === '#' || below === 'o') {
      // swerve to the left
      newLocation = [location[0] - 1, location[1] + 1]
      const below = world[newLocation[1]][newLocation[0]]
      if (below === '.') return dropSand(world, dimensions, newLocation)
    }
    // swerve to the right
    newLocation = [location[0] + 1, location[1] + 1]
    below = world[newLocation[1]][newLocation[0]]
    if (below === '.') return dropSand(world, dimensions, newLocation)
    // if I am here after all dropping attempts, then I am stuck
    if (location[0] === params.start[0] && location[1] === params.start[1]) return null
    return location
  }

  const startSand = (world: World<string>, dimensions: Dimensions, origin: Location) => {
    let sands = 0
    let location: Location | null
    while (true) {
      location = dropSand(world, dimensions, origin)
      if (!location) break
      else {
        world[location[1]][location[0]] = 'o'
        sands++
      }
      if (params.ui?.show && params.ui?.during) render(world, dimensions)
    }
    return sands
  }

  const initialDimensions: Dimensions = {
    minX: params.start[0],
    minY: params.start[1],
    maxX: params.start[0],
    maxY: params.start[1]
  }

  for await (const line of lineReader) {
    const values = line.split(' -> ')
    for (let i = 0; i < values.length - 1; i++) {
      const from: Location = values[i].split(',').map(Number) as Location
      const to: Location = values[i + 1].split(',').map(Number) as Location
      const rowDirection: number = to[0] - from[0] < 0 ? -1 : 1
      const colDir: number = to[1] - from[1] < 0 ? -1 : 1
      for (let row = from[0]; rowDirection === -1 ? row >= to[0] : row <= to[0]; row += rowDirection) {
        for (let col = from[1]; colDir === -1 ? col >= to[1] : col <= to[1]; col += colDir) {
          if (row < initialDimensions.minX) initialDimensions.minX = row
          if (row > initialDimensions.maxX) initialDimensions.maxX = row
          if (col < initialDimensions.minY) initialDimensions.minY = col
          if (col > initialDimensions.maxY) initialDimensions.maxY = col
          rocks.push([row, col])
        }
      }
    }
  }

  if (!params.skipPart1) {
    const [world, dimensions] = fillOutData(rocks, initialDimensions)
    part1 = startSand(world, dimensions, params.start)
    if (params.ui?.show && params.ui?.end) render(world, dimensions)
  }

  if (!params.skipPart2) {
    const howHigh = initialDimensions.maxY - initialDimensions.minY
    const floorStart = params.start[0] - howHigh - 2
    const floorEnd = params.start[0] + howHigh + 2
    if (floorStart < initialDimensions.minX) initialDimensions.minX = floorStart
    if (floorEnd > initialDimensions.maxX) initialDimensions.maxX = floorEnd
    initialDimensions.maxY += 2
    for (let i = floorStart; i <= floorEnd; i++) rocks.push([i, howHigh + 2])

    const [world, dimensions] = fillOutData(rocks, initialDimensions)
    part2 = startSand(world, dimensions, params.start) + 1 // the one that overflows
    if (params.ui?.show && params.ui?.end) render(world, dimensions)
  }

  return { part1, part2 }
}
