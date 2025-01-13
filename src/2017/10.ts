import { Params } from 'aoc.d'

export const twistHash = (size: number, maxIterations: number, values: number[]) => {
  let list = Array.from(Array(size).keys())
  let cursor = 0
  let skipSize = 0
  let iterations = 0

  while (iterations++ < maxIterations) {
    for (let value of values) {
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
    }
  }
  return list
}

export const knotHash = (line: string, size: number = 256) => {
  let suffix = [17, 31, 73, 47, 23]
  let values = line
    .split('')
    .map((s: string) => s.charCodeAt(0))
    .concat(suffix)
  let twistedValues = twistHash(size, 64, values)
  let xors: string[] = []
  while (twistedValues.length > 0) {
    let partialList = twistedValues.splice(0, 16)
    let xor = partialList.reduce((acc, val) => acc ^ val, 0)
    xors.push(xor.toString(16).padStart(2, '0'))
  }
  return xors.join('')
}

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: string = ''

  let originalValues: number[] = []
  let originalLine: string = ''
  for await (const line of lineReader) {
    originalLine = line
    originalValues = line.split(/[,\s]+/).map(Number)
  }

  let list = twistHash(params.size ?? 256, 1, originalValues)
  part1 = list[0] * list[1]
  part2 = knotHash(originalLine, params.size ?? 256)

  return { part1, part2 }
}
