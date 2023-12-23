import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let hash: string = params.input
  const limit = Math.max(params.limit.part1, params.limit.part2)

  for (let i = 1; i <= limit; i++) {
    // matches a char, plus a 0-n number of same char, g repeats to all
    const sequence: Array<string> = hash.match(/(.)\1*/g)!
    hash = sequence.reduce((acc, value) => acc + value.length + value[0], '')
    if (i % params.limit.part1 === 0) part1 = hash.length
    if (i % params.limit.part2 === 0) part2 = hash.length
  }

  return { part1, part2 }
}
