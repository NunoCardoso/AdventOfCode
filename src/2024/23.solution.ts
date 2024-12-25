import { Params } from 'aoc.d'
import { Combination } from 'js-combinatorics'

type Data = {
  biggestGraph: string[]
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

  const solveFor = (connections: Map<string, string[]>): number => {
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

  const getConnectedNetworksFor = (network: string[], connections: Map<string, string[]>, connectionSet: Set<string>): string[][] => {
    let newNetworks: string[][] = []
    let head = network[network.length - 1]
    // find connection stubs for other non-network computers
    let candidateComputers = connections.get(head)!.filter((s) => !network.includes(s))

    log.debug('for computer', head, 'got candidate connections', candidateComputers)
    candidateComputers.forEach((candidateComputer) => {
      if (network.every((computer) => connectionSet.has(computer + '-' + candidateComputer))) {
        newNetworks.push([...network, candidateComputer])
      }
    })
    return newNetworks
  }

  const getKey = (network: string[]) => network.sort((a, b) => a.localeCompare(b)).join(',')
  const doDepthFirst = (opened: string[][], connections: Map<string, string[]>, connectionSet: Set<string>, cache: Record<string, boolean>, data: Data) => {
    let network = opened.splice(-1)[0]
    let networkKey = getKey(network)
    log.debug('=== depth === opened.length, ', opened.length, 'network', network)
    if (network.length > data.biggestGraph.length) {
      log.debug('found a bigger one', network)
      data.biggestGraph = network
    }
    if (cache[networkKey] !== undefined) return cache[networkKey]
    let newConnections = getConnectedNetworksFor(network, connections, connectionSet)
    log.debug('new Connections', newConnections)
    if (newConnections.length === 0) {
      cache[networkKey] = false
      return false
    }
    newConnections.forEach((newNetwork) => {
      doDepthFirst([...opened, newNetwork], connections, connectionSet, cache, data)
    })
  }

  const solveForPart2 = (): string => {
    // Get a list of A connections (where B and C exist). Check if B and C are connected
    let data: Data = {
      biggestGraph: []
    }
    const cache: Record<string, any> = {}
    ;[...computerSet].forEach((computer: string) => {
      let opened: string[][] = [[computer]]
      log.info('checking', computer)
      while (opened.length > 0) {
        doDepthFirst(opened, connections, connectionSet, cache, data)
      }
    })
    return data.biggestGraph.sort((a, b) => a.localeCompare(b)).join(',')
  }

  if (!params.skipPart1) {
    part1 = solveFor(connections)
  }
  if (!params.skipPart2) {
    part2 = solveForPart2()
  }

  return { part1, part2 }
}
