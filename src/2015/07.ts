import { Params } from 'aoc.d'
import { dec2bin } from 'util/conversion'

type Wire1 = { op: string; src: string | number }
type Wire2 = { op: string; src1: string | number; src2: string | number }
type Wire = number | string | Wire1 | Wire2
type Wires = Map<string, Wire>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const wires: Wires = new Map()

  for await (const line of lineReader) {
    const values = line.split(' ')
    // NOT x -> y
    if (values.length === 4) {
      wires.set(values[3], { op: 'NOT', src: values[1] })
    }
    // 1 -> c or x -> c
    if (values.length === 3) {
      wires.set(values[2], isNaN(values[0]) ? values[0] : +values[0])
    }
    // 1 something b -> c or a something b -> c
    if (values.length === 5) {
      wires.set(values[4], {
        op: values[1],
        src1: isNaN(values[0]) ? values[0] : +values[0],
        src2: isNaN(values[2]) ? values[2] : +values[2]
      })
    }
  }

  const _16bitNot = (number: number): number => {
    const bin = dec2bin(number).padStart(16, '0')
    const notbin = bin
      .split('')
      .map((bit) => (bit === '0' ? '1' : '0'))
      .join('')
    return parseInt(notbin, 2)
  }

  const _16bitOr = (number1: number, number2: number) => {
    const bin1 = dec2bin(number1).padStart(16, '0').split('')
    const bin2 = dec2bin(number2).padStart(16, '0').split('')
    const resbin = bin1.map((bit, i) => (bit === '0' ? bin2[i] : '1')).join('')
    return parseInt(resbin, 2)
  }

  const _16bitAnd = (numb1: number, numb2: number) => {
    const bin1 = dec2bin(numb1).padStart(16, '0').split('')
    const bin2 = dec2bin(numb2).padStart(16, '0').split('')
    const resbin = bin1.map((bit, i) => (bit === '1' ? bin2[i] : '0')).join('')
    return parseInt(resbin, 2)
  }

  const solveFor = (wires: Wires, key: string): number => {
    let result: number = 0
    const wire: Wire = wires.get(key)!
    if (typeof wire === 'number') return wire
    if (typeof wire === 'string') {
      result = solveFor(wires, wire)
      wires.set(key, result)
      log.debug('resolved string', key, result)
      return result
    }
    if ((wire as Wire1).op === 'NOT') {
      const src: number = typeof (wire as Wire1).src === 'number' ? ((wire as Wire1).src as number) : solveFor(wires, (wire as Wire1).src as string)
      result = _16bitNot(src)
      wires.set(key, result)
      log.debug('resolved not', key, result)
      return result
    }
    const src1: number = typeof (wire as Wire2).src1 === 'number' ? ((wire as Wire2).src1 as number) : solveFor(wires, (wire as Wire2).src1 as string)
    const src2: number = typeof (wire as Wire2).src2 === 'number' ? ((wire as Wire2).src2 as number) : solveFor(wires, (wire as Wire2).src2 as string)
    if ((wire as Wire2).op === 'OR') result = _16bitOr(src1, src2)
    if ((wire as Wire2).op === 'AND') result = _16bitAnd(src1, src2)
    if ((wire as Wire2).op === 'RSHIFT') result = src1 >> src2
    if ((wire as Wire2).op === 'LSHIFT') result = src1 << src2
    wires.set(key, result)
    log.debug('resolved or', key, result)
    return result
  }

  const wiresPart2: Wires = global.structuredClone(wires)

  if (!params.skipPart1) {
    part1 = solveFor(wires, 'a')
  }

  if (!params.skipPart2) {
    wiresPart2.set('b', part1)
    part2 = solveFor(wiresPart2, 'a')
  }
  return { part1, part2 }
}
