import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const words = line.split(/\s+/g)
    const words2 = words.map((word: string) => word.split('').sort().join(''))
    part1 += words.length === new Set(words).size ? 1 : 0
    part2 += words2.length === new Set(words2).size ? 1 : 0
  }

  return { part1, part2 }
}
