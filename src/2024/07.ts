import { Params } from 'aoc.d'
import { CartesianProduct } from 'js-combinatorics'

type Entry = [number, number[]]
export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let entries: Entry[] = []
  for await (const line of lineReader) {
    const [sum, others] = line.split(': ')
    entries.push([+sum, others.split(' ').map(Number)])
  }

  let combinations = (length: number, operators: string) => new CartesianProduct(...new Array(length).fill(operators))

  const solveFor = (operators: string): number =>
    entries.reduce((acc, entry) => {
      var BreakException = {}
      try {
        combinations(entry[1].length - 1, operators)
          .toArray()
          .forEach((c) => {
            let value = entry[1].reduce((acc, val: number, index: number): any => {
              if (acc === null) return val
              if (c[index - 1] === '+') return acc + val
              if (c[index - 1] === '*') return acc * val
              if (c[index - 1] === '|') return Number('' + acc + val)
            }, null)
            if (value === entry[0]) {
              throw BreakException
            }
          })
      } catch (e) {
        return acc + entry[0]
      }
      return acc
    }, 0)

  if (!params.skipPart1) {
    part1 = solveFor('+*')
  }
  if (!params.skipPart2) {
    part2 = solveFor('+*|')
  }

  return { part1, part2 }
}
