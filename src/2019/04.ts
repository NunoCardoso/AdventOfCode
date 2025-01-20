import { Params } from 'aoc.d'
import { range, rangeFromToInclusive } from '../util/range'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let numberRange = params.input.split('-').map(Number)

  const getNonAdjacentNumber = (number: number, round: 'floor' | 'ceil'): number => {
    const digits: string[] = number.toString().split('')
    for (let cursor of range(5)) {
      if (digits[cursor + 1] < digits[cursor]) { // I can do string comparison between single digits.
        // Once a violation is found, set all subsequent digits to the previous digit
        const fillValue = digits[cursor]
        for (let otherCursor of rangeFromToInclusive(cursor, 5)) digits[otherCursor] = fillValue
        break
      }
    }
    let result = Number(digits.join(''))
    if (round === 'floor') {
      if (result >= number) return result
      // if it's below original, increase the first number, do it again
      return getNonAdjacentNumber(Number(digits[0] + 1) * 100000, round)
    }
    // round === 'ceil'
    if (result <= number) return result
    return getNonAdjacentNumber(Number(digits[0]) * 100000 - 1, round)
  }

  let lowestNumber: number = getNonAdjacentNumber(numberRange[0], 'floor')

  let highestNumber: number = getNonAdjacentNumber(numberRange[1], 'ceil')

  const makeMap = (numbers: number[]) => {
    let map: Record<string, number> = {}
    for (let n of numbers) map[n] = (map[n] ?? 0) + 1
    return Object.values(map)
  }

  for (let value = lowestNumber; value <= highestNumber; value++) {
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