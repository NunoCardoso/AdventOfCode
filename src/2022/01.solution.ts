import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let elfIndex: number = 0
  const calorieCount: Array<number> = []

  for await (const line of lineReader) {
    !line
      ? elfIndex++
      : !calorieCount[elfIndex]
        ? (calorieCount[elfIndex] = +line)
        : (calorieCount[elfIndex] += +line)
  }
  calorieCount.sort((a: number, b: number) => b - a)

  return {
    part1: calorieCount[0],
    part2: calorieCount[0] + calorieCount[1] + calorieCount[2]
  }
}
