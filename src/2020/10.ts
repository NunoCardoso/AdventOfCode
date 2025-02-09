import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const solveForPart1 = (values: number[]): number => {
    let threes = 0,
      ones = 0
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i + 1] - values[i] === 1) ones++
      if (values[i + 1] - values[i] === 3) threes++
    }
    return threes * ones
  }

  const solveForPart2 = (values: number[]): number => {
    let groups: number[][] = []
    groups[0] = [values.shift()!] // the 0
    while (values.length > 0) {
      let next = values.shift()!
      if (next - groups[groups.length - 1][groups[groups.length - 1].length - 1] === 1) {
        groups[groups.length - 1].push(next)
      } else groups.push([next])
    }

    return groups.reduce((acc, group) => {
      if (group.length <= 2) return acc
      let lostLength = [0, 0, 0, 0, 0, 1, 3]
      return acc * (2 ** (group.length - 2) - lostLength[group.length])
    }, 1)
  }

  let values: number[] = []
  for await (const line of lineReader) values.push(+line)
  let max = Math.max(...values)
  values.push(0, max + 3)
  values.sort((a, b) => a - b)
  if (!params.skipPart1) part1 = solveForPart1(values)
  if (!params.skipPart2) part2 = solveForPart2(values)

  return { part1, part2 }
}
