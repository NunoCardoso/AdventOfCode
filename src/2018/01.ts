import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number | undefined

  let changes: number[] = []
  for await (const line of lineReader) {
    part1 += +line
    changes.push(+line)
  }

  let result = 0
  let iterations = 0
  let seenFrequencies: Set<number> = new Set()

  while (part2 === undefined) {
    result += changes[iterations++ % changes.length]
    if (!seenFrequencies.has(result)) seenFrequencies.add(result)
    else part2 = result
  }
  return { part1, part2 }
}
