import { Params } from 'aoc.d'
const SparkMD5 = require('spark-md5')

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  log.info('This will take some time, MD5 puzzle')

  let part1: number = 0
  let part2: number = 0
  let i: number = 0

  while (part2 === 0) {
    const res: string = SparkMD5.hash(params.secretKey + i)
    if (res.startsWith(params.secondCutoff)) {
      if (part2 === 0) {
        part2 = i
      }
    }
    if (res.startsWith(params.firstCutoff)) {
      if (part1 === 0) {
        part1 = i
      }
    }
    i++
  }

  return { part1, part2 }
}
