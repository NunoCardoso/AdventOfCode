import { Params } from 'aoc.d'
import { intersect } from 'util/array'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const letterIndexes: string = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let elfNumber: number = 0

  let groups: string[] = []

  for await (const line of lineReader) {
    const left: string[] = line.slice(0, line.length / 2).split('')
    const right: string[] = line.slice(line.length / 2, line.length).split('')
    part1 += letterIndexes.indexOf(intersect(left, right)[0])
    if (elfNumber++ % 3 !== 2) groups.push(line)
    else {
      part2 += letterIndexes.indexOf(intersect(groups[0].split(''), intersect(groups[1].split(''), line.split('')))[0])
      groups = []
    }
  }

  return { part1, part2 }
}
