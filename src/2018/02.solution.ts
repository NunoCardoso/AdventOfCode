import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: string = ''

  let threes = 0, twos = 0
  let seenKeys: string[] = []

  const doMatch = (key1: string, key2: string) =>
    key1.split('').filter((c, i) => c !== key2[i]).length <= 1

  const commonLetters = (found: string, key: string) =>
    found.split('').filter((c, i) => c === key[i]).join('')

  const checkID = (seenKeys: string[], key: string) => {
    let found = seenKeys.find(s => doMatch(s, key))
    return found ? commonLetters(found, key) : undefined
  }

  for await (const line of lineReader) {
    const values: string[] = line.split('').sort().join('').match(/(.)\1*/g)
    if (values.some(value => value.length === 3)) threes++
    if (values.some(value => value.length === 2)) twos++
    if (!part2) {
      let foundID = checkID(seenKeys, line)
      if (foundID) part2 = foundID
    }
    seenKeys.push(line)
  }

  part1 = threes * twos

  return { part1, part2 }
}
