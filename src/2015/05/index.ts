import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    if (params.skip !== true && params.skip !== 'part1') {
      const vowelsNumber = line.match(/[aeiou]/g)?.length ?? 0
      const duplicates = line.match(/(.)\1/g)?.length ?? 0
      const forbiddenStrings = line.match(/(ab|cd|pq|xy)/)?.length ?? 0
      if (vowelsNumber >= 3 && duplicates >= 1 && forbiddenStrings === 0) {
        part1++
      }
    }
    if (params.skip !== true && params.skip !== 'part2') {
      const duplicates2 = line.match(/(..).*\1/g)?.length ?? 0
      const letterWith1distance = line.match(/(.).\1/g)?.length ?? 0
      if (duplicates2 > 0 && letterWith1distance > 0) {
        part2++
      }
    }
  }

  return { part1, part2 }
}
