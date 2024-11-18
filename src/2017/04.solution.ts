import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {

  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const values = line.split(/\s+/g)
    const values2 = values.map((word: string) =>
        word.split('')
        .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0) > 0 ? 1 : -1)
        .join('')
      )

    part1 += values.length === new Set(values).size ? 1 : 0
    part2 += values2.length === new Set(values2).size ? 1 : 0
  }

  return { part1, part2 }
}
