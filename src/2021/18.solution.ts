import { Params } from 'aoc.d'
import { Combination, Permutation } from 'js-combinatorics'

export const reducer = (s: string): string => {
  let newS = s
  do {
    s = newS
    newS = reduce(s)
  } while (s !== newS)
  return s
}

export const sum = (numbers: string[], doReduce = true): string => {
  if (numbers.length === 1) {
    return doReduce ? reducer(numbers[0]) : numbers[0]
  }
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
  let i: number = 0

  let explodableBits: boolean = explodable(bits)

  while (i < bits.length) {
    if (bits[i] === '[') {
      level++
      i++
      continue
    }
    if (bits[i] === ']') {
      level--
      i++
      continue
    }

    if (bits[i] === ',') {
      i++
      continue
    }
    // we are a number
    let number = +bits[i]

    // do split
    if (!explodableBits && number >= 10) {
      // remove the number, replace with split
      bits.splice(i, 1, '[', Math.floor(number / 2).toString(), ',', Math.ceil(number / 2).toString(), ']')
      return bits.join('')
    }

    if (level <= 4) {
      i++
      continue
    }

    // if we are a number followed by a comma, we are a left number
    if (bits[i + 1] === ',') {
      // reduce the left number only if we are on the top level
      if (bits[i + 2].match(/\d+/)) {
        for (var j = i - 1; j >= 0; j--) {
          if (bits[j].match(/\d+/)) {
            bits[j] = (+bits[j] + number).toString()
            break
          }
        }
        bits.splice(i - 1, 3, '0') // remove '[', 'number' and 'comma', add a '0'
        continue
      }

      // if not on top, skip reduce, jump the 'number', 'comma', '[' (3 positions)
      i += 3
      continue
    }

    // we are a right number
    bits.splice(i, 2) // remove this number, ],
    level--

    for (var j = i; j < bits.length; j++) {
      if (bits[j].match(/\d+/)) {
        bits[j] = (+bits[j] + number).toString()
        break
      }
    }

    return bits.join('')
  }
  return bits.join('')
}

export const magnitude = (s: number | string | [any, any]): number => {
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

  new Permutation(instructions, 2).toArray().forEach((c) => {
    let mag = magnitude(sum(c))
    log.debug('mag', mag, 'for', c)
    if (mag > part2) part2 = mag
  })

  return { part1, part2 }
}
