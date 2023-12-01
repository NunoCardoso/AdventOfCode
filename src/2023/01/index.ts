import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const dataPart1: Array<number> = []
  const dataPart2: Array<number> = []

  for await (const line of lineReader) {
    const slicePart1: Array<string> = []
    const slicePart2: Array<string> = []

    for (let i = 0; i < line.length; i++) {
      if (line[i].match(/\d/)) {
        slicePart1.push(line[i])
        slicePart2.push(line[i])
      } else {
        const sub = line.substring(i, line.length)
        if (sub.startsWith('one')) {
          slicePart2.push('1')
        }
        if (sub.startsWith('two')) {
          slicePart2.push('2')
        }
        if (sub.startsWith('three')) {
          slicePart2.push('3')
        }
        if (sub.startsWith('four')) {
          slicePart2.push('4')
        }
        if (sub.startsWith('five')) {
          slicePart2.push('5')
        }
        if (sub.startsWith('six')) {
          slicePart2.push('6')
        }
        if (sub.startsWith('seven')) {
          slicePart2.push('7')
        }
        if (sub.startsWith('eight')) {
          slicePart2.push('8')
        }
        if (sub.startsWith('nine')) {
          slicePart2.push('9')
        }
      }
    }

    if (slicePart1.length > 0) {
      dataPart1.push(parseInt(slicePart1[0]!.toString() + slicePart1[slicePart1.length - 1]!.toString()))
    }
    if (slicePart2.length > 0) {
      dataPart2.push(parseInt(slicePart2[0]!.toString() + slicePart2[slicePart2.length - 1]!.toString()))
    }
  }

  part1 = dataPart1.reduce((x, y) => x + y)
  part2 = dataPart2.reduce((x, y) => x + y)

  return { part1, part2 }
}
