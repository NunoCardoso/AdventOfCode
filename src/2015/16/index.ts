import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const [, sue, stuff] = line.match(/^Sue (\d+): (.*)$/)
    let stuffMatchesForPart1 = true
    let stuffMatchesForPart2 = true

    stuff.split(', ').forEach((condition: string) => {
      const [name, value] = condition.split(': ')
      if (params.target[name] !== +value) {
        stuffMatchesForPart1 = false
      }
      switch (name) {
        case 'cats':
        case 'trees':
          if (params.target[name] >= +value) {
            stuffMatchesForPart2 = false
          }
          break
        case 'pomeranians':
        case 'goldfish':
          if (params.target[name] <= +value) {
            stuffMatchesForPart2 = false
          }
          break
        default:
          if (params.target[name] !== +value) {
            stuffMatchesForPart2 = false
          }
      }
    })
    if (stuffMatchesForPart1) {
      part1 = +sue
    }
    if (stuffMatchesForPart2) {
      part2 = +sue
    }
  }

  return { part1, part2 }
}
