import { Params } from 'aoc.d'
import { World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const world1: World = []
  for (let i = 0; i < params.dimension; i++) {
    world1.push(new Array(params.dimension).fill(0))
  }
  const world2: World = global.structuredClone(world1)

  for await (const line of lineReader) {
    const [, action, row1, column1, row2, column2] = line.match(/(.+) (\d+),(\d+) through (\d+),(\d+)/)
    for (let row = +row1; row <= +row2; row++) {
      for (let column = +column1; column <= +column2; column++) {
        if (action === 'toggle') {
          world1[row][column] = world1[row][column] === 0 ? 1 : 0
          world2[row][column] += 2
        } else if (action.startsWith('turn')) {
          world1[row][column] = action.endsWith('off') ? 0 : 1
          world2[row][column] = action.endsWith('off')
            ? world2[row][column] === 0
                ? 0
                : world2[row][column] - 1
            : world2[row][column] + 1
        }
      }
    }
  }

  if (!params.skipPart1) {
    part1 = world1.reduce(
      (acc: number, arr: Array<number>) => acc + arr.filter((x: number) => x === 1).length,
      0
    )
  }
  if (!params.skipPart2) {
    part2 = world2.reduce(
      (acc: number, arr: Array<number>) => acc + arr.reduce((_acc: number, _arr: number) => _acc + _arr, 0),
      0
    )
  }
  return { part1, part2 }
}
