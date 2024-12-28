import { Params } from 'aoc.d'
import { Grid } from 'declarations'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const grid1: Grid = new Array(params.dimension).fill(null).map(() => new Array(params.dimension).fill(0))
  const grid2: Grid = global.structuredClone(grid1)

  for await (const line of lineReader) {
    const [, action, row1, col1, row2, col2] = line.match(/(.+) (\d+),(\d+) through (\d+),(\d+)/)
    for (let row = +row1; row <= +row2; row++) {
      for (let column = +col1; column <= +col2; column++) {
        if (action === 'toggle') {
          grid1[row][column] = grid1[row][column] === 0 ? 1 : 0
          grid2[row][column] += 2
        } else if (action.startsWith('turn')) {
          grid1[row][column] = action.endsWith('off') ? 0 : 1
          grid2[row][column] = action.endsWith('off')
            ? grid2[row][column] === 0
              ? 0
              : grid2[row][column] - 1
            : grid2[row][column] + 1
        }
      }
    }
  }

  if (!params.skipPart1) {
    part1 = grid1.reduce((acc: number, arr: number[]) => acc + arr.filter((x: number) => x === 1).length, 0)
  }
  if (!params.skipPart2) {
    part2 = grid2.reduce(
      (acc: number, arr: number[]) => acc + arr.reduce((_acc: number, _arr: number) => _acc + _arr, 0),
      0
    )
  }
  return { part1, part2 }
}
