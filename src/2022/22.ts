import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Direction, Location, LocationPlus, World } from 'declarations'
import { range } from 'util/range'

type Instruction = number | string
type Step = LocationPlus<Direction>
type Path = Step[]
type CubeLocation = [faceNumber: number, side: string, index: number]
type WhereTo = [faceNumber: number, faceEdge: Direction, newDirection: Direction, invertIndex: boolean]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getColumn = (matrix: World<string>, column: number): string[] => matrix.map((row) => row[column])

  const getDirection = (directions: Direction[], direction: Direction, instruction: Instruction): Direction => {
    let newIndex: number = 0
    if (instruction === 'R') newIndex = (directions.indexOf(direction) + 1 + directions.length) % directions.length
    if (instruction === 'L') newIndex = (directions.indexOf(direction) - 1 + directions.length) % directions.length
    return directions[newIndex]
  }

  // returns array of cube locations as a location can be expressed both as 2 directions in corners
  const getCubeLocation = (step: Step): CubeLocation[] => {
    const cubeLocations: CubeLocation[] = []
    let cubeSide = params.cubeSize

    if (params.isTest) {
      // step[0] is row, going down
      if (step[0] === 0) cubeLocations.push([1, '^', step[1] % cubeSide])
      if (step[0] === cubeSide - 1) cubeLocations.push([1, 'v', step[1] % cubeSide])
      if (step[0] === cubeSide) {
        if (step[1] < cubeSide) cubeLocations.push([2, '^', step[1] % cubeSide])
        else if (step[1] < cubeSide * 2) cubeLocations.push([3, '^', step[1] % cubeSide])
        else cubeLocations.push([4, '^', step[1] % cubeSide])
      }
      if (step[0] === cubeSide * 2 - 1) {
        if (step[1] < cubeSide) cubeLocations.push([2, 'v', step[1] % cubeSide])
        else if (step[1] < cubeSide * 2) cubeLocations.push([3, 'v', step[1] % cubeSide])
        else cubeLocations.push([4, 'v', step[1] % cubeSide])
      }
      if (step[0] === cubeSide * 2) {
        if (step[1] < cubeSide * 3) cubeLocations.push([5, '^', step[1] % cubeSide])
        else cubeLocations.push([6, '^', step[1] % cubeSide])
      }
      if (step[0] === cubeSide * 3 - 1) {
        if (step[1] < cubeSide * 3) cubeLocations.push([5, 'v', step[1] % cubeSide])
        else cubeLocations.push([6, 'v', step[1] % cubeSide])
      }
      if (step[1] === 0) cubeLocations.push([2, '<', step[0] % cubeSide])
      if (step[1] === cubeSide - 1) cubeLocations.push([2, '>', step[0] % cubeSide])
      if (step[1] === cubeSide) cubeLocations.push([3, '<', step[0] % cubeSide])
      if (step[1] === cubeSide * 2 - 1) cubeLocations.push([3, '>', step[0] % cubeSide])
      if (step[1] === cubeSide * 2) {
        if (step[0] < cubeSide) cubeLocations.push([1, '<', step[0] % cubeSide])
        else if (step[0] < cubeSide * 2) cubeLocations.push([4, '<', step[0] % cubeSide])
        else cubeLocations.push([5, '<', step[0] % cubeSide])
      }
      if (step[1] === cubeSide * 3 - 1) {
        if (step[0] < cubeSide) cubeLocations.push([1, '>', step[0] % cubeSide])
        else if (step[0] < cubeSide * 2) cubeLocations.push([4, '>', step[0] % cubeSide])
        else cubeLocations.push([5, '>', step[0] % cubeSide])
      }
      if (step[1] === cubeSide * 3) cubeLocations.push([6, '<', step[0] % cubeSide])
      if (step[1] === cubeSide * 4 - 1) cubeLocations.push([6, '>', step[0] % cubeSide])
    } else {
      if (step[0] === 0) {
        if (step[1] < cubeSide * 2) cubeLocations.push([2, '^', step[1] % cubeSide])
        else cubeLocations.push([1, '^', step[1] % cubeSide])
      }
      if (step[0] === cubeSide - 1) {
        if (step[1] < cubeSide * 2) cubeLocations.push([2, 'v', step[1] % cubeSide])
        else cubeLocations.push([1, 'v', step[1] % cubeSide])
      }
      if (step[0] === cubeSide) cubeLocations.push([3, '^', step[1] % cubeSide])
      if (step[0] === 2 * cubeSide - 1) cubeLocations.push([3, 'v', step[1] % cubeSide])
      if (step[0] === 2 * cubeSide) {
        if (step[1] < cubeSide) cubeLocations.push([5, '^', step[1] % cubeSide])
        else cubeLocations.push([4, 'v', step[1] % cubeSide])
      }
      if (step[0] === 3 * cubeSide - 1) {
        if (step[1] < cubeSide) cubeLocations.push([5, 'v', step[1] % cubeSide])
        else cubeLocations.push([4, 'v', step[1] % cubeSide])
      }
      if (step[0] === 3 * cubeSide) cubeLocations.push([6, '^', step[1] % cubeSide])
      if (step[0] === 4 * cubeSide - 1) cubeLocations.push([6, 'v', step[1] % cubeSide])
      if (step[1] === 0) {
        if (step[0] < 3 * cubeSide) cubeLocations.push([5, '<', step[0] % cubeSide])
        else cubeLocations.push([6, '<', step[0] % cubeSide])
      }
      if (step[1] === cubeSide - 1) {
        if (step[0] < 3 * cubeSide) cubeLocations.push([5, '>', step[0] % cubeSide])
        else cubeLocations.push([6, '>', step[0] % cubeSide])
      }
      if (step[1] === cubeSide) {
        if (step[0] < cubeSide) cubeLocations.push([2, '<', step[0] % cubeSide])
        else if (step[0] < 2 * cubeSide) cubeLocations.push([3, '<', step[0] % cubeSide])
        else cubeLocations.push([4, '<', step[0] % cubeSide])
      }
      if (step[1] === 2 * cubeSide - 1) {
        if (step[0] < cubeSide) cubeLocations.push([2, '>', step[0] % cubeSide])
        else if (step[0] < 2 * cubeSide) cubeLocations.push([3, '>', step[0] % cubeSide])
        else cubeLocations.push([4, '>', step[0] % cubeSide])
      }
      if (step[1] === 2 * cubeSide) cubeLocations.push([1, '<', step[0] % cubeSide])
      if (step[1] === 3 * cubeSide - 1) cubeLocations.push([1, '>', step[0] % cubeSide])
    }
    return cubeLocations
  }

  const calculateNewPosition = (step: Step): Step => {
    const cubeLocations = getCubeLocation(step)
    // get the direction and face after a jump
    const [faceNumber, faceEdge, newDirection, invertIndex]: WhereTo =
      params.edgeBinds[cubeLocations[0][0] + '-' + step[2]]
    let cubeSide = params.cubeSize
    const cubeLocation: CubeLocation = cubeLocations.find((it: CubeLocation) => it[1] === step[2])!
    let remainder = invertIndex ? cubeSide - 1 - cubeLocation[2] : cubeLocation[2]
    if (params.isTest) {
      if (faceNumber === 1) {
        if (faceEdge === '^') return [0, 2 * cubeSide + remainder, newDirection]
        if (faceEdge === '<') return [remainder, 2 * cubeSide, newDirection]
        if (faceEdge === '>') return [remainder, 3 * cubeSide - 1, newDirection]
      }
      if (faceNumber === 2) {
        if (faceEdge === '^') return [cubeSide, remainder, newDirection]
        if (faceEdge === '<') return [cubeSide + remainder, 0, newDirection]
        if (faceEdge === 'v') return [2 * cubeSide - 1, remainder, newDirection]
      }
      if (faceNumber === 3) {
        if (faceEdge === '^') return [cubeSide, cubeSide + remainder, newDirection]
        if (faceEdge === 'v') return [2 * cubeSide - 1, cubeSide + remainder, newDirection]
      }
      if (faceNumber === 4) {
        if (faceEdge === '>') return [cubeSide + remainder, 3 * cubeSide - 1, newDirection]
      }
      if (faceNumber === 5) {
        if (faceEdge === '<') return [2 * cubeSide + remainder, 2 * cubeSide, newDirection]
        if (faceEdge === 'v') return [3 * cubeSide - 1, 2 * cubeSide + remainder, newDirection]
      }
      if (faceNumber === 6) {
        if (faceEdge === '^') return [2 * cubeSide, 3 * cubeSide + remainder, newDirection]
        if (faceEdge === '>') return [2 * cubeSide + remainder, 4 * cubeSide - 1, newDirection]
        if (faceEdge === 'v') return [3 * cubeSide - 1, 3 * cubeSide + remainder, newDirection]
      }
    }
    if (faceNumber === 1) {
      if (faceEdge === '^') return [0, 2 * cubeSide + remainder, newDirection]
      if (faceEdge === 'v') return [cubeSide - 1, 2 * cubeSide + remainder, newDirection]
      if (faceEdge === '>') return [remainder, 3 * cubeSide - 1, newDirection]
    }
    if (faceNumber === 2) {
      if (faceEdge === '^') return [0, cubeSide + remainder, newDirection]
      if (faceEdge === '<') return [remainder, cubeSide, newDirection]
    }
    if (faceNumber === 3) {
      if (faceEdge === '<') return [cubeSide + remainder, cubeSide, newDirection]
      if (faceEdge === '>') return [cubeSide + remainder, 2 * cubeSide - 1, newDirection]
    }
    if (faceNumber === 4) {
      if (faceEdge === '>') return [2 * cubeSide + remainder, 2 * cubeSide - 1, newDirection]
      if (faceEdge === 'v') return [3 * cubeSide - 1, cubeSide + remainder, newDirection]
    }
    if (faceNumber === 5) {
      if (faceEdge === '^') return [2 * cubeSide, remainder, newDirection]
      if (faceEdge === '<') return [2 * cubeSide + remainder, 0, newDirection]
    }
    if (faceNumber === 6) {
      if (faceEdge === '<') return [3 * cubeSide + remainder, 0, newDirection]
      if (faceEdge === '>') return [3 * cubeSide + remainder, cubeSide - 1, newDirection]
      if (faceEdge === 'v') return [4 * cubeSide - 1, remainder, newDirection]
    }
    // should not be used
    return step
  }

  const doJump = (step: Step, matrix: World<string>, asCube: boolean): Step => {
    if (!asCube) {
      if (step[2] === '>') step[1] = matrix[step[0]].findIndex((val: string) => val !== ' ')
      if (step[2] === '<') step[1] = matrix[step[0]].findLastIndex((val: string) => val !== ' ')
      if (step[2] === 'v') step[0] = getColumn(matrix, step[1]).findIndex((val: string) => val !== ' ')
      if (step[2] === '^') step[0] = getColumn(matrix, step[1]).findLastIndex((val: string) => val !== ' ')
    } else step = calculateNewPosition(step)
    return step
  }

  const moveCursor = (matrix: World<string>, duration: Instruction, _step: Step, asCube: boolean): Step => {
    const steps: Step[] = [[..._step]]
    let step: Step = [..._step]
    for (let i of range(duration as number)) {
      if (step[2] === '>') {
        if (step[1] + 1 >= matrix[0].length || matrix[step[0]][step[1] + 1] === ' ') {
          step = doJump(step, matrix, asCube)
        } else step[1]++
      } else if (step[2] === '<') {
        if (step[1] - 1 < 0 || matrix[step[0]][step[1] - 1] === ' ') {
          step = doJump(step, matrix, asCube)
        } else step[1]--
      } else if (step[2] === 'v') {
        if (step[0] + 1 >= matrix.length || matrix[step[0] + 1][step[1]] === ' ') {
          step = doJump(step, matrix, asCube)
        } else step[0]++
      } else if (step[2] === '^') {
        if (step[0] - 1 < 0 || matrix[step[0] - 1][step[1]] === ' ') {
          step = doJump(step, matrix, asCube)
        } else step[0]--
      }
      if (matrix[step[0]][step[1]] === '#') return steps[steps.length - 1]
      if (matrix[step[0]][step[1]] === '.') steps.push([...step])
    }
    return steps[steps.length - 1]
  }

  const renderWorld = async (
    matrix: World<string>,
    instructions: Instruction[],
    start: Location,
    asCube: boolean,
    directions: Direction[]
  ): Promise<Path> => {
    let step: Step = [start[0], start[1], '>']
    let path: Step[] = [[...step]]
    for (let instruction of instructions) {
      if (typeof instruction === 'number') {
        step = moveCursor(matrix, instruction, step, asCube)
        path.push(step)
      } else {
        step[2] = getDirection(directions, step[2], instruction)
        path.push([...step])
      }
      if (params.ui?.show && params.ui?.during) {
        printWorld(matrix, path, start)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }
    return path
  }

  const printWorld = (matrix: World<string>, path: Path, start: Location) => {
    const _start = clc.red('O')
    const _matrix = global.structuredClone(matrix)
    path.forEach((step: Step) => (_matrix[step[0]][step[1]] = clc.green(step[2])))
    _matrix[start[0]][start[1]] = _start

    log.info(clc.cyan('+' + '-'.repeat(_matrix[0].length) + '+'))
    _matrix.forEach((row: string[]) => log.info(clc.cyan('|') + row.join('') + clc.cyan('|')))
    log.info(clc.cyan('+' + '-'.repeat(_matrix[0].length) + '+'))
  }

  const directions: Direction[] = ['>', 'v', '<', '^']
  const matrix: World<string> = []
  let instructions: Instruction[] = []

  let numberColumns: number = 0
  let mode = 'maze'
  const start: Location = [0, 0]

  for await (const line of lineReader) {
    if (mode === 'maze') {
      const vals = line.split('')
      if (vals.length === 0) mode = 'path'
      else {
        // get starting location
        if (matrix.length === 0) start[1] = line.indexOf('.')
        if (vals.length > numberColumns) numberColumns = vals.length
        matrix.push(vals)
      }
    } else if (mode === 'path') {
      instructions = line.match(/\d+|[A-Z]/g)!.map((x: string) => (x.match(/\d/) ? Number(x) : x))
    }
  }

  // fill out remaining spaces
  for (let columnIndex of range(matrix.length)) {
    if (matrix[columnIndex].length < numberColumns) {
      for (let rowIndex of range(numberColumns, matrix[columnIndex].length)) matrix[columnIndex][rowIndex] = ' '
    }
  }

  const solveFor = async (
    matrix: World<string>,
    instructions: Instruction[],
    start: Location,
    asCube: boolean,
    directions: Direction[]
  ): Promise<number> => {
    const path = await renderWorld(matrix, instructions, start, asCube, directions)
    const head = path[path.length - 1]
    return 1000 * (head[0] + 1) + 4 * (head[1] + 1) + directions.indexOf(head[2])
  }

  if (!params.skipPart1) part1 = await solveFor(matrix, instructions, start, false, directions)
  if (!params.skipPart2) part2 = await solveFor(matrix, instructions, start, true, directions)

  return { part1, part2 }
}
