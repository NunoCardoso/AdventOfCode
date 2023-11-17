import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let input = params.input

  for (let i = 1; i <= Math.max(params.limit.part1, params.limit.part2); i++) {
    // matches a char, plus a 0-n number of same char, g repeats to all
    const seq: Array<string> = input.match(/(.)\1*/g)
    const res: string = _.reduce(seq, (memo, val) => memo + val.length + val[0], '')
    if (i % params.limit.part1 === 0) {
      part1 = res.length
    }
    if (i % params.limit.part2 === 0) {
      part2 = res.length
    }
    input = res
  }

  return { part1, part2 }
}
