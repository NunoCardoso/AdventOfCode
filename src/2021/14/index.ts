import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const rules: Record<string, string> = {}
  let mainCounter: Record<string, number> = {}
  let seed: string

  for await (const line of lineReader) {
    const m = line.match(/(.+) -> (.+)/)
    if (m) {
      rules[m[1]] = m[2]
    } else {
      if (line.length > 0) {
        seed = line
        for (let i = 0; i < line.length - 1; i++) {
          const letters = line[i] + line[i + 1]
          mainCounter[letters] = (mainCounter[letters] ?? 0) + 1
        }
      }
    }
  }

  const countSize = (subCounter: Record<string, number>): number => {
    return Object.values(subCounter).reduce((x, y) => x + y, 0)
  }

  const countDifference = (subCounter: Record<string, number>) => {
    const c = Object.values(subCounter).sort((a, b) => (a - b < 0 ? 1 : -1))
    return (c[0] - c[c.length - 1]) / 2
  }

  let it = 1
  const maxIterations = Math.max(params.iterations.part1, params.iterations.part2)

  while (it <= maxIterations) {
    const newMainCounter: Record<string, number> = {}
    const newSubCounter: Record<string, number> = {}

    let keys = Object.keys(mainCounter)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const newLetter = rules[key]
      if (newLetter) {
        let polymer = key[0] + newLetter
        newMainCounter[polymer] = (newMainCounter[polymer] ?? 0) + mainCounter[key]
        polymer = newLetter + key[1]
        newMainCounter[polymer] = (newMainCounter[polymer] ?? 0) + mainCounter[key]
      }
    }

    keys = Object.keys(newMainCounter)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      newSubCounter[key[0]] = (newSubCounter[key[0]] ?? 0) + newMainCounter[key]
      newSubCounter[key[1]] = (newSubCounter[key[1]] ?? 0) + newMainCounter[key]
    }

    // every letter count is doubled except the edges, so let's add and slice in half
    newSubCounter[seed[0]] += 1
    newSubCounter[seed[seed.length - 1]] += 1

    mainCounter = newMainCounter

    if (it === params.iterations.part1) {
      part1 = countDifference(newSubCounter)
    }
    if (it === params.iterations.part2) {
      part2 = countDifference(newSubCounter)
    }

    log.debug('It', it, 'length', countSize(newSubCounter), 'diff', countDifference(newSubCounter))
    it++
  }

  return { part1, part2 }
}
