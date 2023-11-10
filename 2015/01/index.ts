import { Params } from 'aoc.d'
export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    line.split('').forEach((it: string, i: number) => {
      if (part1 === -1 && part2 === 0) {
        part2 = i
      }
      if (it === '(') {
        part1++
      }
      if (it === ')') {
        part1--
      }
    })
  }

  return { part1, part2 }
}
