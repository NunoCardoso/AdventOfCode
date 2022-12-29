import { Params } from '../../aoc.d'

export default async (lineReader: any, params: Params) => {
  const target : Record<string, number> = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
  }

  let part1: number = 0; let part2: number = 0

  for await (const line of lineReader) {
    const m = line.match(/^Sue (\d+): (.*)$/)
    let stuffMatchesForPart1 = true
    let stuffMatchesForPart2 = true
    m[2].split(', ').forEach((el: string) => {
      const els = el.split((': '))
      if (target[els[0]] !== parseInt(els[1])) {
        stuffMatchesForPart1 = false
      }
      switch (els[0]) {
        case 'cats':
        case 'trees':
          if (target[els[0]] >= parseInt(els[1])) {
            stuffMatchesForPart2 = false
          }
          break
        case 'pomeranians':
        case 'goldfish':
          if (target[els[0]] <= parseInt(els[1])) {
            stuffMatchesForPart2 = false
          }
          break
        default:
          if (target[els[0]] !== parseInt(els[1])) {
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
