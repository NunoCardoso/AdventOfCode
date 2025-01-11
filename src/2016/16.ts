import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: string = ''

  const getHash = (h: string): string =>
    `${h}0${h
      .split('')
      .reverse()
      .map((x: string) => (x === '1' ? '0' : '1'))
      .join('')}`

  const getChecksum = (hash: string): string => {
    while (hash.length % 2 === 0) {
      let newHash = ''
      for (let i = 0; i < hash.length; i += 2) {
        newHash += hash[i] === hash[i + 1] ? '1' : '0'
      }
      hash = newHash
    }
    return hash
  }

  const solveFor = (hash: string, size: number) => {
    while (hash.length < size) hash = getHash(hash)
    return getChecksum(hash.substring(0, size))
  }

  if (!params.skipPart1) part1 = solveFor(params.input, params.size.part1)
  if (!params.skipPart2) part2 = solveFor(params.input, params.size.part2)

  return { part1, part2 }
}
