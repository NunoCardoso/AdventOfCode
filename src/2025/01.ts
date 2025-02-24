import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let value = params.initialValue
  let newValue: number

  for await (const line of lineReader) {
    let [direction, amount]: [string, number] = [line[0], +line.substring(1, line.length)]

    part2 += Math.floor(amount / params.numberOfPositions)
    let moddedAmount = amount % params.numberOfPositions
    if (direction === 'L') {
      newValue = (value + params.numberOfPositions - moddedAmount) % params.numberOfPositions
      if (newValue > value && value !== 0) part2++
    } else {
      newValue = (value + params.numberOfPositions + moddedAmount) % params.numberOfPositions
      if (newValue < value && newValue !== 0) part2++
    }
    if (newValue === 0) {
      part1++
      part2++
    }
    value = newValue
  }

  return { part1, part2 }
}
