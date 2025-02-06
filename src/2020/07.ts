import { Params } from 'aoc.d'

type BagAndAmount = [number, string]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let bagContains: Record<string, BagAndAmount[]> = {}
  let bagContainedBy: Record<string, string[]> = {}
  for await (const line of lineReader) {
    let [, left, right] = line.match(/(.+) bags contain (.+)\./)
    if (!bagContains[left]) bagContains[left] = []
    if (right === 'no other bags') {
      bagContains[left].push([0, ''])
    } else {
      right.split(', ').forEach((bagString: string) => {
        let [, number, bag] = bagString.match(/(\d+) (.+) bags?/)!
        bagContains[left].push([+number, bag])
        if (!bagContainedBy[bag]) bagContainedBy[bag] = []
        bagContainedBy[bag].push(left)
      })
    }
  }

  const solveForPart2 = ([, bag]: BagAndAmount): number =>
    bagContains[bag]?.reduce((acc, item) => acc + item[0] * (1 + solveForPart2(item)), 0) ?? 1

  const solveForPart1 = (bag: string, values: Set<string>) =>
    bagContainedBy[bag]?.forEach((b) => {
      values.add(b)
      solveForPart1(b, values)
    })

  let values: Set<string> = new Set<string>()
  solveForPart1('shiny gold', values)
  part1 = values.size
  part2 = solveForPart2([0, 'shiny gold'])

  return { part1, part2 }
}
