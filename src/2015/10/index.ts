import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let input = params.input
  const limit = Math.max(params.limit.part1, params.limit.part2)

  for (let i = 1; i <= limit; i++) {
    // matches a char, plus a 0-n number of same char, g repeats to all
    const seq: Array<string> = input.match(/(.)\1*/g)
    const res: string = seq.reduce((acc, val) => acc + val.length + val[0], '')
    if (i % params.limit.part1 === 0) {
      part1 = res.length
    }
    if (i % params.limit.part2 === 0) {
      part2 = res.length
    }
    input = res
  }

  return { part1, part2 }
}
