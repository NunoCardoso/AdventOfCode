import { Params } from 'aoc.d'
import { Combination, Permutation } from 'js-combinatorics'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  const part2: number = 0

  const connections: Set<string> = new Set()
  const keyMap: Map<string, number> = new Map()
  for await (const line of lineReader) {
    const [left, right] = line.split(': ')
    if (!keyMap.has(left)) keyMap.set(left, 1)
    else keyMap.set(left, keyMap.get(left)! + 1)
    right.split(' ').forEach((val: string) => {
      if (!connections.has(left + '>' + val) || !connections.has(val + '>' + left)) {
        connections.add(left + '>' + val)
      }
      if (!keyMap.has(val)) keyMap.set(val, 1)
      else keyMap.set(val, keyMap.get(val)! + 1)
    })
  }

  /* const fetchAllConnections = (data: Map<string, Array<string>>, key: string, collected: Set<string>) => {
    collected.add(key)
    data.get(key)!.forEach(moreKey => {
      if (!collected.has(moreKey)) fetchAllConnections(data, moreKey, collected)
    })
  } */

  /* const getNumberOfGroups = (data: Map<string, Array<string>>): number => {
    let groups: Record<string, Array<string>> = {}
    let keys: Array<string> = Array.from(data.keys())
    while (keys.length > 0) {
      let key = keys.splice(-1)[0]
      log.debug('fetching for key', key)
      let collected = new Set<string>()
      fetchAllConnections(data, key, collected)
      log.debug('got', collected)
      for (let i = keys.length - 1; i >= 0; i--) {
        if (collected.has(keys[i])) {
          keys.splice(i, 1)
        }
      }
      log.debug('keys pool is now', keys)
      groups[key] = Array.from(collected)
    }
    return Object.keys(groups).length
  } */

  const solve = (
    group1: Array<Array<string>>,
    group2: Array<Array<string>>,
    keys: Array<string>,
    connections: Set<string>,
    leftoverConnections: number
  ) => {
    let gr
  }

  const solveFor = (): number => {
    // which keys have only one connection? they should each belong to one of the groups
    const keys: Array<string> = Array.from(keyMap.keys())
    const singleKeys: Array<string> = keys.filter((a) => keyMap.get(a) === 1)
    const group1: Array<string> = [singleKeys[0]]
    const group2: Array<string> = [singleKeys[1]]

    const answer = solve([group1], [group2], keys, connections, 3)

    return answer.group1.length * answer.group2.length
  }

  if (!params.skipPart1) {
    part1 = solveFor()
  }
  if (!params.skipPart2) {
    // part2 = solveFor()
  }

  return { part1, part2 }
}

/*
*
    // I will randomly remove 3 connections, but not the ones that are tied to the singles
    /*let connectionsWeCanPermutateAndDelete: Array<string> = []
    let protectedConnections: Array<string> = []
    connections.forEach(el => {
      let found = false
      singleKeys.forEach(key => {
        if (el.startsWith(key + '>') || el.endsWith('>' + key)) found = true
      })
      if (!found) connectionsWeCanPermutateAndDelete.push(el)
      else protectedConnections.push(el)
    }) */

/* new Combination(connectionsWeCanPermutateAndDelete, 3).toArray().forEach((combination: Array<string>) => {
  let _connections: Array<string> = protectedConnections.slice().concat(
    connectionsWeCanPermutateAndDelete.filter(key => !combination.includes(key)))
    let groups: Record<string, Array<string>> = {}
    let keys: Set<string> = new Set(keyMap.keys())
  // I will fill groups with keys, and remove keys
  // I should have 2 groups and no keys left
    singleKeys.forEach(singleKey => {
      solve(groups,singleKey, keys, _connections)
    })

  */
