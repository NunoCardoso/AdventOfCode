import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Point, World } from 'declarations'
import { waitForKey } from 'util/promise'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let worldPart1: World<string> = []
  let startPart1: Point = [0, 0]
  let worldPart2: World<string> = []
  let startPart2: Point = [0, 0]

  let rowIndex = 0
  let instructions: string[] = []
  for await (const line of lineReader) {
    const values: string[] = line?.split('')
    worldPart1[rowIndex] = []
    worldPart2[rowIndex] = []
    if (values.length > 0) {
      if (values[0] === '#') {
        values.forEach((val, colIndex) => {
          worldPart1[rowIndex].push(val)
          worldPart2[rowIndex].push(val === 'O' ? '[' : val)
          worldPart2[rowIndex].push(val === 'O' ? ']' : val)
          if (val === '@') {
            startPart1 = [rowIndex, colIndex]
            startPart2 = [rowIndex, colIndex * 2]
            worldPart1[rowIndex][colIndex] = '.'
            worldPart2[rowIndex][colIndex * 2] = '.'
            worldPart2[rowIndex][colIndex * 2 + 1] = '.'
          }
        })
        rowIndex++
      } else {
        instructions = instructions.concat(values)
      }
    }
  }

  const calculateScore = (world: World<string>): number =>
    world.reduce(
      (acc, row, rowIndex) =>
        acc +
        row.reduce((acc2, cell, colIndex) => acc2 + (['O', '['].includes(cell) ? 100 * rowIndex + colIndex : 0), 0),
      0
    )

  const printWorld = (world: World<string>, start: Point) => {
    for (var i = 0; i < world.length; i++) {
      let s: string = ''
      for (var j = 0; j < world[i].length; j++) {
        if (i === start[0] && j === start[1]) {
          s += clc.yellow('@')
          continue
        }
        let cell = world[i][j]
        if (cell === '#') s += clc.red(cell)
        if (['O', '[', ']'].includes(cell)) s += clc.cyan(cell)
        if (cell === '.') s += cell
      }
      log.info(s)
    }
  }

  const executePath = (world: World<string>, current: Point, instruction: string, _path: Point[] | null): Point => {
    if (!_path) return current
    let lastPlace: Point
    // I have to sort and reverse so I can do the moves from the end to the start
    sortPath(_path!, instruction)
      .reverse()
      .forEach((p) => {
        if (instruction === '^') {
          world[p[0] - 1][p[1]] = world[p[0]][p[1]]
          lastPlace = [p[0] - 1, p[1]]
        }
        if (instruction === 'v') {
          world[p[0] + 1][p[1]] = world[p[0]][p[1]]
          lastPlace = [p[0] + 1, p[1]]
        }
        if (instruction === '<') {
          world[p[0]][p[1] - 1] = world[p[0]][p[1]]
          lastPlace = [p[0], p[1] - 1]
        }
        if (instruction === '>') {
          world[p[0]][p[1] + 1] = world[p[0]][p[1]]
          lastPlace = [p[0], p[1] + 1]
        }
        world[p[0]][p[1]] = '.'
      })
    return lastPlace!
  }

  const checkIfRobotCanMove = (
    world: World<string>,
    current: Point,
    instruction: string,
    path: Point[]
  ): Point[] | null => {
    let targetedPoint: Point = [0, 0]
    if (instruction === '^') targetedPoint = [current[0] - 1, current[1]] as Point
    if (instruction === 'v') targetedPoint = [current[0] + 1, current[1]] as Point
    if (instruction === '<') targetedPoint = [current[0], current[1] - 1] as Point
    if (instruction === '>') targetedPoint = [current[0], current[1] + 1] as Point
    let targetWorld = world[targetedPoint[0]][targetedPoint[1]]
    // if we find a wall, return null to signal that no move is possible
    if (targetWorld === '#') return null
    // if we find a space, return path to signal that move is possible
    if (targetWorld === '.') return path.concat([current])
    // if we find a box, keep going to see if we find a wall or a space
    if (targetWorld === 'O') return checkIfRobotCanMove(world, targetedPoint, instruction, path.concat([current]))
    // we are in [ or ]
    let otherTarget: Point =
      targetWorld === '[' ? [targetedPoint[0], targetedPoint[1] + 1] : [targetedPoint[0], targetedPoint[1] - 1]
    if (['^', 'v'].includes(instruction)) {
      let leftPath = checkIfRobotCanMove(world, targetedPoint, instruction, path.concat([current]))
      let rightPath = checkIfRobotCanMove(world, otherTarget, instruction, path)
      if (leftPath === null || rightPath === null) return null
      return leftPath.concat(rightPath)
    }
    // we are in > or <, add 2 elements to path
    return checkIfRobotCanMove(world, otherTarget, instruction, path.concat([current, targetedPoint]))
  }

  const sortPath = (_path: Point[], instruction: string): Point[] => {
    let path = _path!.reduce(
      (acc, p) => (!!acc.find((_p: Point) => _p[0] === p[0] && _p[1] === p[1]) ? acc : [...acc, p]),
      [] as Point[]
    )
    if (instruction === '^') path = path.sort((a, b) => (b[0] - a[0] < 0 ? -1 : b[0] - a[0] > 0 ? 1 : b[1] - a[1]))
    if (instruction === 'v') path = path.sort((a, b) => (a[0] - b[0] < 0 ? -1 : a[0] - b[0] > 0 ? 1 : a[1] - b[1]))
    if (instruction === '<') path = path.sort((a, b) => (b[1] - a[1] < 0 ? -1 : b[1] - a[1] > 0 ? 1 : b[0] - a[0]))
    if (instruction === '>') path = path.sort((a, b) => (a[1] - b[1] < 0 ? -1 : a[1] - b[1] > 0 ? 1 : a[0] - b[0]))
    return path
  }

  const solveFor = async (world: World<string>, current: Point, instructions: string[]): Promise<number> => {
    while (instructions.length > 0) {
      let instruction = instructions.shift()!
      let path: Point[] | null = checkIfRobotCanMove(world, current, instruction, [])
      current = executePath(world, current, instruction, path)
      if (params.ui?.show) printWorld(world, current)
      if (params.ui?.keypress) await waitForKey()
    }
    return calculateScore(world)
  }

  if (!params.skipPart1) {
    part1 = await solveFor(worldPart1, startPart1, [...instructions])
  }
  if (!params.skipPart2) {
    part2 = await solveFor(worldPart2, startPart2, [...instructions])
  }

  return { part1, part2 }
}
