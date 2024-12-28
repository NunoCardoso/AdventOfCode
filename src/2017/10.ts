import { Params } from 'aoc.d'

export const twistHash = (size: number, maxIterations: number, values: Array<number>) => {
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

export const knotHash = (line: string, size: number = 256) => {
  let suffix = [17, 31, 73, 47, 23]
  let list = line
    .split('')
    .map((s: string) => s.charCodeAt(0))
    .concat(suffix)
  let newlist = twistHash(size, 64, list)
  let xors: Array<string> = []
  while (newlist.length > 0) {
    let partialList = newlist.splice(0, 16)
    let xor = partialList.reduce((acc, val) => acc ^ val, 0)
    xors.push(xor.toString(16).padStart(2, '0'))
  }
  return xors.join('')
}

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

  if (!params.skipPart1) {
    let list = twistHash(params.size, 1, originalValues)
    part1 = list[0] * list[1]
  }

  if (!params.skipPart2) {
    part2 = knotHash(originalLine, params.size ?? 256)
  }

  return { part1, part2 }
}
