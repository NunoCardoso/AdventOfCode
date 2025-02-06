import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const [range, letter, password] = line.split(' ')
    const rangeBits = range.split('-').map(Number)
    let hash: Record<string, number> = {}
    password.split('').forEach((char: string) => (hash[char] = (hash[char] ?? 0) + 1))
    if (hash[letter[0]] >= rangeBits[0] && hash[letter[0]] <= rangeBits[1]) part1++
    if (
      (letter[0] === password[rangeBits[0] - 1] && letter[0] !== password[rangeBits[1] - 1]) ||
      (letter[0] !== password[rangeBits[0] - 1] && letter[0] === password[rangeBits[1] - 1])
    )
      part2++
  }

  return { part1, part2 }
}
