import { Params } from '../../aoc.d'
const MD5 = require('md5.js')

export default async (lineReader: any, params: Params) => {
  let part1: number = 0; let part2: number = 0
  let i: number = 0

  while (part2 === 0) {
    const hash: string = params.secretKey + i
    const res: string = new MD5().update('' + hash).digest('hex')
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
