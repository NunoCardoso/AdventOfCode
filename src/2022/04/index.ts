import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const pairs = line.split(',')
    const pairs0: Array<number> = pairs[0].split('-').map(Number)
    const pairs1: Array<number> = pairs[1].split('-').map(Number)
    if (params.part1?.skip !== true) {
      if (
        (pairs0[0] <= pairs1[0] && pairs0[1] >= pairs1[1]) ||
        (pairs1[0] <= pairs0[0] && pairs1[1] >= pairs0[1])
      ) {
        part1++
      }
    }
    if (params.part2?.skip !== true) {
      const array0 = _.range(pairs0[0], pairs0[1] + 1)
      const array1 = _.range(pairs1[0], pairs1[1] + 1)
      if (_.intersection(array0, array1)?.length > 0) {
        part2++
      }
    }
  }

  return { part1, part2 }
}
