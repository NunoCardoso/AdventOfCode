import { Params } from 'aoc.d'
import * as console from 'console'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getNewOpened = (opened: number[], collected: Set<number>) => {
    let newOpened: Set<number> = new Set()
    opened.forEach((o) => {
      tree[o].forEach((o2) => {
        if (!collected.has(o2)) {
          newOpened.add(o2)
          collected.add(o2)
        }
      })
    })
    return [...newOpened]
  }

  const solveFor = (programId: number): Set<number> => {
    const collected: Set<number> = new Set()
    let opened = tree[programId]
    while (opened.length > 0) opened = getNewOpened(opened, collected)
    return collected
  }

  let tree: Record<number, number[]> = {}

  for await (const line of lineReader) {
    const [, s, target] = line.match(/(\d+) <-> (.+)/)
    let source = +s
    target
      .split(', ')
      .map(Number)
      .forEach((val: number) => {
        if (!tree[source]) tree[source] = [val]
        else tree[source].push(val)
        if (!tree[val]) tree[val] = [source]
        else tree[val].push(source)
      })
  }

  part1 = solveFor(0).size

  let uncollected = Object.keys(tree).map(Number)
  let groups: number[] = []
  while (uncollected.length > 0) {
    let seed = uncollected.shift()!
    groups.push(seed)
    let collected = solveFor(seed)
    uncollected = uncollected.filter((program) => !collected.has(program))
  }
  part2 = groups.length

  return { part1, part2 }
}
