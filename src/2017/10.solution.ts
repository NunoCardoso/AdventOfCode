import { Params } from 'aoc.d'
import * as console from 'console'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: string = ''

  let originalValues: Array<number> = []
  let originalLine: string = ''
  for await (const line of lineReader) {
    originalLine = line
    originalValues = line.split(/[,\s]+/).map(Number)
  }

  const solveFor = (size: number, maxIterations: number, values: Array<number>) => {
    let list = Array.from(Array(size).keys())
    let cursor = 0
    let skipSize = 0
    let iterations = 0

    while (iterations < maxIterations) {
      values.forEach((value: number) => {
        for (let i = 0; i <= Math.floor((value - 1) / 2); i++) {
          let leftCursor = (cursor + i) % size
          let rightCursor = (cursor + value - i - 1) % size
          let temp = list[leftCursor]
          list[leftCursor] = list[rightCursor]
          list[rightCursor] = temp
        }
        cursor += value + skipSize
        cursor = cursor % size
        skipSize++
      })
      iterations++
    }
    return list
  }

  if (!params.skipPart1) {
    let list = solveFor(params.size, 1, originalValues)
    part1 = list[0] * list[1]
  }

  if (!params.skipPart2) {
    let list: Array<number> = originalLine
    .split('').map((s: string) => s.charCodeAt(0))
    .concat(params.suffix)
    list = solveFor(params.size, 64, list)
    let xors: Array<string> = []
    while (list.length > 0) {
      let partialList = list.splice(0, 16)
      let xor = partialList.reduce((acc, val) => acc ^ val, 0)
      xors.push(xor.toString(16).padStart(2, '0'))
    }
    part2 = xors.join('')
  }
   // e146210a34221a7f0906da15c1c979a not that
  return { part1, part2 }
}
