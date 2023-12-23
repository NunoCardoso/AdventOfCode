import { Params } from 'aoc.d'
import { intersect } from 'util/arr'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0
  const letterIndexes: string = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let i: number = 0
  let groups: Array<string> = []

  for await (const line of lineReader) {
    const left: Array<string> = line.slice(0, line.length / 2).split('')
    const right: Array<string> = line.slice(line.length / 2, line.length).split('')
    if (!params.skipPart1) {
      part1 += letterIndexes.indexOf(intersect(left, right)[0])
    }
    if (!params.skipPart2) {
      if (i++ % 3 !== 2) groups.push(line)
      else {
        part2 += letterIndexes.indexOf(
          intersect(groups[0].split(''), intersect(groups[1].split(''), line.split('')))[0]
        )
        groups = []
      }
    }
  }

  return { part1, part2 }
}
