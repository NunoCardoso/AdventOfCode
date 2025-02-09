import { Params } from 'aoc.d'
import { World } from 'declarations'

type IterationType = (world: World<string>) => [World<string>, boolean]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const countPeopleAround = (world: World<string>, row: number, col: number) => {
    let count = 0
    if (row !== 0) {
      count += world[row - 1][col] === '#' ? 1 : 0
      if (col !== 0) count += world[row - 1][col - 1] === '#' ? 1 : 0
      if (col !== world[0].length - 1) count += world[row - 1][col + 1] === '#' ? 1 : 0
    }
    if (col !== 0) count += world[row][col - 1] === '#' ? 1 : 0
    if (col !== world[0].length - 1) count += world[row][col + 1] === '#' ? 1 : 0
    if (row !== world.length - 1) {
      count += world[row + 1][col] === '#' ? 1 : 0
      if (col !== 0) count += world[row + 1][col - 1] === '#' ? 1 : 0
      if (col !== world[0].length - 1) count += world[row + 1][col + 1] === '#' ? 1 : 0
    }
    return count
  }

  const goInDirection = (world: World<string>, row: number, col: number, pair: number[]): number => {
    let _row = row + pair[0],
      _col = col + pair[1]
    let found: boolean = false
    while (_row >= 0 && _col >= 0 && _row < world.length && _col < world[0].length) {
      if (world[_row][_col] === '#') {
        found = true
        break
      }
      if (world[_row][_col] === 'L') break
      _row += pair[0]
      _col += pair[1]
    }
    return found ? 1 : 0
  }

  const countPeopleFarAway = (world: World<string>, row: number, col: number) =>
    [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ].reduce((acc, pair: number[]) => acc + goInDirection(world, row, col, pair), 0)

  const doIterationPart2 = (world: World<string>): [World<string>, boolean] => {
    let changed: boolean = false
    let _world: World<string> = world.map((row, rowIndex) =>
      row.map((col, colIndex) => {
        if (col === 'L' && countPeopleFarAway(world, rowIndex, colIndex) === 0) {
          changed = true
          return '#'
        } else if (col === '#' && countPeopleFarAway(world, rowIndex, colIndex) >= 5) {
          changed = true
          return 'L'
        } else return col
      })
    )
    return [_world, changed]
  }

  const doIterationPart1 = (world: World<string>): [World<string>, boolean] => {
    let changed: boolean = false
    let _world: World<string> = world.map((row, rowIndex) =>
      row.map((col, colIndex) => {
        if (col === 'L' && countPeopleAround(world, rowIndex, colIndex) === 0) {
          changed = true
          return '#'
        } else if (col === '#' && countPeopleAround(world, rowIndex, colIndex) >= 4) {
          changed = true
          return 'L'
        } else return col
      })
    )
    return [_world, changed]
  }

  const printWorld = (world: World<string>) => {
    world.forEach((row) => log.info(row.join('')))
    log.info('\n')
  }

  const countPeople = (world: World<string>) =>
    world.reduce((acc, row) => acc + row.filter((cell) => cell == '#').length, 0)

  const solveFor = (world: World<string>, iterationType: IterationType): number => {
    while (true) {
      const [_world, changed] = iterationType(world)
      if (!changed) break
      world = _world
      if (params?.ui?.show) printWorld(world)
    }
    return countPeople(world)
  }

  // first move is always L to #
  let world: World<string> = []
  for await (const line of lineReader) world.push(line.replaceAll('L', '#').split(''))

  if (!params.skipPart1) part1 = solveFor(world, doIterationPart1)
  if (!params.skipPart2) part2 = solveFor(world, doIterationPart2)

  return { part1, part2 }
}
