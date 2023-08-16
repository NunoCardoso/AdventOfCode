import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  let map: Record<string, any> = {}
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    map = JSON.parse(line)
  }

  const recurse = (el: number | Array<number> | Record<string, any>, mode: string) => {
    let score: number = 0
    if (_.isNumber(el)) {
      score = el as number
    }
    if (_.isArray(el)) {
      score = _.reduce(el, (memo: number, el: any) => memo + recurse(el, mode), 0)
    }
    if (typeof el === 'object' && !(el instanceof Array)) {
      if (mode === 'part2' && _.find(Object.values(el), (v: string) => v === 'red')) {
        return 0
      }
      score = _.reduce(Object.keys(el), (memo: number, _el: any) => memo + recurse(el[_el], mode), 0)
    }
    return score
  }

  if (params.part1?.skip !== true) {
    part1 = recurse(map, 'part1')
  }
  if (params.part2?.skip !== true) {
    part2 = recurse(map, 'part2')
  }
  return {
    part1,
    part2
  }
}
