import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0; let part2: number = 0

  for await (const line of lineReader) {
    const vals: Array<number> = line.split('x').map((s: string) => parseInt(s))
    const w: number = vals[0] * vals[1]
    const h: number = vals[0] * vals[2]
    const d: number = vals[1] * vals[2]
    const totalPaper: number = 2 * w + 2 * h + 2 * d + _.min([w, h, d])!
    vals.sort((a, b) => a - b)
    const totalRibbon: number = 2 * vals[0] + 2 * vals[1] + vals[0] * vals[1] * vals[2]
    part1 += totalPaper
    part2 += totalRibbon
  }

  return { part1, part2 }
}
