import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const values: Array<number> = line.split('x').map(Number)
    const w: number = values[0] * values[1]
    const h: number = values[0] * values[2]
    const d: number = values[1] * values[2]
    const totalPaper: number = 2 * w + 2 * h + 2 * d + _.min([w, h, d])!
    values.sort((a, b) => a - b)
    const totalRibbon: number = 2 * values[0] + 2 * values[1] + values[0] * values[1] * values[2]
    part1 += totalPaper
    part2 += totalRibbon
  }

  return { part1, part2 }
}
