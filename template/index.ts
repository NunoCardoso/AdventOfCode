
import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const part1: number = 0; const part2: number = 0

  for await (const line of lineReader) {
    const val = line.split('')
    log.debug(val, _.sort([]))
  }

  return {
    part1,
    part2
  }
}
