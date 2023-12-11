import { Params } from 'aoc.d'
import { World, Point } from 'declarations'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const world1: World = []
  for (let i = 0; i < params.dimension; i++) {
    world1.push(new Array(params.dimension).fill(0))
  }
  const world2: World = global.structuredClone(world1)

  for await (const line of lineReader) {
    const values = line.split(' ')
    if (values[0] === 'toggle') {
      const fromValues: Point = values[1].split(',').map(Number)
      const toValues: Point = values[3].split(',').map(Number)
      for (let i = fromValues[0]; i <= toValues[0]; i++) {
        for (let j = fromValues[1]; j <= toValues[1]; j++) {
          world1[i][j] = world1[i][j] === 0 ? 1 : 0
          world2[i][j] = world2[i][j] + 2
        }
      }
    }
    if (values[0] === 'turn') {
      const fromValues: Point = values[2].split(',').map(Number)
      const toValues: Point = values[4].split(',').map(Number)
      for (let i = fromValues[0]; i <= toValues[0]; i++) {
        for (let j = fromValues[1]; j <= toValues[1]; j++) {
          if (values[1] === 'off') {
            world1[i][j] = 0
            world2[i][j] = world2[i][j] === 0 ? 0 : world2[i][j] - 1
          }
          if (values[1] === 'on') {
            world1[i][j] = 1
            world2[i][j] = world2[i][j] + 1
          }
        }
      }
    }
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = world1.reduce(
      (acc: number, arr: Array<number>) => acc + arr.filter((x: number) => x === 1).length,
      0
    )
  }
  if (params.skip !== true && params.skip !== 'part2') {
    part2 = world2.reduce(
      (acc: number, arr: Array<number>) => acc + arr.reduce((_acc: number, _arr: number) => _acc + _arr, 0),
      0
    )
  }
  return { part1, part2 }
}
