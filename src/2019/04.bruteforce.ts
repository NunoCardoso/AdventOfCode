import { Params } from 'aoc.d'
import { range } from '../util/range'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let numberRange = params.input.split('-').map(Number)

  const makeMap = (numbers: number[]) => {
    let map: Record<string, number> = {}
    for (let n of numbers) map[n] = (map[n] ?? 0) + 1
    return Object.values(map)
  }

  for (let value = numberRange[0]; value <= numberRange[1]; value++) {
    let numbers = value.toString().split('').map(Number)
    let hasAdjacentNumber = false
    let hasDecreasingValue = false
    let numberCount: number[] = makeMap(numbers)
    for (let cursor of range(5)) {
      if (numbers[cursor] === numbers[cursor + 1]) hasAdjacentNumber = true
      if ((numbers[cursor + 1] - numbers[cursor]) < 0) hasDecreasingValue = true
    }
    if (hasAdjacentNumber && !hasDecreasingValue) part1++
    if (numberCount.includes(2) && !hasDecreasingValue) part2++
  }

  return { part1, part2 }
}