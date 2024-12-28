import { Params } from 'aoc.d'
import { Combination } from 'js-combinatorics'

type Data = {
  biggestGraph: string[]
}

export const doBronKerbosch = (
  R: string[],
  P: string[],
  X: string[],
  connectionSet: Set<string>,
  data: any = {
    longest: []
  }
): string[] | undefined => {
  if (P.length === 0 && X.length === 0 && R.length > data.longest.length) data.longest = R
  P.forEach((v) => {
    doBronKerbosch(
      R.concat(v),
      P.filter((v2) => connectionSet.has(v2 + '-' + v)),
      X.filter((v2) => connectionSet.has(v2 + '-' + v)),
      connectionSet,
      data
    )
    P = P.filter((_v) => _v !== v)
    X = X.concat(v)
  })
  return data.longest
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: string = ''

  let connections: Map<string, string[]> = new Map()
  let connectionSet = new Set<string>()
  let computerSet: Set<string> = new Set<string>()
  for await (const line of lineReader) {
    let computers = line.split('-')
    if (!connections.has(computers[0])) connections.set(computers[0], [])
    if (!connections.has(computers[1])) connections.set(computers[1], [])
    computerSet.add(computers[0])
    computerSet.add(computers[1])
    connections.get(computers[0])!.push(computers[1])
    connections.get(computers[1])!.push(computers[0])
    connectionSet.add(computers[0] + '-' + computers[1])
    connectionSet.add(computers[1] + '-' + computers[0])
  }

  const solveForPart1 = (connections: Map<string, string[]>): number => {
    // Get a list of A connections (where B and C exist). Check if B and C are connected
    let treeComputers: Set<string> = new Set()
    for (var [computerA, otherComputers] of connections.entries()) {
      new Combination(otherComputers, 2).toArray().forEach(([computerB, computerC]) => {
        if (connectionSet.has(computerB + '-' + computerC) && [computerA, computerB, computerC].some((c) => c.startsWith('t')))
          treeComputers.add([computerA, computerB, computerC].sort((a, b) => a.localeCompare(b)).join(','))
      })
    }
    return treeComputers.size
  }

  //https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
  const solveForPart2 = (): string =>
    doBronKerbosch([], [...computerSet], [], connectionSet)!
      .sort((a, b) => a.localeCompare(b))
      .join(',')

  if (!params.skipPart1) {
    part1 = solveForPart1(connections)
  }
  if (!params.skipPart2) {
    part2 = solveForPart2()
  }

  return { part1, part2 }
}
