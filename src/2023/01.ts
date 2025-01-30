import { range } from 'util/range'

export default async (lineReader: any) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const slicePart1: string[] = []
    const slicePart2: string[] = []

    for (let cursor of range(line.length)) {
      if (line[cursor].match(/\d/)) {
        slicePart1.push(line[cursor])
        slicePart2.push(line[cursor])
      } else {
        const sub = line.substring(cursor, line.length)
        if (sub.startsWith('one')) slicePart2.push('1')
        if (sub.startsWith('two')) slicePart2.push('2')
        if (sub.startsWith('three')) slicePart2.push('3')
        if (sub.startsWith('four')) slicePart2.push('4')
        if (sub.startsWith('five')) slicePart2.push('5')
        if (sub.startsWith('six')) slicePart2.push('6')
        if (sub.startsWith('seven')) slicePart2.push('7')
        if (sub.startsWith('eight')) slicePart2.push('8')
        if (sub.startsWith('nine')) slicePart2.push('9')
      }
    }

    part1 += +(slicePart1[0] + slicePart1.pop()!)
    part2 += +(slicePart2[0] + slicePart2.pop()!)
  }

  return { part1, part2 }
}
