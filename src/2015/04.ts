import { Params } from 'aoc.d'
const SparkMD5 = require('spark-md5')

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0
  let iteration: number = 0
  let hash: string

  while (part1 === 0 || part2 === 0) {
    hash = SparkMD5.hash(params.secretKey + iteration)
    if (hash.startsWith(params.secondCutoff) && part2 === 0) part2 = iteration
    if (hash.startsWith(params.firstCutoff) && part1 === 0) part1 = iteration
    iteration++
  }

  return { part1, part2 }
}
