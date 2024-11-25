import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let groupLevel: number = 0
  let inGarbage: boolean = false
  let inCancelMode: boolean = false
  for await (const line of lineReader) {
    line.split('').forEach((char: string) => {
      // ignore next character after cancel mode on
      if (inCancelMode) {
        inCancelMode = false
        return
      }
      // turn on cancel mode on
      if (char === '!') {
        inCancelMode = true
        return
      }
      // close garbage
      if (char === '>' && inGarbage) {
        inGarbage = false
        return
      }
      // open garbage
      if (char === '<') {
        inGarbage ? part2++ : (inGarbage = true)
        return
      }
      // ignore stuff inside garbage
      if (inGarbage) {
        part2++
        return
      }
      // all these are outside garbage
      if (char === '{') groupLevel++
      if (char === '}') {
        part1 += groupLevel
        groupLevel--
      }
    })
  }

  return { part1, part2 }
}
