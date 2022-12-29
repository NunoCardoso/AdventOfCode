import { Params } from '../../aoc.d'

export default async (lineReader: any, params: Params) => {
  let index: number = 0
  const res: Array<number> = []

  for await (const line of lineReader) {
    line === ''
      ? index++
      : !res[index] ? res[index] = parseInt(line) : res[index] += parseInt(line)
  }

  res.sort((a: number, b: number) => b - a)

  return {
    part1: res[0],
    part2: res[0] + res[1] + res[2]
  }
}
