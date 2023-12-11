import { Params } from 'aoc.d'

type Wire1 = { op: string; src: string | number }
type Wire2 = { op: string; src1: string | number; src2: string | number }
type Wire = number | string | Wire1 | Wire2
type Wires = Record<string, Wire>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const dec2bin = (dec: number) => (dec >>> 0).toString(2)

  const _16bitNot = (numb: number) => {
    const bin = dec2bin(numb).padStart(16, '0')
    const notbin = bin
      .split('')
      .map((x) => (x === '0' ? '1' : '0'))
      .join('')
    return parseInt(notbin, 2)
  }

  const _16bitOr = (numb1: number, numb2: number) => {
    const bin1 = dec2bin(numb1).padStart(16, '0').split('')
    const bin2 = dec2bin(numb2).padStart(16, '0').split('')
    const resbin = new Array(16)
    bin1.forEach((x, i) => {
      if (x === '0') {
        if (bin2[i] === '0') {
          resbin[i] = '0'
        }
        if (bin2[i] === '1') {
          resbin[i] = '1'
        }
      }
      if (x === '1') {
        resbin[i] = '1'
      }
    })
    return parseInt(resbin.join(''), 2)
  }

  const _16bitAnd = (numb1: number, numb2: number) => {
    const bin1 = dec2bin(numb1).padStart(16, '0').split('')
    const bin2 = dec2bin(numb2).padStart(16, '0').split('')
    const resbin = new Array(16)
    bin1.forEach((x, i) => {
      if (x === '1') {
        if (bin2[i] === '0') {
          resbin[i] = '0'
        }
        if (bin2[i] === '1') {
          resbin[i] = '1'
        }
      }
      if (x === '0') {
        resbin[i] = '0'
      }
    })
    return parseInt(resbin.join(''), 2)
  }

  const solveFor = (wires: Wires, key: string | number): number => {
    log.debug('start for ', key, wires[key])
    let res: number = 0
    if (!Object.prototype.hasOwnProperty.call(wires, key)) {
      console.error('wires has no', key)
      throw new Error()
    }
    if (typeof wires[key] === 'string') {
      res = solveFor(wires, wires[key] as string)
      wires[key] = res
      log.debug('resolved string', key, wires[key])
      return res
    }
    if (typeof wires[key] === 'number') {
      return wires[key] as number
    }
    if ((wires[key] as Wire1).op === 'NOT') {
      const src: number =
        typeof (wires[key] as Wire1).src === 'number'
          ? ((wires[key] as Wire1).src as number)
          : solveFor(wires, (wires[key] as Wire1).src)
      res = _16bitNot(src)
      wires[key] = res
      log.debug('resolved not', key, wires[key])
      return res
    }
    const src1: number =
      typeof (wires[key] as Wire2).src1 === 'number'
        ? ((wires[key] as Wire2).src1 as number)
        : solveFor(wires, (wires[key] as Wire2).src1)
    const src2: number =
      typeof (wires[key] as Wire2).src2 === 'number'
        ? ((wires[key] as Wire2).src2 as number)
        : solveFor(wires, (wires[key] as Wire2).src2)
    if ((wires[key] as Wire2).op === 'OR') {
      res = _16bitOr(src1, src2)
    }
    if ((wires[key] as Wire2).op === 'AND') {
      res = _16bitAnd(src1, src2)
    }
    if ((wires[key] as Wire2).op === 'RSHIFT') {
      res = src1 >> src2
    }
    if ((wires[key] as Wire2).op === 'LSHIFT') {
      res = src1 << src2
    }
    wires[key] = res
    log.debug('resolved or', key, wires[key])
    return res
  }

  const wires1: Wires = {}

  for await (const line of lineReader) {
    const vals = line.split(' ')

    // NOT x -> y
    if (vals.length === 4) {
      const source = vals[1]
      const target = vals[3]
      wires1[target] = { op: 'NOT', src: source }
    }
    // 1 -> c or x -> c
    if (vals.length === 3) {
      const value = vals[0].match(/^\d+$/) ? parseInt(vals[0]) : vals[0]
      const target = vals[2]
      wires1[target] = value
    }
    // 1 something b -> c or a something b -> c
    if (vals.length === 5) {
      const source1 = vals[0].match(/^\d+$/) ? parseInt(vals[0]) : vals[0]
      const operand = vals[1]
      const source2 = vals[2].match(/^\d+$/) ? parseInt(vals[2]) : vals[2]
      const target = vals[4]
      wires1[target] = { op: operand, src1: source1, src2: source2 }
    }
  }

  const wires2: Wires = global.structuredClone(wires1)

  if (params.part1?.skip !== true) {
    part1 = solveFor(wires1, 'a')
  }

  if (params.part2?.skip !== true) {
    wires2.b = part1
    part2 = solveFor(wires2, 'a')
  }
  return { part1, part2 }
}
