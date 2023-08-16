import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0
  const els: Array<string> = [
    '1',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]
  let i: number = 0
  let temp0: string = ''
  let temp1: string = ''

  for await (const line of lineReader) {
    const vals: Array<string> = line.split('')
    const val1: Array<string> = vals.slice(0, vals.length / 2)
    const val2: Array<string> = vals.slice(vals.length / 2, vals.length)
    if (params.part1?.skip !== true) {
      const commons: Array<string> = _.intersection(val1, val2)
      part1 += els.indexOf(commons[0])
    }
    if (params.part2?.skip !== true) {
      if (i % 3 === 0) {
        temp0 = line
      }
      if (i % 3 === 1) {
        temp1 = line
      }
      if (i % 3 === 2) {
        const commons: Array<string> = _.intersection(temp0.split(''), temp1.split(''), line.split(''))
        part2 += els.indexOf(commons[0])
      }
    }
    i++
  }

  return { part1, part2 }
}
