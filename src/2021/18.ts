import { Params } from 'aoc.d'
import { permutation } from 'util/permutation'

type SnailfishNumber = string | number | [SnailfishNumber, SnailfishNumber]

export const reducer = (s: string): string => {
  let newS = s
  do {
    s = newS
    newS = reduce(s)
  } while (s !== newS)
  return s
}

export const sum = (numbers: string[], doReduce = true): string => {
  if (numbers.length === 1) return doReduce ? reducer(numbers[0]) : numbers[0]
  if (numbers.length === 2) {
    let oldS = '[' + numbers[0] + ',' + numbers[1] + ']'
    return doReduce ? reducer(oldS) : oldS
  }
  return sum([sum(numbers.slice(0, 2), doReduce), ...numbers.slice(2, numbers.length)], doReduce)
}

export const explodable = (bits: string[]): boolean => {
  let level = 0
  for (var i = 0; i < bits.length; i++) {
    if (bits[i] === '[') level++
    if (bits[i] === ']') level--
    if (level > 4) return true
  }
  return false
}

export const reduce = (number: string) => {
  let bits: string[] = number.match(/(\[|\]|,|\d+)/g) ?? []
  let level: number = 0
  let cursor: number = 0

  let explodableBits: boolean = explodable(bits)

  while (cursor < bits.length) {
    if (bits[cursor] === '[') {
      level++
      cursor++
      continue
    }
    if (bits[cursor] === ']') {
      level--
      cursor++
      continue
    }
    if (bits[cursor] === ',') {
      cursor++
      continue
    }
    // we are a number
    let number = +bits[cursor]
    // do split, since we do not have explodes to do
    if (!explodableBits && number >= 10) {
      // remove the number, replace with split bits
      bits.splice(cursor, 1, '[', Math.floor(number / 2).toString(), ',', Math.ceil(number / 2).toString(), ']')
      return bits.join('')
    }
    if (level <= 4) {
      cursor++
      continue
    }
    // we are at level 4 and we need to explode.
    // we are a left number (number followed by a comma), so add the reminder leftwards.
    if (bits[cursor + 1] === ',') {
      // reduce the left number only if we are on the top level
      if (bits[cursor + 2].match(/\d+/)) {
        // search leftwards for the next number
        for (var j = cursor - 1; j >= 0; j--) {
          if (bits[j].match(/\d+/)) {
            bits[j] = (+bits[j] + number).toString()
            break
          }
        }
        // remove '[', 'number' and 'comma', add a '0'
        bits.splice(cursor - 1, 3, '0')
        continue
      }
      // if not on top, skip reduce by jumping the 'number', 'comma', '[' (3 positions)
      cursor += 3
      continue
    }
    // we are at level 4 and we need to explode.
    // we are a right number, so add the reminder rightwards
    bits.splice(cursor, 2) // remove  'number', ']',
    level--
    // search rightwards for the next number
    for (var j = cursor; j < bits.length; j++) {
      if (bits[j].match(/\d+/)) {
        bits[j] = (+bits[j] + number).toString()
        break
      }
    }
    return bits.join('')
  }
  return bits.join('')
}

export const magnitude = (s: SnailfishNumber): number => {
  if (typeof s === 'number') return s
  if (typeof s === 'string') return magnitude(JSON.parse(s))
  return 3 * magnitude(s[0]) + 2 * magnitude(s[1])
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let instructions = []
  for await (const line of lineReader) instructions.push(line)

  part1 = magnitude(sum(instructions))
  part2 = permutation(instructions, 2).reduce((acc, instructionPair) => {
    let mag = magnitude(sum(instructionPair))
    return mag > acc ? mag : acc
  }, 0)

  return { part1, part2 }
}
