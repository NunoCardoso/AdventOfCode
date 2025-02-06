import { Params } from 'aoc.d'
import { intersect } from 'util/array'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let tempGroupPart1: Set<string> | undefined = undefined
  let tempGroupPart2: Set<string> | undefined = undefined

  for await (const line of lineReader) {
    if (line.length === 0) {
      part1 += tempGroupPart1?.size ?? 0
      part2 += tempGroupPart2?.size ?? 0
      tempGroupPart2 = undefined
      tempGroupPart1 = undefined
    } else {
      if (tempGroupPart1 === undefined || tempGroupPart2 === undefined) {
        tempGroupPart1 = new Set<string>()
        tempGroupPart2 = new Set<string>()
        line.split('').forEach((char: string) => {
          tempGroupPart1?.add(char)
          tempGroupPart2?.add(char)
        })
      } else {
        let chars: string[] = line.split('')
        chars.forEach((char: string) => tempGroupPart1?.add(char))
        tempGroupPart2 = new Set(intersect(chars, [...tempGroupPart2]))
      }
    }
  }

  return { part1, part2 }
}
