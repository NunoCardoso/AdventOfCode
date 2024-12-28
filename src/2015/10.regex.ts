import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let hash: string = params.input
  const limit = Math.max(params.limit.part1, params.limit.part2)

  for (let i = 1; i <= limit; i++) {
    // matches a char, plus a 0-n number of same char, g repeats to all

    //this one is 2s, so slower
    // hash = hash.replaceAll(/((\d)\2*)/g, (match) => `${match.length}${match[0]}`);

    hash = hash.match(/(.)\1*/g)!.reduce((acc, value) => acc + value.length + value[0], '')
    if (i === params.limit.part1) part1 = hash.length
    if (i === params.limit.part2) part2 = hash.length
  }

  return { part1, part2 }
}
