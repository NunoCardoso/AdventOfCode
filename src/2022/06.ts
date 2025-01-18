import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const solveFor = (char: string[], length: number): number => {
    for (let i = length; i < char.length; i++) if (new Set(char.slice(i - length, i)).size === length) return i
    return 0
  }

  let char: string[] = []
  for await (const line of lineReader) char = line.split('')

  part1 = solveFor(char, params!.size.part1)
  part2 = solveFor(char, params!.size.part2)

  return { part1, part2 }
}
