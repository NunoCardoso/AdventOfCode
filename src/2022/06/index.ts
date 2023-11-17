import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const solveFor = (char: Array<string>, length: number) => {
    for (let i = length; i < char.length; i++) {
      const arr = char.slice(i - length, i)
      if (_.uniq(arr).length === length) {
        return i
      }
    }
  }

  let char: Array<string> = []

  for await (const line of lineReader) {
    char = line.split('')
  }

  return {
    part1: solveFor(char, params!.size.part1),
    part2: solveFor(char, params!.size.part2)
  }
}
