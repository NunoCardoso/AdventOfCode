import { Params } from 'aoc.d'

type Cables = any
type PulseType = 'high' | 'low'
type PulseCount = {high: number, low: number}
// source, PulseType, target
type Pulse = [string, PulseType, string]
type Data = {pulses: PulseCount, status: any, memory: any}
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
  conjunctionList.forEach(c => {
    conjunctionIndex.set(c, Object.keys(cables).filter(key => cables[key].includes(c)))
  })

  let whenConjunctionsForRxAreFirstHigh: Record<string, number> = {}

  conjunctionIndex.get('dd')!.forEach((val) => {
    whenConjunctionsForRxAreFirstHigh[val] = 0
  })

  const breadthFirst = (pulses: Array<Pulse>, data: Data, i: number): Array<Pulse> => {
    let newPulses: Array<Pulse> = []

    pulses.forEach(pulse => {
      const [source, pulseType, target] = pulse
      // execute a pulse
      log.debug(source, '-' + pulseType + '->', target)
      if (part1 === 0) {
        data.pulses[pulseType]++
      }
      data.memory[source] = pulseType

      if (target === 'dd') {

        conjunctionIndex.get('dd')!.forEach((val) => {
          if ((data.memory[val.replaceAll('&', '')] === 'high') &&  whenConjunctionsForRxAreFirstHigh[val] === 0) {
            whenConjunctionsForRxAreFirstHigh[val] = i
          }
          // if all are there
          if (! Object.values(whenConjunctionsForRxAreFirstHigh).some(v => v === 0)) {
            console.log(whenConjunctionsForRxAreFirstHigh)
            part2 = Object.values(whenConjunctionsForRxAreFirstHigh).reduce((a, b) => lowestCommonMultiplier(a, b), 1)
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
          data.status[target] = (data.status[target] === 'off') ? 'on' : 'off'
          // if flip-flop is on => send a high pulse, off => low pulse
          cables['%' + target].forEach((el: string) => {
            newPulses.push([target, (data.status[target] === 'on' ? 'high' : 'low'), el])
          })
        }
      } else if (conjunctionList.includes(target)) {
        let conjunctionInputs = conjunctionIndex.get(target)!
        // send high if at least one is low
        let newPulseType: PulseType = conjunctionInputs.some(t =>
          data.memory[t.replaceAll('%', '').replaceAll('&', '')] === 'low'
        ) ? 'high' : 'low'
        cables['&' + target].forEach((el: string) => newPulses.push([target, newPulseType, el]))
      }
    })
    return newPulses
  }

  let data: Data = {pulses: {high: 0, low: 0}, status: {}, memory: {}}
  let diffPulses: Array<PulseCount> = []
  let oldPulses = global.structuredClone(data.pulses)
  let repetitionIndex: Map<number, Array<number>> = new Map()
  flipFlopList.forEach((ff: string) => {
    data.status[ff] = 'off'
    data.memory[ff] = 'low'
  })
  let delta : number | undefined = undefined
  let deltaIndex : number | undefined = undefined

  let i = 0
  while (true) {
    let opened: Array<Pulse> = [['button', 'low', 'broadcaster']]
    while (opened.length > 0) {
      opened = breadthFirst(opened, data, i)
    }
    if (part2 !== 0) {
      break
    }
    /*let diffPulse: PulseCount = {high: (data.pulses.high - oldPulses.high), low: (data.pulses.low - oldPulses.low)}
    log.debug('iteration', i, 'pulses', data.pulses, 'diff', diffPulse)
    let key = diffPulse.high * 1000 + diffPulse.low
    if (!repetitionIndex.has(key)) repetitionIndex.set(key, [i])
    else repetitionIndex.get(key)!.push(i)

    if (repetitionIndex.get(key)!.length >= 3) {
      let vals = repetitionIndex.get(key)!
      let firstSlice = diffPulses.slice(vals[vals.length - 3],vals[vals.length - 2])
      let secondSlice = diffPulses.slice(vals[vals.length - 2],vals[vals.length - 1])
      if (firstSlice.length === secondSlice.length) {
        let foundDiff = false
        for (let i = vals[vals.length - 3]; i < vals[vals.length - 2]; i++) {
          if ((diffPulses[i].high !== diffPulses[i + secondSlice.length].high) || (
            diffPulses[i].low !== diffPulses[i + secondSlice.length].low
          )) foundDiff = true
        }
        if (!foundDiff) {
          delta = firstSlice.length
          deltaIndex = vals[vals.length - 3]
          break
        }
      }
    }
    diffPulses.push(diffPulse)
    oldPulses = global.structuredClone(data.pulses)
    */

    i++
    if (params.iterations === i) {
      part1 = data.pulses.high * data.pulses.low
    }
    if (i % 10000 ===0) {
      console.log('i', i, 'part2', part2)
    }
  }


  // (1000 - findOnce) % delta = residual
  // so, 0...findOnce, then delta * repetitions + residual = 1000

  /*let repetitions = Math.floor((params.iterations - deltaIndex!) / delta!)
  let residualValue = (params.iterations - deltaIndex!) % delta!

  let cumulativePulses: PulseCount = {high: 0, low: 0}
  let deltaPulses: PulseCount = {high: 0, low: 0}
  let residualPulses: PulseCount = {high: 0, low: 0}

  // 0---findOnce
  for (let i = 0; i < deltaIndex!; i++) {
    cumulativePulses.high += diffPulses[i].high
    cumulativePulses.low += diffPulses[i].low
  }
  // delta
  for (let i = deltaIndex!; i < deltaIndex! + delta!; i++) {
    deltaPulses.high += diffPulses[i].high
    deltaPulses.low += diffPulses[i].low
  }
  // residual
  for (let i = deltaIndex!; i < deltaIndex! + residualValue!; i++) {
    residualPulses.high += diffPulses[i].high
    residualPulses.low += diffPulses[i].low
  }

  log.debug('delta', delta, 'deltaIndex', deltaIndex, 'repetitions', repetitions, 'iterations', params.iterations)
  log.debug('residualValue', residualValue, 'cumulativePulses', cumulativePulses)
  log.debug('deltaPulses', deltaPulses, 'residualPulses',residualPulses)

  cumulativePulses.high += deltaPulses.high * repetitions + residualPulses.high
  cumulativePulses.low += deltaPulses.low * repetitions + residualPulses.low
*/
  //part1 = cumulativePulses.high * cumulativePulses.low

  return { part1, part2 }
}
