import { Params } from 'aoc.d'

type Bus = number | undefined

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const solveFor = (buses: Bus[]): number => {
    let min = Number.MAX_VALUE
    let minLine: number = 0
    for (let line of buses) {
      if (line) {
        let diff = Math.ceil(time / line) * line - time
        if (diff < min) {
          min = diff
          minLine = line
        }
      }
    }
    return minLine * min
  }

  const solveForPart2 = (buses: Bus[]): number => {
    let remainder: number = 0
    let cursor = 0
    let seenBuses: number[] = []

    while (buses.length > 0) {
      let bus = buses.shift()
      if (!!bus) {
        if (seenBuses.length > 0) {
          let step = seenBuses.reduce((a, b) => a * b, 1)
          while (true) {
            if ((remainder + cursor) % bus === 0) break
            remainder += step
          }
        }
        seenBuses.push(bus)
      }
      cursor++
    }
    return remainder
  }

  let buses: Bus[] = []
  let time: number = 0

  for await (const line of lineReader) {
    if (line.indexOf(',') < 0) time = +line
    else buses = line.split(',').map((val: string) => (val === 'x' ? undefined : Number(val)))
  }

  if (!params.skipPart1) part1 = solveFor(buses)
  if (!params.skipPart2) part2 = solveForPart2(buses)

  return { part1, part2 }
}
