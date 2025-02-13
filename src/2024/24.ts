import { Params } from 'aoc.d'
import { bin2dec, dec2bin } from 'util/conversion'

// source1, operator, source2
type Op = [string, string, string]
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: string = ''

  let data: Record<string, Op | number> = {}
  let wires: Record<string, string[]> = {}
  wires['x'] = []
  wires['y'] = []
  wires['z'] = []
  let middleWires: Set<string> = new Set()

  for await (const line of lineReader) {
    if (line.indexOf(':') >= 0) {
      let bits = line.split(': ')
      data[bits[0]] = +bits[1]
    }
    if (line.indexOf('->') >= 0) {
      let [, s1, op, s2, s3] = line.match(/(.*) (.*) (.*) -> (.*)/)
      data[s3] = [s1, op, s2]
      ;([s1, s2, s3] as string[]).forEach((s) => {
        let prefix = s[0]
        if (['x', 'y', 'z'].includes(prefix)) wires[prefix].push(s)
        else middleWires.add(s)
      })
    }
  }
  Object.keys(wires).forEach((key) => {
    wires[key] = wires[key].sort((a, b) => Number(b.substring(1, b.length)) - Number(a.substring(1, a.length)))
  })

  const runOperator = (op: string, val1: number, val2: number): number => {
    if (op === 'AND') return val1 === 1 && val2 === 1 ? 1 : 0
    if (op === 'OR') return val1 === 1 || val2 === 1 ? 1 : 0
    //if (op === 'XOR')
    return val1 !== val2 ? 1 : 0
  }

  const resolveWire = (wire: string): number => {
    if (typeof data[wire] === 'number') return data[wire] as number
    let [val1, op, val2] = data[wire] as Op
    return runOperator(op, resolveWire(val1), resolveWire(val2))
  }

  const solveForPart2 = (xWires: string[], yWires: string[], zWires: string[]): number => {
    let values = zWires.map(resolveWire).join('')
    return bin2dec(values)
  }

  if (!params.skipPart1) {
    let values = wires['z'].map(resolveWire).join('')
    part1 = bin2dec(values)
  }

  if (!params.skipPart2) {
    let xValueBin = wires['x'].map(resolveWire).join('')
    let yValueBin = wires['y'].map(resolveWire).join('')
    let zValueBin = wires['z'].map(resolveWire).join('')
    log.debug('bin: x', xValueBin, 'y', yValueBin, 'z', zValueBin)
    let x = bin2dec(xValueBin)
    let y = bin2dec(yValueBin)
    let z = bin2dec(zValueBin)
    log.debug('dec: x', x, 'y', y, 'z', z)
    let rightZ = x + y
    let rightZbin = dec2bin(rightZ)
    log.debug('right z:', rightZ, 'bin: ', rightZbin)

    /* let xValue = wires['x'].join('')
     let yValue = wires['y'].join('')
     let zValue = wires['z'].join('')
 */
    part2 = ''
  }

  return { part1, part2 }
}
