import { Params } from 'aoc.d'

type Cables = any
type PulseType = 'high' | 'low'
type PulseCount = { high: number; low: number }
// source, PulseType, target
type Pulse = [string, PulseType, string]
type Data = { pulses: PulseCount; status: any; memory: any }
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const cables: Cables = {}
  const conjunctionList: Array<string> = []
  const flipFlopList: Array<string> = []
  const conjunctionIndex: Map<string, Array<string>> = new Map()

  const greatestCommonDivisor = (a: number, b: number): number => {
    if (b === 0) return a
    return greatestCommonDivisor(b, a % b)
  }

  const lowestCommonMultiplier = (a: number, b: number) => (a * b) / greatestCommonDivisor(a, b)

  for await (const line of lineReader) {
    const [left, right] = line.split(' -> ')
    cables[left] = right.split(', ')
    if (left.startsWith('&')) {
      conjunctionList.push(left.substring(1, left.length))
    }
    if (left.startsWith('%')) {
      flipFlopList.push(left.substring(1, left.length))
    }
  }
  conjunctionList.forEach((c) => {
    conjunctionIndex.set(
      c,
      Object.keys(cables).filter((key) => cables[key].includes(c))
    )
  })

  const whenConjunctionsForRxAreFirstHigh: Record<string, number> = {}

  conjunctionIndex.get('dd')!.forEach((val) => {
    whenConjunctionsForRxAreFirstHigh[val] = 0
  })

  const breadthFirst = (pulses: Array<Pulse>, data: Data, i: number): Array<Pulse> => {
    const newPulses: Array<Pulse> = []

    pulses.forEach((pulse) => {
      const [source, pulseType, target] = pulse
      // execute a pulse
      log.debug(source, '-' + pulseType + '->', target)
      data.pulses[pulseType]++
      data.memory[source] = pulseType

      if (target === 'dd') {
        conjunctionIndex.get('dd')!.forEach((val) => {
          if (
            data.memory[val.replaceAll('&', '')] === 'high' &&
            whenConjunctionsForRxAreFirstHigh[val] === 0
          ) {
            whenConjunctionsForRxAreFirstHigh[val] = i
          }

          // if all are there
          if (!Object.values(whenConjunctionsForRxAreFirstHigh).some((v) => v === 0)) {
            part2 = Object.values(whenConjunctionsForRxAreFirstHigh).reduce(
              (a, b) => lowestCommonMultiplier(a, b),
              1
            )
          }
        })
      }

      /** takes toooooooo much time */
      if (pulseType === 'low' && target === 'rx') {
        console.log('got it')
        part2 = i
      }

      if (target === 'broadcaster') {
        cables[target].forEach((el: string) => newPulses.push([target, pulseType, el]))
      } else if (flipFlopList.includes(target)) {
        // %flip-flop only reacts to low pulses, which toggle on/off
        if (pulseType === 'low') {
          data.status[target] = data.status[target] === 'off' ? 'on' : 'off'
          // if flip-flop is on => send a high pulse, off => low pulse
          cables['%' + target].forEach((el: string) => {
            newPulses.push([target, data.status[target] === 'on' ? 'high' : 'low', el])
          })
        }
      } else if (conjunctionList.includes(target)) {
        const conjunctionInputs = conjunctionIndex.get(target)!
        // send high if at least one is low
        const newPulseType: PulseType = conjunctionInputs.some(
          (t) => data.memory[t.replaceAll('%', '').replaceAll('&', '')] === 'low'
        )
          ? 'high'
          : 'low'
        cables['&' + target].forEach((el: string) => newPulses.push([target, newPulseType, el]))
      }
    })
    return newPulses
  }

  const data: Data = { pulses: { high: 0, low: 0 }, status: {}, memory: {} }
  flipFlopList.forEach((ff: string) => {
    data.status[ff] = 'off'
    data.memory[ff] = 'low'
  })
  let i = 1
  while (true) {
    let opened: Array<Pulse> = [['button', 'low', 'broadcaster']]
    while (opened.length > 0) {
      opened = breadthFirst(opened, data, i)
    }
    if (part2 !== 0) break
    i++
    if (params.iterations === i - 1) part1 = data.pulses.high * data.pulses.low
  }
  return { part1, part2 }
}
