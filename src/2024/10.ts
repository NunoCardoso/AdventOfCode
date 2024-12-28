import { Params } from 'aoc.d'
import { Point, World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let world: World<number> = []
  let seeds: Point[][] = []
  let rowIndex = 0
  let dimension = [0, 0]
  for await (const line of lineReader) {
    let values = line.split('').map(Number)
    values.forEach((col: number, colIndex: number) => {
      if (col === 0) {
        seeds.push([[rowIndex, colIndex]])
      }
    })
    world.push(values)
    rowIndex++
  }
  dimension = [world.length, world[0].length]

  const getMoreHeads = (world: World, points: Point[]): Point[] => {
    let targetedValue = points.length // for a list of 4 points, 0 to 3, I want more points with value 4
    let head = points[points.length - 1]
    return (
      [
        [head[0] - 1, head[1]],
        [head[0] + 1, head[1]],
        [head[0], head[1] - 1],
        [head[0], head[1] + 1]
      ] as Point[]
    ).filter((newPoint) => newPoint[0] >= 0 && newPoint[0] < dimension[0] && newPoint[1] >= 0 && newPoint[1] < dimension[1] && world[newPoint[0]][newPoint[1]] === targetedValue)
  }

  const getScore = (world: World, points: Point[], seen: Point[]): number => {
    if (points.length === 10) {
      let head = points[points.length - 1]
      if (!seen.some((p) => p[0] === head[0] && p[1] === head[1])) {
        seen.push(head)
        return 1
      }
      return 0
    }
    let moreHeads: Point[] = getMoreHeads(world, points)
    if (moreHeads.length === 0) return 0
    return moreHeads.reduce((acc, head) => acc + getScore(world, points.concat([head]), seen), 0)
  }

  const getScorePart2 = (world: World, points: Point[]): number => {
    if (points.length === 10) return 1
    let moreHeads: Point[] = getMoreHeads(world, points)
    if (moreHeads.length === 0) return 0
    return moreHeads.reduce((acc, head) => acc + getScorePart2(world, points.concat([head])), 0)
  }

  if (!params.skipPart1) {
    part1 = seeds.reduce((acc, seed) => acc + getScore(world, seed, []), 0)
  }
  if (!params.skipPart2) {
    part2 = seeds.reduce((acc, seed) => acc + getScorePart2(world, seed), 0)
  }

  return { part1, part2 }
}
