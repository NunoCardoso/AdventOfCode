import { Params } from 'aoc.d'
import _ from 'lodash'
import clc from 'cli-color'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Matrix = Array<Array<string>>
  type Point = [number, number]
  type Instruction = number | string
  type Step = { direction: string; point: Point }
  type Instructions = Array<Instruction>
  type Path = Array<Step>
  type SideAndIndex = { side: string; index: number }
  type WhereTo = [number, string, string, boolean]
  const directions = ['>', 'v', '<', '^']
  const matrix: Matrix = []
  const instructions: Instructions = []
  const cubeSide: number = params.cubeSize

  let numberColumns: number = 0
  let mode = 'maze'
  const start: Point = [0, 0]

  for await (const line of lineReader) {
    if (mode === 'maze') {
      const vals = line.split('')
      if (vals.length === 0) {
        mode = 'path'
      } else {
        // get starting point
        if (matrix.length === 0) {
          start[1] = line.indexOf('.')
        }
        if (vals.length > numberColumns) {
          numberColumns = vals.length
        }
        matrix.push(vals)
      }
    }
    if (mode === 'path') {
      let type: string = ''
      let read: string = ''
      const vals = line.split('')
      vals.forEach((val: string) => {
        if (val.match(/^\d+$/)) {
          if (type !== 'd') {
            type = 'd'
            if (read !== '') {
              instructions.push(read)
            }
            read = val
          } else {
            read = read + val
          }
        }
        if (val.match(/^[LR]+$/)) {
          if (type !== '>') {
            type = 's'
            if (read !== '') {
              instructions.push(parseInt(read))
            }
            read = val
          } else {
            read = read + val
          }
        }
      })
      if (read !== '') {
        if (type === 's') {
          instructions.push(read)
        } else {
          instructions.push(parseInt(read))
        }
      }
    }
  }

  // fill out remaining spaces
  for (let columnIndex = 0; columnIndex < matrix.length; columnIndex++) {
    if (matrix[columnIndex].length < numberColumns) {
      for (let rowIndex = matrix[columnIndex].length; rowIndex < numberColumns; rowIndex++) {
        matrix[columnIndex][rowIndex] = ' '
      }
    }
  }

  const numberRows: number = matrix.length
  log.info('rows', numberRows, 'columns', numberColumns)
  log.info('start', start)

  const getColumn = (matrix: Matrix, column: number) => matrix.map((row) => row[column])

  const getDirection = (direction: string, instruction: Instruction): string => {
    let newIndex: number = 0
    if (instruction === 'R') {
      newIndex = (directions.indexOf(direction) + 1 + directions.length) % directions.length
    }
    if (instruction === 'L') {
      newIndex = (directions.indexOf(direction) - 1 + directions.length) % directions.length
    }
    return directions[newIndex]
  }
  /*
      +-+-+
      |2|1|
      +-+-+
      |3|
    +-+-+
    |5|4|
    +-+-+
    |6|
    +-+

    [1, W, <] => {2, E, <}; [1, S, v] => {3, E, <}; [1, E, >] => {4, E, <}; [1, N, ^] => {6, S, ^}
    [2, W, <] => {5, W, >}; [2, S, v] => {3, N, <}; [2, E, >] => {1, W, >}; [2, N, ^] => {6, W, >}
    [3, W, <] => {5, N, v}; [3, S, v] => {4, N, v}; [3, E, >] => {1, S, ^}; [3, N, ^] => {2, S, ^}
    [4, W, <] => {5, E, <}; [4, S, v] => {6, E, <}; [4, E, >] => {1, E, <}; [4, N, ^] => {3, S, ^}
    [5, W, <] => {2, W, >}; [5, S, v] => {6, N, v}; [5, E, >] => {4, W, >}; [5, N, ^] => {3, W, >}
    [6, W, <] => {2, N, v}; [6, S, v] => {?, ?, ?}; [6, E, >] => {4, S, ^}; [6, N, ^] => {5, S, ^}

 */

  const seeWhereTo = (whichCubeAmI: number, direction: string): WhereTo => {
    const edgeBinds: Record<string, WhereTo> = params.isTest
      ? {
          '1-<': [3, '^', 'v', false],
          '1-^': [2, '^', 'v', true],
          '1->': [6, '>', '<', true],
          '2-^': [1, '^', 'v', true],
          '2-<': [6, 'v', '^', true],
          '2-v': [5, 'v', '^', true],
          '3-^': [1, '<', '>', false],
          '3-v': [5, '<', '>', false],
          '4->': [6, '^', 'v', true],
          '5-<': [3, 'v', '^', true],
          '5-v': [2, 'v', '^', false],
          '6-^': [4, '>', '<', true],
          '6->': [1, '>', '<', true],
          '6-v': [2, '<', '>', true]
        }
      : {
          '1-v': [3, '>', '<', false],
          '1->': [4, '>', '<', true],
          '1-^': [6, 'v', '^', false],
          '2-<': [5, '<', '>', true],
          '2-^': [6, '<', '>', false],
          '3-<': [5, '^', 'v', false],
          '3->': [1, 'v', '^', false],
          '4-v': [6, '>', '<', false],
          '4->': [1, '>', '<', true],
          '5-<': [2, '<', '>', true],
          '5-^': [3, '<', '>', false],
          '6-<': [2, '^', 'v', false],
          '6-v': [1, '^', 'v', false],
          '6->': [4, 'v', '^', false]
        }
    return edgeBinds['' + whichCubeAmI + '-' + direction] as WhereTo
  }

  const seeWhereIAm = (currentCursor: Step): any => {
    let whichCubeAmI: number = 0
    const whichSideAndIndex: Array<SideAndIndex> = []

    if (params.isTest) {
      if (currentCursor.point[0] === 0) {
        whichCubeAmI = 1
        whichSideAndIndex.push({ side: '^', index: currentCursor.point[1] % cubeSide })
      }
      if (currentCursor.point[0] === cubeSide - 1) {
        whichCubeAmI = 1
        whichSideAndIndex.push({ side: 'v', index: currentCursor.point[1] % cubeSide })
      }
      if (currentCursor.point[0] === cubeSide) {
        if (currentCursor.point[1] < cubeSide) {
          whichCubeAmI = 2
          whichSideAndIndex.push({ side: '^', index: currentCursor.point[1] % cubeSide })
        } else if (currentCursor.point[1] < cubeSide * 2) {
          whichCubeAmI = 3
          whichSideAndIndex.push({ side: '^', index: currentCursor.point[1] % cubeSide })
        } else {
          whichCubeAmI = 4
          whichSideAndIndex.push({ side: '^', index: currentCursor.point[1] % cubeSide })
        }
      }
      if (currentCursor.point[0] === cubeSide * 2 - 1) {
        if (currentCursor.point[1] < cubeSide) {
          whichCubeAmI = 2
          whichSideAndIndex.push({ side: 'v', index: currentCursor.point[1] % cubeSide })
        } else if (currentCursor.point[1] < cubeSide * 2) {
          whichCubeAmI = 3
          whichSideAndIndex.push({ side: 'v', index: currentCursor.point[1] % cubeSide })
        } else {
          whichCubeAmI = 4
          whichSideAndIndex.push({ side: 'v', index: currentCursor.point[1] % cubeSide })
        }
      }
      if (currentCursor.point[0] === cubeSide * 3) {
        if (currentCursor.point[1] < cubeSide * 3) {
          whichCubeAmI = 5
          whichSideAndIndex.push({ side: '^', index: currentCursor.point[1] % cubeSide })
        } else {
          whichCubeAmI = 6
          whichSideAndIndex.push({ side: '^', index: currentCursor.point[1] % cubeSide })
        }
      }
      if (currentCursor.point[1] === 0) {
        whichCubeAmI = 2
        whichSideAndIndex.push({ side: '<', index: currentCursor.point[0] % cubeSide })
      }
      if (currentCursor.point[1] === cubeSide - 1) {
        whichCubeAmI = 2
        whichSideAndIndex.push({ side: '>', index: currentCursor.point[0] % cubeSide })
      }
      if (currentCursor.point[1] === cubeSide) {
        whichCubeAmI = 3
        whichSideAndIndex.push({ side: '<', index: currentCursor.point[0] % cubeSide })
      }
      if (currentCursor.point[1] === cubeSide * 2 - 1) {
        whichCubeAmI = 3
        whichSideAndIndex.push({ side: '>', index: currentCursor.point[0] % cubeSide })
      }
      if (currentCursor.point[1] === cubeSide * 2) {
        if (currentCursor.point[0] < cubeSide) {
          whichCubeAmI = 1
          whichSideAndIndex.push({ side: '<', index: currentCursor.point[0] % cubeSide })
        } else if (currentCursor.point[0] < cubeSide * 2) {
          whichCubeAmI = 4
          whichSideAndIndex.push({ side: '<', index: currentCursor.point[0] % cubeSide })
        } else {
          whichCubeAmI = 5
          whichSideAndIndex.push({ side: '<', index: currentCursor.point[0] % cubeSide })
        }
      }
      if (currentCursor.point[1] === cubeSide * 3 - 1) {
        if (currentCursor.point[0] < cubeSide) {
          whichCubeAmI = 1
          whichSideAndIndex.push({ side: '>', index: currentCursor.point[0] % cubeSide })
        } else if (currentCursor.point[0] < cubeSide * 2) {
          whichCubeAmI = 4
          whichSideAndIndex.push({ side: '>', index: currentCursor.point[0] % cubeSide })
        } else {
          whichCubeAmI = 5
          whichSideAndIndex.push({ side: '>', index: currentCursor.point[0] % cubeSide })
        }
      }
      if (currentCursor.point[1] === cubeSide * 3) {
        whichCubeAmI = 6
        whichSideAndIndex.push({ side: '<', index: currentCursor.point[0] % cubeSide })
      }
      if (currentCursor.point[1] === cubeSide * 4 - 1) {
        whichCubeAmI = 6
        whichSideAndIndex.push({ side: '>', index: currentCursor.point[0] % cubeSide })
      }
    } else {
      if (currentCursor.point[0] === 0) {
        if (currentCursor.point[1] < cubeSide * 2) {
          whichCubeAmI = 2
          whichSideAndIndex.push({ side: '^', index: currentCursor.point[1] % cubeSide })
        } else {
          whichCubeAmI = 1
          whichSideAndIndex.push({ side: '^', index: currentCursor.point[1] % cubeSide })
        }
      }
      if (currentCursor.point[0] === cubeSide - 1) {
        if (currentCursor.point[1] < cubeSide * 2) {
          whichCubeAmI = 2
          whichSideAndIndex.push({ side: 'v', index: currentCursor.point[1] % cubeSide })
        } else {
          whichCubeAmI = 1
          whichSideAndIndex.push({ side: 'v', index: currentCursor.point[1] % cubeSide })
        }
      }
      if (currentCursor.point[0] === cubeSide) {
        whichCubeAmI = 3
        whichSideAndIndex.push({ side: '^', index: currentCursor.point[1] % cubeSide })
      }
      if (currentCursor.point[0] === 2 * cubeSide - 1) {
        whichCubeAmI = 3
        whichSideAndIndex.push({ side: 'v', index: currentCursor.point[1] % cubeSide })
      }
      if (currentCursor.point[0] === 2 * cubeSide) {
        if (currentCursor.point[1] < cubeSide) {
          whichCubeAmI = 5
          whichSideAndIndex.push({ side: '^', index: currentCursor.point[1] % cubeSide })
        } else {
          whichCubeAmI = 4
          whichSideAndIndex.push({ side: 'v', index: currentCursor.point[1] % cubeSide })
        }
      }
      if (currentCursor.point[0] === 3 * cubeSide - 1) {
        if (currentCursor.point[1] < cubeSide) {
          whichCubeAmI = 5
          whichSideAndIndex.push({ side: 'v', index: currentCursor.point[1] % cubeSide })
        } else {
          whichCubeAmI = 4
          whichSideAndIndex.push({ side: 'v', index: currentCursor.point[1] % cubeSide })
        }
      }
      if (currentCursor.point[0] === 3 * cubeSide) {
        whichCubeAmI = 6
        whichSideAndIndex.push({ side: '^', index: currentCursor.point[1] % cubeSide })
      }
      if (currentCursor.point[0] === 4 * cubeSide - 1) {
        whichCubeAmI = 6
        whichSideAndIndex.push({ side: 'v', index: currentCursor.point[1] % cubeSide })
      }

      if (currentCursor.point[1] === 0) {
        if (currentCursor.point[0] < 3 * cubeSide) {
          whichCubeAmI = 5
          whichSideAndIndex.push({ side: '<', index: currentCursor.point[0] % cubeSide })
        } else {
          whichCubeAmI = 6
          whichSideAndIndex.push({ side: '<', index: currentCursor.point[0] % cubeSide })
        }
      }

      if (currentCursor.point[1] === cubeSide - 1) {
        if (currentCursor.point[0] < 3 * cubeSide) {
          whichCubeAmI = 5
          whichSideAndIndex.push({ side: '>', index: currentCursor.point[0] % cubeSide })
        } else {
          whichCubeAmI = 6
          whichSideAndIndex.push({ side: '>', index: currentCursor.point[0] % cubeSide })
        }
      }

      if (currentCursor.point[1] === cubeSide) {
        if (currentCursor.point[0] < cubeSide) {
          whichCubeAmI = 2
          whichSideAndIndex.push({ side: '<', index: currentCursor.point[0] % cubeSide })
        } else if (currentCursor.point[0] < 2 * cubeSide) {
          whichCubeAmI = 3
          whichSideAndIndex.push({ side: '<', index: currentCursor.point[0] % cubeSide })
        } else {
          whichCubeAmI = 4
          whichSideAndIndex.push({ side: '<', index: currentCursor.point[0] % cubeSide })
        }
      }

      if (currentCursor.point[1] === 2 * cubeSide - 1) {
        if (currentCursor.point[0] < cubeSide) {
          whichCubeAmI = 2
          whichSideAndIndex.push({ side: '>', index: currentCursor.point[0] % cubeSide })
        } else if (currentCursor.point[0] < 2 * cubeSide) {
          whichCubeAmI = 3
          whichSideAndIndex.push({ side: '>', index: currentCursor.point[0] % cubeSide })
        } else {
          whichCubeAmI = 4
          whichSideAndIndex.push({ side: '>', index: currentCursor.point[0] % cubeSide })
        }
      }

      if (currentCursor.point[1] === 2 * cubeSide) {
        whichCubeAmI = 1
        whichSideAndIndex.push({ side: '<', index: currentCursor.point[0] % cubeSide })
      }

      if (currentCursor.point[1] === 3 * cubeSide - 1) {
        whichCubeAmI = 1
        whichSideAndIndex.push({ side: '>', index: currentCursor.point[0] % cubeSide })
      }
    }
    return [whichCubeAmI, whichSideAndIndex]
  }

  const calculateNewPosition = (
    nextCursor: Step,
    currentCursor: Step,
    whichSideAndIndex: Array<SideAndIndex>,
    cubeNumber: number,
    cubePosition: string,
    newDirection: string,
    invertIndex: boolean
  ) => {
    nextCursor.direction = newDirection

    if (params.isTest) {
      if (cubeNumber === 1) {
        if (cubePosition === '^') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 3 * cubeSide - 1
          nextCursor.point[1] = 2 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
        }
        if (cubePosition === '<') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = cubeSide
          nextCursor.point[1] = cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
        }
        if (cubePosition === 'v') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 2 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
          nextCursor.point[1] = 2 * cubeSide
        }
      }
      if (cubeNumber === 2) {
        if (cubePosition === '^') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 0
          nextCursor.point[1] = 2 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
        }
        if (cubePosition === '<') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 3 * cubeSide - 1
          nextCursor.point[1] = 3 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
        }
        if (cubePosition === 'v') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 3 * cubeSide - 1
          nextCursor.point[1] = 2 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
        }
      }
      if (cubeNumber === 3) {
        if (cubePosition === '^') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 0 + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
          nextCursor.point[1] = 2 * cubeSide
        }
        if (cubePosition === 'v') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 2 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
          nextCursor.point[1] = 2 * cubeSide
        }
      }
      if (cubeNumber === 4) {
        if (cubePosition === '>') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 2 * cubeSide
          nextCursor.point[1] = 3 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
        }
      }
      if (cubeNumber === 5) {
        if (cubePosition === '<') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 2 * cubeSide
          nextCursor.point[1] = cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
        }
        if (cubePosition === 'v') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 2 * cubeSide - 1
          nextCursor.point[1] = 0 + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
        }
      }
      if (cubeNumber === 6) {
        if (cubePosition === '^') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
          nextCursor.point[1] = 3 * cubeSide - 1
        }
        if (cubePosition === '>') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 0 + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
          nextCursor.point[1] = 3 * cubeSide - 1
        }
        if (cubePosition === 'v') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
          nextCursor.point[1] = 0
        }
      }
    } else {
      if (cubeNumber === 1) {
        if (cubePosition === '^') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 0
          nextCursor.point[1] = 2 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
        }
        if (cubePosition === 'v') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = cubeSide - 1
          nextCursor.point[1] = 2 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
        }
        if (cubePosition === '>') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index
          nextCursor.point[1] = 3 * cubeSide - 1
        }
      }
      if (cubeNumber === 2) {
        if (cubePosition === '^') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 0
          nextCursor.point[1] = cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
        }
        if (cubePosition === '<') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index
          nextCursor.point[1] = cubeSide
        }
      }
      if (cubeNumber === 3) {
        if (cubePosition === '<') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
          nextCursor.point[1] = cubeSide
        }
        if (cubePosition === '>') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
          nextCursor.point[1] = 2 * cubeSide - 1
        }
      }
      if (cubeNumber === 4) {
        if (cubePosition === '>') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 2 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
          nextCursor.point[1] = 2 * cubeSide - 1
        }
        if (cubePosition === 'v') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 3 * cubeSide - 1
          nextCursor.point[1] = cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
        }
      }

      if (cubeNumber === 5) {
        if (cubePosition === '^') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 2 * cubeSide
          nextCursor.point[1] = invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index
        }
        if (cubePosition === '<') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 2 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
          nextCursor.point[1] = 0
        }
      }
      if (cubeNumber === 6) {
        if (cubePosition === '<') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 3 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
          nextCursor.point[1] = 0
        }
        if (cubePosition === '>') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 3 * cubeSide + (invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index)
          nextCursor.point[1] = cubeSide - 1
        }

        if (cubePosition === 'v') {
          const sandi: SideAndIndex | undefined = _.find(
            whichSideAndIndex,
            (it: SideAndIndex) => it.side === currentCursor.direction
          )
          nextCursor.point[0] = 4 * cubeSide - 1
          nextCursor.point[1] = invertIndex ? cubeSide - 1 - sandi!.index : sandi!.index
        }
      }
    }
  }
  /*
    +-+-+
    |2|1|
    +-+
    |3|
  +-+-+
  |5|4|
  +-+
  |6|
  +-+
  */
  const doJump = (currentCursor: Step, nextCursor: Step, matrix: Matrix, asCube: boolean) => {
    if (!asCube) {
      if (currentCursor.direction === '>') {
        nextCursor.point[1] = _.findIndex(matrix[nextCursor.point[0]], (val: string) => val !== ' ')
      }
      if (currentCursor.direction === '<') {
        nextCursor.point[1] = _.findLastIndex(matrix[nextCursor.point[0]], (val: string) => val !== ' ')
      }
      if (currentCursor.direction === 'v') {
        const column = getColumn(matrix, nextCursor.point[1])
        nextCursor.point[0] = _.findIndex(column, (val: string) => val !== ' ')
      }
      if (currentCursor.direction === '^') {
        const column = getColumn(matrix, nextCursor.point[1])
        nextCursor.point[0] = _.findLastIndex(column, (val: string) => val !== ' ')
      }
    } else {
      const [whichCubeAmI, whichSideAndIndex] = seeWhereIAm(currentCursor)
      log.debug('doJump: I am at', currentCursor, 'in side', whichCubeAmI)
      const whereTo: WhereTo = seeWhereTo(whichCubeAmI, currentCursor.direction)
      calculateNewPosition(nextCursor, currentCursor, whichSideAndIndex, ...whereTo)
      log.debug(
        'doJump: I am now going to',
        nextCursor.point,
        ': that is side',
        whereTo[0],
        'position',
        whereTo[1],
        'direction',
        whereTo[2],
        'invert',
        whereTo[3]
      )
    }
  }

  const moveCursor = (matrix: Matrix, duration: Instruction, cursor: Step, asCube: boolean): Array<Step> => {
    const steps: Array<Step> = []
    let currentCursor: Step = { point: [cursor.point[0], cursor.point[1]], direction: cursor.direction }
    const nextCursor: Step = { point: [cursor.point[0], cursor.point[1]], direction: cursor.direction }
    for (let i = 0; i < (duration as number); i++) {
      log.trace(i, 'moving', currentCursor, 'instruction', duration)
      if (currentCursor.direction === '>') {
        nextCursor.point[1] = currentCursor.point[1] + 1
        if (
          nextCursor.point[1] >= matrix[0].length ||
          matrix[nextCursor.point[0]][nextCursor.point[1]] === ' '
        ) {
          doJump(currentCursor, nextCursor, matrix, asCube)
        }
      }
      if (currentCursor.direction === '<') {
        nextCursor.point[1] = currentCursor.point[1] - 1
        if (nextCursor.point[1] < 0 || matrix[nextCursor.point[0]][nextCursor.point[1]] === ' ') {
          doJump(currentCursor, nextCursor, matrix, asCube)
        }
      }
      if (currentCursor.direction === 'v') {
        nextCursor.point[0] = currentCursor.point[0] + 1
        if (
          nextCursor.point[0] >= matrix.length ||
          matrix[nextCursor.point[0]][nextCursor.point[1]] === ' '
        ) {
          doJump(currentCursor, nextCursor, matrix, asCube)
        }
      }
      if (currentCursor.direction === '^') {
        nextCursor.point[0] = currentCursor.point[0] - 1
        if (nextCursor.point[0] < 0 || matrix[nextCursor.point[0]][nextCursor.point[1]] === ' ') {
          doJump(currentCursor, nextCursor, matrix, asCube)
        }
      }
      if (matrix[nextCursor.point[0]][nextCursor.point[1]] === '#') {
        return steps
      }
      if (matrix[nextCursor.point[0]][nextCursor.point[1]] === '.') {
        currentCursor = { point: [nextCursor.point[0], nextCursor.point[1]], direction: nextCursor.direction }
        steps.push(currentCursor)
      }
    }
    return steps
  }

  const renderMatrix = async (
    matrix: Matrix,
    instructions: Instructions,
    path: Path,
    start: Point,
    asCube: boolean
  ): Promise<Path> => {
    let cursor: Step = { point: [start[0], start[1]], direction: '>' }
    for (let i = 0; i < instructions.length; i++) {
      let newSteps: Array<Step> = []
      if (_.isNumber(instructions[i])) {
        newSteps = moveCursor(matrix, instructions[i], cursor, asCube)
        if (newSteps.length > 0) {
          cursor = newSteps[newSteps.length - 1]
          path = path.concat(newSteps)
        }
      } else {
        path[path.length - 1].direction = getDirection(path[path.length - 1].direction, instructions[i])
      }
      if (params.ui?.show && params.ui?.during) {
        printMatrix(matrix, path, start)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }
    return path
  }

  const printMatrix = (matrix: Matrix, path: Path, start: Point) => {
    const _start = clc.red('O')

    const _matrix = _.cloneDeep(matrix)
    path.forEach((step: Step) => {
      _matrix[step.point[0]][step.point[1]] = clc.green(step.direction)
    })
    _matrix[start[0]][start[1]] = _start

    console.log(clc.cyan('+' + '-'.repeat(_matrix[0].length) + '+'))
    _matrix.forEach((row: Array<string>) => console.log(clc.cyan('|') + row.join('') + clc.cyan('|')))
    console.log(clc.cyan('+' + '-'.repeat(_matrix[0].length) + '+'))
  }

  let part1: number = 0
  let part2: number = 0
  if (params.part1?.skip !== true) {
    const path1 = await renderMatrix(matrix, instructions, [], start, false)
    const endPathRow1 = path1[path1.length - 1].point[0] + 1
    const endPathColumn1 = path1[path1.length - 1].point[1] + 1
    const direction1 = path1[path1.length - 1].direction
    log.debug(endPathRow1, endPathColumn1, direction1)
    part1 = 1000 * endPathRow1 + 4 * endPathColumn1 + directions.indexOf(direction1)
  }

  if (params.part2?.skip !== true) {
    const path2 = await renderMatrix(matrix, instructions, [], start, true)
    const endPathRow2 = path2[path2.length - 1].point[0] + 1
    const endPathColumn2 = path2[path2.length - 1].point[1] + 1
    const direction2 = path2[path2.length - 1].direction

    log.debug(endPathRow2, endPathColumn2, direction2)
    part2 = 1000 * endPathRow2 + 4 * endPathColumn2 + directions.indexOf(direction2)
  }
  return { part1, part2 }
}
