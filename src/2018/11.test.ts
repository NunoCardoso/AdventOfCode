import { World } from '../declarations'
import { getPowerLevel, getPowerLevelSumTable, getSumForArea } from './11'

describe('2018/11', () => {
  test('getPowerLevel', () => {
    expect(getPowerLevel(3, 5, 8)).toEqual(4)
    expect(getPowerLevel(122, 79, 57)).toEqual(-5)
    expect(getPowerLevel(217, 196, 39)).toEqual(0)
    expect(getPowerLevel(101, 153, 71)).toEqual(4)
  })

  test('getPowerLevelSumArea', () => {
    let powerLevelGrid: World<number | null> = [
      [null, null, null, null, null, null, null, null, null, null, null],
      [null, 0, 1, 2, 3, -5, -4, -3, -2, -1, 1],
      [null, 4, -5, -3, -2, 0, 1, 3, 4, -5, -3],
      [null, -2, 0, 2, 3, -5, -3, -2, 0, 2, 3],
      [null, 2, 4, -4, -2, 0, 2, 4, -4, -2, 0],
      [null, -3, -1, 1, 4, -4, -2, 0, 3, -5, -3],
      [null, 1, 4, -4, -1, 1, 4, -4, -1, 2, 4],
      [null, -5, -2, 1, 4, -3, 0, 3, -4, -1, 1],
      [null, 0, 3, -4, -1, 3, -4, -1, 2, -4, -1],
      [null, 4, -2, 1, -5, -1, 2, -4, -1, 3, -3],
      [null, -1, 3, -3, 1, -5, -1, 3, -3, 1, -5]
    ]

    let powerLevelSumTable: World<number | null> = [
      [null, null, null, null, null, null, null, null, null, null, null],
      [null, 0, 1, 3, 6, 1, -3, -6, -8, -9, -8],
      [null, 4, 0, -1, 0, -5, -8, -8, -6, -12, -14],
      [null, 2, -2, -1, 3, -7, -13, -15, -13, -17, -16],
      [null, 4, 4, 1, 3, -7, -11, -9, -11, -17, -16],
      [null, 1, 0, -2, 4, -10, -16, -14, -13, -24, -26],
      [null, 2, 5, -1, 4, -9, -11, -13, -13, -22, -20],
      [null, -3, -2, -7, 2, -14, -16, -15, -19, -29, -26],
      [null, -3, 1, -8, 0, -13, -19, -19, -21, -35, -33],
      [null, 1, 3, -5, -2, -16, -20, -24, -27, -38, -39],
      [null, 0, 5, -6, -2, -21, -26, -27, -33, -43, -49]
    ]

    expect(getPowerLevelSumTable(1, 1, 7400, powerLevelGrid, powerLevelSumTable)).toEqual(
      powerLevelSumTable[1][1]
    )
    expect(getPowerLevelSumTable(1, 2, 7400, powerLevelGrid, powerLevelSumTable)).toEqual(
      powerLevelSumTable[1][2]
    )
    expect(getPowerLevelSumTable(1, 3, 7400, powerLevelGrid, powerLevelSumTable)).toEqual(
      powerLevelSumTable[1][3]
    )
    expect(getPowerLevelSumTable(1, 4, 7400, powerLevelGrid, powerLevelSumTable)).toEqual(
      powerLevelSumTable[1][4]
    )

    expect(getPowerLevelSumTable(2, 1, 7400, powerLevelGrid, powerLevelSumTable)).toEqual(
      powerLevelSumTable[2][1]
    )
    expect(getPowerLevelSumTable(2, 2, 7400, powerLevelGrid, powerLevelSumTable)).toEqual(
      powerLevelSumTable[2][2]
    )
    expect(getPowerLevelSumTable(2, 3, 7400, powerLevelGrid, powerLevelSumTable)).toEqual(
      powerLevelSumTable[2][3]
    )
    expect(getPowerLevelSumTable(2, 4, 7400, powerLevelGrid, powerLevelSumTable)).toEqual(
      powerLevelSumTable[2][4]
    )

    expect(getSumForArea([2, 2], [4, 4], powerLevelSumTable)).toEqual(-7)
  })
})
