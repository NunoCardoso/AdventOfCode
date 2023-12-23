import { Params } from 'aoc.d'

interface NestedArray extends Array<NestedArray | number> {}

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })
  let part1: number = 0
  let part2: number = 0

  const data: Array<Array<string>> = []
  let lineNumber: number = 0
  let lineBuffer: Array<string> = []

  for await (const line of lineReader) {
    if (lineNumber++ % 3 !== 2) lineBuffer.push(line)
    else {
      data.push(lineBuffer)
      lineBuffer = []
    }
  }

  const parse = (string: string): NestedArray => JSON.parse(string)

  const compare = (left: NestedArray | number, right: NestedArray | number): number => {
    if (typeof left === 'number' && typeof right === 'number') {
      return left < right ? -1 : left > right ? 1 : 0
    }
    if (typeof left === 'number' && Array.isArray(right)) {
      return compare([left], right)
    }
    if (typeof right === 'number' && Array.isArray(left)) {
      return compare(left, [right])
    }
    for (let i = 0; i < (left as NestedArray).length; i++) {
      if (i < (right as NestedArray).length) {
        const score: number = compare((left as NestedArray)[i], (right as NestedArray)[i])
        if (score !== 0) return score
      }
    }
    return (left as NestedArray).length < (right as NestedArray).length
      ? -1
      : (left as any).length > (right as any).length
          ? 1
          : 0
  }

  if (!params.skipPart1) {
    part1 = data.reduce(
      (acc, packet, index) =>
        acc + (compare(parse(packet[0]), parse(packet[1])) === -1 ? 1 : 0) * (index + 1),
      0
    )
  }
  if (!params.skipPart2) {
    const _data: Array<string> = data
      .concat(['[[2]]', '[[6]]'])
      .flat()
      .sort((a, b) => compare(parse(a), parse(b)))
    part2 = (_data.indexOf('[[2]]') + 1) * (_data.indexOf('[[6]]') + 1)
  }

  return { part1, part2 }
}
