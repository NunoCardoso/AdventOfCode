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
    const [, action, x1, y1, x2, y2] = line.match(/(.+) (\d+),(\d+) through (\d+),(\d+)/)
    for (let i = +x1; i <= +x2; i++) {
      for (let j = +y1; j <= +y2; j++) {
        if (action === 'toggle') {
          world1[i][j] = world1[i][j] === 0 ? 1 : 0
          world2[i][j] = world2[i][j] + 2
        } else if (action.startsWith('turn')) {
          world1[i][j] = action.endsWith('off') ? 0 : 1
          world2[i][j] = action.endsWith('off')
            ? world2[i][j] === 0
              ? 0
              : world2[i][j] - 1
            : world2[i][j] + 1
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
