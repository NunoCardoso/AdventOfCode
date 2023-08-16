import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Signals = Record<string, number>

  let cycles: number = 0
  let signal: number = 1
  const signals: Signals = {}
  const limit: number = 240
  const lineWidth: number = 40

  const printscreen: Array<string> = new Array(limit).fill('.')

  const checkCycle = (cycles: number, signal: number) => {
    // part 1
    if ((cycles + 20) % lineWidth === 0) {
      const signalStrength: number = cycles * signal
      signals['' + cycles] = signalStrength
      log.debug('adding signal strength', signalStrength, 'cycles', cycles)
    }

    // part 2
    const cycleIndex: number = cycles - 1
    const cycleIndexInRow: number = cycleIndex % lineWidth

    if (signal === cycleIndexInRow || signal - 1 === cycleIndexInRow || signal + 1 === cycleIndexInRow) {
      printscreen[cycleIndex] = '#'
    }
  }

  for await (const line of lineReader) {
    const vals = line.split(' ')
    log.debug('line', line, 'cycles', cycles, 'signal', signal)
    if (vals[0] === 'noop') {
      cycles++
      checkCycle(cycles, signal)
    }
    if (vals[0] === 'addx') {
      cycles++
      checkCycle(cycles, signal)
      cycles++
      checkCycle(cycles, signal)
      signal += parseInt(vals[1])
    }
  }

  const part1 = _.reduce(Object.values(signals), (memo: number, val: number) => memo + val, 0)
  const part2 =
    '\n' +
    printscreen.slice(0, 40).join('') +
    '\n' +
    printscreen.slice(40, 80).join('') +
    '\n' +
    printscreen.slice(80, 120).join('') +
    '\n' +
    printscreen.slice(120, 160).join('') +
    '\n' +
    printscreen.slice(160, 200).join('') +
    '\n' +
    printscreen.slice(200, 240).join('') +
    '\n'

  return { part1, part2 }
}
