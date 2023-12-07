import { Params } from 'aoc.d'
import _ from 'lodash'
const SparkMD5 = require('spark-md5')

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  log.info('This will take some time, MD5 puzzle')

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

  const doIt = (md5Generator: (s: string) => string) => {
    const keys: Array<number> = []
    let it = 0
    const memory: Record<string, Array<number>> = {}

    while (keys.length < params.cutoff) {
      const key = md5Generator(params.salt + it)

      const reps: Array<number> = keyHas5repetitions(key)
      if (reps.length > 0) {
        reps.forEach((rep) => {
          memory[rep] = _.filter(memory[rep], (n: number) => it - n < params.viewAhead).sort((a, b) => a - b)
          keys.push(...memory[rep])
          keys.sort((a, b) => a - b)
        })
      }
      const m = keyHas3repetitions(key)
      if (m) {
        if (!memory[m]) {
          memory[m] = []
        }
        memory[m].push(it)
      }
      it++
    }
    return keys
  }
  if (params.skip !== true && params.skip !== 'part1') {
    part1 = doIt(generateMd5Part1)[params.cutoff - 1]
  }
  if (params.skip !== true && params.skip !== 'part2') {
    part2 = doIt(generateMd5Part2)[params.cutoff - 1]
  }

  return { part1, part2 }
}
