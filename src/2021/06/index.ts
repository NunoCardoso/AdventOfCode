import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const fishes: Array<number> = Array(9).fill(0)

  for await (const line of lineReader) {
    line.split(',').forEach((fish: string) => {
      fishes[parseInt(fish)]++
    })
  }

  let day = 0
  let part1
  let part2

  while (day < Math.max(params.days.part1, params.days.part2)) {
    const shiftedFish = fishes.shift()!
    fishes[6] += shiftedFish
    fishes.push(shiftedFish) // index 8
    day++

    if (day === params.days.part1) {
      part1 = fishes.reduce((x, y) => x + y, 0)
    }
    if (day === params.days.part2) {
      part2 = fishes.reduce((x, y) => x + y, 0)
    }
  }

  return {
    part1,
    part2
  }
}
