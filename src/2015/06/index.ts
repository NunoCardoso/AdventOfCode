import { Params } from 'aoc.d'
import { Matrix, Point } from 'declarations'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const matrix1: Matrix = []
  const matrix2: Matrix = []

  for (let i = 0; i < params.dimension; i++) {
    matrix1.push(new Array(params.dimension).fill(0))
    matrix2.push(new Array(params.dimension).fill(0))
  }

  for await (const line of lineReader) {
    const values = line.split(' ')
    if (values[0] === 'toggle') {
      const fromValues: Point = values[1].split(',').map(Number)
      const toValues: Point = values[3].split(',').map(Number)
      for (let i = fromValues[0]; i <= toValues[0]; i++) {
        for (let j = fromValues[1]; j <= toValues[1]; j++) {
          matrix1[i][j] = matrix1[i][j] === 0 ? 1 : 0
          matrix2[i][j] = matrix2[i][j] + 2
        }
      }
    }
    if (values[0] === 'turn') {
      const fromValues: Point = values[2].split(',').map(Number)
      const toValues: Point = values[4].split(',').map(Number)
      for (let i = fromValues[0]; i <= toValues[0]; i++) {
        for (let j = fromValues[1]; j <= toValues[1]; j++) {
          if (values[1] === 'off') {
            matrix1[i][j] = 0
            matrix2[i][j] = matrix2[i][j] === 0 ? 0 : matrix2[i][j] - 1
          }
          if (values[1] === 'on') {
            matrix1[i][j] = 1
            matrix2[i][j] = matrix2[i][j] + 1
          }
        }
      }
    }
  }

  const howMany = (matrix: Matrix): number =>
    _.reduce(
      matrix,
      (memo: number, arr: Array<number>) => {
        return memo + _.filter(arr, (x: number) => x === 1).length
      },
      0
    )

  const howMany2 = (matrix: Matrix): number =>
    _.reduce(
      matrix,
      (memo: number, arr: Array<number>) =>
        memo + _.reduce(arr, (_memo: number, _arr: number) => _memo + _arr, 0),
      0
    )

  return {
    part1: params.part1?.skip !== true ? howMany(matrix1) : undefined,
    part2: params.part2?.skip !== true ? howMany2(matrix2) : undefined
  }
}
