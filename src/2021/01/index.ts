import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const data: Array<number> = []

  for await (const line of lineReader) {
    data.push(parseInt(line))
  }

  const solveFor = (amount: number) => {
    let increases: number = 0
    data.forEach((val, index) => {
      if (index >= amount) {
        const val = data.slice(index - amount, index).reduce((x, y) => x + y, 0)
        const previousVal = data.slice(index - 1 - amount, index - 1).reduce((x, y) => x + y, 0)
        if (val > previousVal) {
          increases++
        }
      }
    })
    return increases
  }

  return {
    part1: solveFor(1),
    part2: solveFor(3)
  }
}
