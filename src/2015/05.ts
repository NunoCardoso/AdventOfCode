import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    if (!params.skipPart1) {
      const vowelsNumber = line.match(/[aeiou]/g)?.length
      const duplicates = line.match(/(.)\1/g)?.length
      const forbiddenStrings = line.match(/(ab|cd|pq|xy)/)?.length
      if (vowelsNumber >= 3 && duplicates >= 1 && !forbiddenStrings) part1++
    }
    if (!params.skipPart2) {
      const doubleDuplicates = line.match(/(..).*\1/g)?.length
      const letterWith1Distance = line.match(/(.).\1/g)?.length
      if (doubleDuplicates > 0 && letterWith1Distance > 0) part2++
    }
  }

  return { part1, part2 }
}
