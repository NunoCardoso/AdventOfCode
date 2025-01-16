import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const countDifference = (polymerTemplate: Record<string, number>, seed: string) => {
    const letterCounter: Record<string, number> = {}
    for (let key of Object.keys(polymerTemplate)) {
      letterCounter[key[0]] = (letterCounter[key[0]] ?? 0) + polymerTemplate[key]
      letterCounter[key[1]] = (letterCounter[key[1]] ?? 0) + polymerTemplate[key]
    }

    // every letter count is doubled except the edges, so let's add the "missing" counts
    // so we can divide by 2 and get the right counts.
    letterCounter[seed[0]] += 1
    letterCounter[seed[seed.length - 1]] += 1
    const counts = Object.values(letterCounter).sort((a, b) => b - a)
    return (counts[0] - counts[counts.length - 1]) / 2
  }

  const insertionRules: Record<string, string> = {}
  let polymerTemplate: Record<string, number> = {}
  let seed: string = ''

  for await (const line of lineReader) {
    if (!!line) {
      if (!seed) {
        seed = line
        for (let i = 0; i < line.length - 1; i++) {
          const pairOfLetters = line[i] + line[i + 1]
          polymerTemplate[pairOfLetters] = (polymerTemplate[pairOfLetters] ?? 0) + 1
        }
      } else {
        const [, left, right] = line?.match(/(.+) -> (.+)/)
        insertionRules[left] = right
      }
    }
  }

  let iterations = 0
  const maxIterations = Math.max(params.iterations.part1, params.iterations.part2)

  while (++iterations <= maxIterations) {
    const newPolymerTemplate: Record<string, number> = {}
    for (let key of Object.keys(polymerTemplate)) {
      const newLetter = insertionRules[key]
      if (newLetter) {
        let polymer = key[0] + newLetter
        newPolymerTemplate[polymer] = (newPolymerTemplate[polymer] ?? 0) + polymerTemplate[key]
        polymer = newLetter + key[1]
        newPolymerTemplate[polymer] = (newPolymerTemplate[polymer] ?? 0) + polymerTemplate[key]
      }
    }
    polymerTemplate = newPolymerTemplate
    if (iterations === params.iterations.part1) part1 = countDifference(polymerTemplate, seed)
    if (iterations === params.iterations.part2) part2 = countDifference(polymerTemplate, seed)
  }

  return { part1, part2 }
}
