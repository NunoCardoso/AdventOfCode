import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let values: [number, number][] = []
  for await (const line of lineReader) values.push(line.split(',').map(Number))

  const area = (corner1: [number, number], corner2: [number, number]) =>
    (Math.abs(corner2[0] - corner1[0]) + 1) * (Math.abs(corner2[1] - corner1[1]) + 1)

  const solveFor = (): number => {
    let max = 0
    for (let i = 0; i < values.length - 1; i++) {
      for (let j = i + 1; j < values.length; j++) {
        let a = area(values[i], values[j])
        //  console.log(values[i], values[j], a)
        if (a > max) max = a
      }
    }
    return max
  }

  if (!params.skipPart1) part1 = solveFor()
  //if (!params.skipPart2) part2 = solveFor()

  return { part1, part2 }
}
