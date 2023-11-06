import { Params } from '../../aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const dataPart1: Record<string, number> = {}
  const dataPart2: Record<string, number> = {}

  const increment = (data: Record<string, number>, key: string) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      data[key]++
    } else {
      data[key] = 1
    }
  }

  for await (const line of lineReader) {
    const m = line.match(/(\d+),(\d+) -> (\d+),(\d+)/)
    if (m) {
      const X1 = parseInt(m[1])
      const Y1 = parseInt(m[2])
      const X2 = parseInt(m[3])
      const Y2 = parseInt(m[4])
      const diffX = X2 - X1
      const diffY = Y2 - Y1
      const maxDiff = Math.max(Math.abs(diffX), Math.abs(diffY))

      if (diffX === 0 || diffY === 0 || Math.abs(diffX) === Math.abs(diffY)) {
        for (let tick = 0; tick <= maxDiff; tick++) {
          const X = X1 === X2 ? X1 : X1 > X2 ? X1 - tick : X1 + tick
          const Y = Y1 === Y2 ? Y1 : Y1 > Y2 ? Y1 - tick : Y1 + tick
          const key = X.toString() + '-' + Y.toString()
          if (diffX === 0 || diffY === 0) {
            increment(dataPart1, key)
          }
          increment(dataPart2, key)
        }
      }
    }
  }

  const part1 = Object.values(dataPart1).filter((val) => val >= 2).length
  const part2 = Object.values(dataPart2).filter((val) => val >= 2).length

  return {
    part1,
    part2
  }
}
