import { Params } from 'aoc.d'
import { range } from 'util/range'

type Packet = Array<Packet | number>

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })
  let part1: number = 0
  let part2: number = 0

  const parse = (string: string): Packet => JSON.parse(string)

  const compare = (left: Packet | number, right: Packet | number): number => {
    if (typeof left === 'number' && typeof right === 'number') {
      return left < right ? -1 : left > right ? 1 : 0
    }
    if (typeof left === 'number' && Array.isArray(right)) {
      return compare([left], right)
    }
    if (typeof right === 'number' && Array.isArray(left)) {
      return compare(left, [right])
    }
    for (let packet of range((left as Packet).length)) {
      if (packet < (right as Packet).length) {
        const score: number = compare((left as Packet)[packet], (right as Packet)[packet])
        if (score !== 0) return score
      }
    }
    return (left as Packet).length < (right as Packet).length
      ? -1
      : (left as any).length > (right as any).length
        ? 1
        : 0
  }

  const data: string[][] = []
  let lineNumber: number = 0
  let lineBuffer: string[] = []

  for await (const line of lineReader) {
    if (lineNumber++ % 3 !== 2) lineBuffer.push(line)
    else {
      data.push(lineBuffer)
      lineBuffer = []
    }
  }

  part1 = data.reduce(
    (acc, packet, index) => acc + (compare(parse(packet[0]), parse(packet[1])) === -1 ? 1 : 0) * (index + 1),
    0
  )

  const dataPart2: string[] = data
    .concat(['[[2]]', '[[6]]'])
    .flat()
    .sort((a, b) => compare(parse(a), parse(b)))
  part2 = (dataPart2.indexOf('[[2]]') + 1) * (dataPart2.indexOf('[[6]]') + 1)

  return { part1, part2 }
}
