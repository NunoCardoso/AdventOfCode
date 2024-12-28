import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })
  let part1: number = 0
  let part2: string = ''

  const signals: Array<number> = []
  const screen: Array<string> = new Array(params.limit).fill('.')

  const checkCycle = (cycles: number, signal: number) => {
    // part 1
    if ((cycles + params.lineWidth / 2) % params.lineWidth === 0) {
      const signalStrength: number = cycles * signal
      signals.push(signalStrength)
    }
    // part 2
    const cycleIndex: number = cycles - 1
    const cycleIndexInRow: number = cycleIndex % params.lineWidth
    if (signal === cycleIndexInRow || signal - 1 === cycleIndexInRow || signal + 1 === cycleIndexInRow) {
      screen[cycleIndex] = '#'
    }
  }

  let cycles: number = 0
  let signal: number = 1
  for await (const line of lineReader) {
    const [operation, amount] = line.split(' ')
    cycles++
    checkCycle(cycles, signal)
    if (operation === 'addx') {
      cycles++
      checkCycle(cycles, signal)
      signal += +amount
    }
  }

  if (!params.skipPart1) part1 = signals.reduce((memo: number, val: number) => memo + val)

  if (!params.skipPart2) {
    for (let cursor = params.limit; cursor >= 0; cursor -= params.lineWidth) screen.splice(cursor, 0, '\n')
    part2 = screen.join('')
  }

  return { part1, part2 }
}
