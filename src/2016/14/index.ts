import { Params } from 'aoc.d'
const SparkMD5 = require('spark-md5')

export default async (lineReader: any, params: Params) => {
  //const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const generateMd5Part1 = (hash: string): string => SparkMD5.hash(hash)

  const generateMd5Part2 = (hash: string): string => {
    let _hash = SparkMD5.hash(hash)
    for (let i = 0; i < params.repetition; i++) {
      _hash = SparkMD5.hash(_hash)
    }
    return _hash
  }

  const keyHas3repetitions = (key: string) => key.match(/(.)\1\1/)?.[1]

  const keyHas5repetitions = (key: string) => [...key.matchAll(/(.)\1\1\1\1/g)].map((x: any) => x[1])

  const solveFor = (md5Generator: (s: string) => string) => {
    const keys: Array<number> = []
    let it = 0
    const memory: Map<string, Array<number>> = new Map()

    while (keys.length < params.cutoff) {
      const key = md5Generator(params.salt + it)

      keyHas5repetitions(key)?.forEach((rep) => {
        memory.set(
          rep,
          (memory.get(rep) ?? []).filter((n: number) => it - n < params.viewAhead).sort((a, b) => a - b)
        )
        keys.push(...memory.get(rep)!)
        keys.sort((a, b) => a - b)
      })

      const match = keyHas3repetitions(key)
      if (match) {
        if (!memory.has(match)) memory.set(match, [])
        memory.get(match)!.push(it)
      }
      it++
    }
    return keys
  }
  if (!params.skipPart1) {
    part1 = solveFor(generateMd5Part1)[params.cutoff - 1]
  }

  if (!params.skipPart2) {
    part2 = solveFor(generateMd5Part2)[params.cutoff - 1]
  }

  return { part1, part2 }
}
