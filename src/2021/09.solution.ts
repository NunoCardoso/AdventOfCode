import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Dimension, World } from 'declarations'
import _ from 'lodash'

type Coord = {
  point: {
    x: number
    y: number
  }
  height: number
  basin?: any
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const world: World = []
  let worldDimension: Dimension = [0, 0]

  for await (const line of lineReader) {
    world.push(line.split('').map(Number))
  }
  worldDimension = [world.length, world[0].length]

  log.info('world of ', worldDimension)

  const isCoordSeen = (coords: Array<Coord>, c: Coord) =>
    _.findIndex(coords, (_c: Coord) => _c.point.x === c.point.x && _c.point.y === c.point.y) >= 0

  const printGrid = (world: World, holes: Array<Coord>, basins: Array<Coord>) => {
    world.forEach((row, i) => {
      let line = ''
      row.forEach((cell, j) => {
        const point = { point: { x: i, y: j }, height: world[i][j] }
        if (isCoordSeen(holes, point)) {
          line += clc.red(point.height)
        } else {
          if (isCoordSeen(basins, point)) {
            line += clc.blue(point.height)
          } else {
            line += point.height
          }
        }
      })
      console.log(line)
    })
  }

  const getAdjacentCoords = (coord: Coord, excluding: Array<Coord> = []): Array<Coord> => {
    const coords: Array<Coord> = []
    let newCoord: Coord
    if (coord.point.y > 0) {
      newCoord = {
        point: { x: coord.point.x, y: coord.point.y - 1 },
        height: world[coord.point.x][coord.point.y - 1]
      }
      if (!isCoordSeen(excluding, newCoord)) {
        coords.push(newCoord)
      }
    }
    if (coord.point.y < worldDimension[1] - 1) {
      newCoord = {
        point: { x: coord.point.x, y: coord.point.y + 1 },
        height: world[coord.point.x][coord.point.y + 1]
      }
      if (!isCoordSeen(excluding, newCoord)) {
        coords.push(newCoord)
      }
    }
    if (coord.point.x > 0) {
      newCoord = {
        point: { x: coord.point.x - 1, y: coord.point.y },
        height: world[coord.point.x - 1][coord.point.y]
      }
      if (!isCoordSeen(excluding, newCoord)) {
        coords.push(newCoord)
      }
    }
    if (coord.point.x < worldDimension[0] - 1) {
      newCoord = {
        point: { x: coord.point.x + 1, y: coord.point.y },
        height: world[coord.point.x + 1][coord.point.y]
      }
      if (!isCoordSeen(excluding, newCoord)) {
        coords.push(newCoord)
      }
    }
    return coords
  }

  const getCandidateCoords = (coords: Array<Coord>): Array<Coord> => {
    return coords.filter((c: Coord) => c.height !== 9)
  }

  const isLowerPoint = (c: Coord, adjacentCoords: Array<Coord>) => {
    return _.every(adjacentCoords, (_c) => _c.height > c.height)
  }

  const searchAlgorithm = async (visited: Array<Coord>, opened: Array<Coord>) => {
    const coord: Coord = opened.splice(-1)[0]

    const neighborCoords: Array<Coord> = getAdjacentCoords(coord, visited)

    if (!isCoordSeen(visited, coord)) {
      visited.push(coord)
    }

    const candidateCoords: Array<Coord> = getCandidateCoords(neighborCoords)
    candidateCoords.forEach((c) => {
      if (!isCoordSeen(opened, c)) {
        opened.push(c)
      }
    })
  }

  const holes: Array<Coord> = []
  const basins: Array<Coord> = []

  for (let row = 0; row < world.length; row++) {
    for (let column = 0; column < world[row].length; column++) {
      const current: Coord = { point: { x: row, y: column }, height: world[row][column] }
      const adjacentCoords = getAdjacentCoords(current)
      if (isLowerPoint(current, adjacentCoords)) {
        holes.push(current)
      }
    }
  }

  for (let i = 0; i < holes.length; i++) {
    const hole = _.cloneDeep(holes[i])

    const visited: Array<Coord> = []
    const opened: Array<Coord> = [hole]

    while (!_.isEmpty(opened)) {
      await searchAlgorithm(visited, opened)
    }
    holes[i].basin = visited.length
    basins.push(...visited)
    if (params.ui?.show && params.ui?.during) {
      printGrid(world, holes, basins)
    }
  }

  const part1 = holes.map((hole) => world[hole.point.x][hole.point.y]).reduce((x, y) => x + y + 1, 0)

  const part2 = holes
    .sort((a, b) => (a.basin < b.basin ? 1 : -1))
    .slice(0, 3)
    .map((hole) => hole.basin!)
    .reduce((x, y) => x * y, 1)

  if (params.ui?.show && params.ui?.end) {
    printGrid(world, holes, basins)
  }

  return {
    part1,
    part2
  }
}
