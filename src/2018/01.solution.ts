import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number | undefined

  let changes: number[] = []
  let seenFrequencies: number[] = [0]
  let index = 0
  let result = 0

  let checkPart2 = () => {
    result += changes[index % changes.length]
    if (!seenFrequencies.includes(result)) {
      seenFrequencies.push(result)
    } else {
      part2 = result
    }
    index++
  }

  for await (const line of lineReader) {
    const value = Number(line)
    part1 += value
    changes.push(value)
    checkPart2()
  }

  while (part2 === undefined) {
    checkPart2()
  }

  return { part1, part2 }
}
