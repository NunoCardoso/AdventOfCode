import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let towels: string[] | undefined = undefined
  let newTowels: string[] = []
  for await (const line of lineReader) {
    if (line.length > 0) {
      if (!towels) towels = line.split(', ')
      else newTowels.push(line.trim())
    }
  }

  const isItPossible = (towel: string, towelPatterns: string[], cache: Record<string, boolean>): boolean => {
    // return cache if found
    if (Object.prototype.hasOwnProperty.call(cache, towel)) return cache[towel]
    let result = towelPatterns.some((pattern) => {
      if (towel.startsWith(pattern)) {
        let remaining = towel.substring(pattern.length, towel.length)
        return remaining.length === 0 ? true : isItPossible(remaining, towelPatterns, cache)
      }
      return false
    })
    cache[towel] = result
    return result
  }

  const inHowManyWays = (towel: string, towelPatterns: string[], cache: Record<string, number>): number => {
    // return cache if found
    if (Object.prototype.hasOwnProperty.call(cache, towel)) return cache[towel]
    let result = towelPatterns.reduce((acc, pattern) => {
      if (towel.startsWith(pattern)) {
        let remaining = towel.substring(pattern.length, towel.length)
        return acc + (remaining.length === 0 ? 1 : inHowManyWays(remaining, towelPatterns, cache))
      }
      return acc
    }, 0)
    cache[towel] = result
    return result
  }

  if (!params.skipPart1) {
    part1 = newTowels.reduce((acc, towel) => acc + (isItPossible(towel, towels!, {}) ? 1 : 0), 0)
  }

  if (!params.skipPart2) {
    part2 = newTowels.reduce((acc, towel) => acc + inHowManyWays(towel, towels!, {}), 0)
  }

  return { part1, part2 }
}
