import { Params } from 'aoc.d'

type Line = [number, number, number, number, number]
export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let lineNumber: number = 0
  let locks: Line[] = []
  let keys: Line[] = []
  let temp: Line = [0, 0, 0, 0, 0]
  let isLock: boolean = false,
    isKey: boolean = false

  for await (const line of lineReader) {
    if (line.length === 0) {
      lineNumber = 0
      continue
    }
    if (lineNumber === 0) {
      isLock = line === '#####'
      isKey = line === '.....'
      temp = isLock ? [0, 0, 0, 0, 0] : [5, 5, 5, 5, 5]
    } else if (lineNumber > 5) {
      isLock && locks.push([...temp])
      isKey && keys.push([...temp])
    } else {
      let vals = line.split('')
      if (isLock) {
        if (vals[0] === '#') temp[0] = lineNumber
        if (vals[1] === '#') temp[1] = lineNumber
        if (vals[2] === '#') temp[2] = lineNumber
        if (vals[3] === '#') temp[3] = lineNumber
        if (vals[4] === '#') temp[4] = lineNumber
      }
      if (isKey) {
        if (vals[0] === '.') temp[0] = 5 - lineNumber
        if (vals[1] === '.') temp[1] = 5 - lineNumber
        if (vals[2] === '.') temp[2] = 5 - lineNumber
        if (vals[3] === '.') temp[3] = 5 - lineNumber
        if (vals[4] === '.') temp[4] = 5 - lineNumber
      }
    }
    lineNumber++
  }

  const theyFit = (lock: Line, key: Line): boolean => lock.every((l, index) => lock[index] + key[index] <= 5)

  if (!params.skipPart1) {
    part1 = locks.reduce((acc, lock) => acc + keys.reduce((acc2, key) => acc2 + (theyFit(lock, key) ? 1 : 0), 0), 0)
  }

  return { part1, part2 }
}
