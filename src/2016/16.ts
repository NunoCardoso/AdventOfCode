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

  const getChecksum = (h: string): string => {
    let _h = h
    while (_h.length % 2 === 0) {
      let __h = ''
      for (let i = 0; i < _h.length; i += 2) {
        __h += _h[i] === _h[i + 1] ? '1' : '0'
      }
      _h = __h
    }
    return _h
  }

  const solveFor = (hash: string, size: number) => {
    while (hash.length < size) hash = getHash(hash)
    return getChecksum(hash.substring(0, size))
  }

  if (!params.skipPart1) part1 = solveFor(params.input, params.size.part1)
  if (!params.skipPart2) part2 = solveFor(params.input, params.size.part2)

  return { part1, part2 }
}
