import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const m = line.match(/^Sue (\d+): (.*)$/)
    let stuffMatchesForPart1 = true
    let stuffMatchesForPart2 = true

    m[2].split(', ').forEach((el: string) => {
      const els = el.split(': ')
      const target = params.target[els[0]]
      const value = parseInt(els[1])
      if (target !== value) {
        stuffMatchesForPart1 = false
      }
      switch (els[0]) {
        case 'cats':
        case 'trees':
          if (target >= value) {
            stuffMatchesForPart2 = false
          }
          break
        case 'pomeranians':
        case 'goldfish':
          if (target <= value) {
            stuffMatchesForPart2 = false
          }
          break
        default:
          if (target !== value) {
            stuffMatchesForPart2 = false
          }
      }
    })
    if (stuffMatchesForPart1) {
      part1 = parseInt(m[1])
    }
    if (stuffMatchesForPart2) {
      part2 = parseInt(m[1])
    }
  }

  return { part1, part2 }
}
