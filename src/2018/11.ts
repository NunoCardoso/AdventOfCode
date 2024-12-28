import { Params } from 'aoc.d'
import { range } from 'lodash'
import { Point, World } from '../declarations'

export const getPowerLevel = (row: number, col: number, serial: number): number => {
  let rackId = row + 10
  let powerLevel = rackId * col + serial
  powerLevel = powerLevel * rackId
  let powerLevelSplit: string[] = powerLevel.toString().split('')
  let hundreds = powerLevelSplit.length > 2 ? +powerLevelSplit[powerLevelSplit.length - 3] : 0
  return hundreds - 5
}

// getPowerLevelSumTable is a table where each cell has the sum of all cells in the square it makes
export const getPowerLevelSumTable = (row: number, col: number, gridSerialInput: number, powerLevelGrid: World<number | null>, powerLevelSumTable: World<number | null>) => {
  return (
    (powerLevelSumTable[row - 1][col - 1] ?? 0) +
    (powerLevelGrid[row][col] ?? 0) +
    range(0, row).reduce((acc, _row) => acc + (_row === 0 || col === 0 ? 0 : getPowerLevel(_row, col, gridSerialInput)), 0) +
    range(0, col).reduce((acc, _col) => acc + (row === 0 || _col === 0 ? 0 : getPowerLevel(row, _col, gridSerialInput)), 0)
  )
}

export const getSumForArea = (nwPoint: Point, sePoint: Point, powerLevelSumTable: World<number | null>) =>
  (powerLevelSumTable[nwPoint[0] - 1][nwPoint[1] - 1] ?? 0) +
  (powerLevelSumTable[sePoint[0]][sePoint[1]] ?? 0) -
  (powerLevelSumTable[nwPoint[0] - 1][sePoint[1]] ?? 0) -
  (powerLevelSumTable[sePoint[0]][nwPoint[1] - 1] ?? 0)

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: string = ''
  let gridSerialInput: number
  for await (const line of lineReader) gridSerialInput = +line

  let powerLevelGrid: World<number | null> = new Array(params.size + 1).fill(null).map(() => new Array(params.size + 1).fill(null))
  let powerLevelSumTable: World<number | null> = global.structuredClone(powerLevelGrid)

  for (var row = 1; row <= params.size; row++) {
    for (var col = 1; col <= params.size; col++) {
      powerLevelGrid[row][col] = getPowerLevel(row, col, gridSerialInput!)
      powerLevelSumTable[row][col] = getPowerLevelSumTable(row, col, gridSerialInput!, powerLevelGrid, powerLevelSumTable)
    }
  }

  const solveFor = (gridSerialInput: number): string => {
    let highestPowerLevel: number = -1
    let highestPowerLevelPoint: Point = [0, 0]
    for (var row = 1; row <= params.size - 2; row++) {
      for (var col = 1; col <= params.size - 2; col++) {
        let powerLevel = getSumForArea([row, col], [row + 2, col + 2], powerLevelSumTable)
        if (powerLevel > highestPowerLevel) {
          highestPowerLevel = powerLevel
          highestPowerLevelPoint = [row, col]
        }
      }
    }
    return highestPowerLevelPoint.join(',')
  }

  const solveFor2 = (gridSerialInput: number): string => {
    let highestPowerLevel: number = -1
    let highestPowerLevelPoint: Point = [0, 0]
    let highestWidth: number = -1
    for (var width = 3; width <= params.size; width++) {
      for (var row = 1; row <= params.size - (width - 1); row++) {
        for (var col = 1; col <= params.size - (width - 1); col++) {
          let powerLevel = getSumForArea([row, col], [row + (width - 1), col + (width - 1)], powerLevelSumTable)
          if (powerLevel > highestPowerLevel) {
            highestPowerLevel = powerLevel
            highestPowerLevelPoint = [row, col]
            highestWidth = width
          }
        }
      }
    }
    return highestPowerLevelPoint.join(',') + ',' + highestWidth
  }

  if (!params.skipPart1) {
    part1 = solveFor(gridSerialInput!)
  }
  if (!params.skipPart2) {
    part2 = solveFor2(gridSerialInput!)
  }

  return { part1, part2 }
}
