import { Params } from '../../aoc.d'
import _ from 'lodash'
import clc from 'cli-color'

export default async (lineReader: any, params: Params) => {
  type Point = [number, number]
  type Grid = Array<Array<string>>
  type Dimensions = Record<string, number>
  type World = {
    grid: Grid
    dimensions: Dimensions
  }

  const fillOutData = (wallPoints: Array<Point>, d: Dimensions): World => {
    const grid: Grid = new Array(d.maxY + 1)
    for (let y = 0; y <= d.maxY; y++) {
      grid[y] = new Array(d.maxX + 1).fill('.')
    }
    grid[0][500] = '+'
    wallPoints.forEach((dp: Point) => (grid[dp[1]][dp[0]] = '#'))
    return {
      grid,
      dimensions: d
    }
  }

  const render = (world: World) => {
    const lines = []
    for (let y = world.dimensions.minY; y <= world.dimensions.maxY; y++) {
      let line: string = ''
      for (let x = world.dimensions.minX; x <= world.dimensions.maxX; x++) {
        line +=
          world.grid[y][x] === '#'
            ? clc.red('#')
            : world.grid[y][x] === 'o'
            ? clc.yellow('o')
            : world.grid[y][x] === '+'
            ? clc.green('+')
            : world.grid[y][x]
      }
      lines.push(line)
    }
    lines.forEach((b, i) => console.log(i.toString().padStart(3, '0'), b))
  }

  const dropSand = (world: any, origin: Point): { newPos: Point; fellDown: boolean; stuck: boolean } => {
    let newX = origin[0]
    let newY = origin[1] + 1
    if (newY > world.dimensions.maxY) {
      return { newPos: [newX, newY], fellDown: true, stuck: false }
    }
    let below = world.grid[newY][newX]
    if (below === '.') {
      // console.log('dropping down', newX, newY, below)
      return dropSand(world, [newX, newY])
    }
    if (below === '#' || below === 'o') {
      const newX = origin[0] - 1
      const newY = origin[1] + 1
      const below = world.grid[newY][newX]
      if (below === '.') {
        // console.log('dropping left', newX, newY, below)
        return dropSand(world, [newX, newY])
      }
    }
    newX = origin[0] + 1
    newY = origin[1] + 1
    below = world.grid[newY][newX]
    if (below === '.') {
      // console.log('dropping right', newX, newY, below)
      return dropSand(world, [newX, newY])
    }
    if (origin[0] === 500 && origin[1] === 0) {
      // console.log('Stuck', origin, below)
      return { newPos: [newX, newY], fellDown: false, stuck: true }
    }

    // console.log('staying at', pos, below)
    return { newPos: origin, fellDown: false, stuck: false }
  }

  const startSand = (world: World, origin: Point) => {
    let _fellDown = false
    let _stuck = false
    let sands = 0
    while (!_fellDown && !_stuck) {
      const { newPos, fellDown, stuck } = dropSand(world, origin)
      _stuck = stuck
      _fellDown = fellDown
      if (!fellDown && !stuck) {
        world.grid[newPos[1]][newPos[0]] = 'o'
        sands++
      }
      if (params.ui?.show && params.ui?.during) {
        render(world)
      }
    }
    return sands
  }

  const wallPoints: Array<Point> = []

  const d: Dimensions = {
    minX: 500,
    minY: 0,
    maxX: 500,
    maxY: 0
  }

  for await (const line of lineReader) {
    const vals = line.split(' -> ')
    for (let i = 0; i < vals.length - 1; i++) {
      const from: Point = vals[i].split(',').map((x: string) => parseInt(x)) as Point
      const to: Point = vals[i + 1].split(',').map((x: string) => parseInt(x)) as Point
      const jDir: number = to[0] - from[0] < 0 ? -1 : 1
      const kDir: number = to[1] - from[1] < 0 ? -1 : 1
      for (let j = from[0]; jDir === -1 ? j >= to[0] : j <= to[0]; j = j + jDir) {
        for (let k = from[1]; kDir === -1 ? k >= to[1] : k <= to[1]; k = k + kDir) {
          if (j < d.minX) {
            d.minX = j
          }
          if (j > d.maxX) {
            d.maxX = j
          }
          if (k < d.minY) {
            d.minY = k
          }
          if (k > d.maxY) {
            d.maxY = k
          }
          wallPoints.push([j, k])
        }
      }
    }
  }

  let part1: number = 0
  let part2: number = 0
  if (params.part1?.skip !== true) {
    const world1: World = fillOutData(wallPoints, d)
    part1 = startSand(world1, [500, 0])
    if (params.ui?.show && params.ui?.end) {
      render(world1)
    }
  }

  if (params.part2?.skip !== true) {
    // part2 - different world setup
    const d2: Dimensions = _.cloneDeep(d)
    const howHigh = d2.maxY - d2.minY
    const floorStart = 500 - howHigh - 2
    const floorEnd = 500 + howHigh + 2

    if (floorStart < d2.minX) {
      d2.minX = floorStart
    }
    if (floorEnd > d2.maxX) {
      d2.maxX = floorEnd
    }
    d2.maxY = d2.maxY + 2

    for (let i = floorStart; i <= floorEnd; i++) {
      wallPoints.push([i, howHigh + 2])
    }

    const world2: World = fillOutData(wallPoints, d2)
    part2 = startSand(world2, [500, 0]) + 1
    if (params.ui?.show && params.ui?.end) {
      render(world2)
    }
  }

  return {
    part1,
    part2
  }
}
