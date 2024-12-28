import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const resolve = (monkeys: any, monkey: any) => {
    log.debug('start for ', monkey, monkeys[monkey], monkeys.humn)
    if (!Object.prototype.hasOwnProperty.call(monkeys, monkey)) {
      console.error('monkeys has no', monkey)
      throw new Error()
    }
    if (_.isNumber(monkeys[monkey])) {
      return monkeys[monkey]
    }
    const src1 = _.isNumber(monkeys[monkey].src1)
      ? monkeys[monkey].src1
      : resolve(monkeys, monkeys[monkey].src1)
    const src2 = _.isNumber(monkeys[monkey].src2)
      ? monkeys[monkey].src2
      : resolve(monkeys, monkeys[monkey].src2)
    let res = 0

    if (monkeys[monkey].op === '/') {
      res = src1 / src2
    }
    if (monkeys[monkey].op === '*') {
      res = src1 * src2
    }
    if (monkeys[monkey].op === '+') {
      res = src1 + src2
    }
    if (monkeys[monkey].op === '-') {
      res = src1 - src2
    }
    monkeys[monkey] = res
    log.debug('resolved for monkey ', monkey, 'with humn', monkeys.humn, '=', monkeys[monkey])
    return res
  }

  const monkeys1: any = {}

  for await (const line of lineReader) {
    const vals = line.split(' ')
    // aaaa: 1
    if (vals.length === 2) {
      monkeys1[vals[0].replaceAll(':', '')] = parseInt(vals[1])
    } else {
      monkeys1[vals[0].replaceAll(':', '')] = { op: vals[2], src1: vals[1], src2: vals[3] }
    }
  }

  const monkeys2: any = _.cloneDeep(monkeys1)
  let part1: number = 0
  let part2: number = 0

  if (params.part1?.skip !== true) {
    part1 = resolve(monkeys1, 'root')
  }

  if (params.part2?.skip !== true) {
    const monkeyRoot = monkeys2.root
    delete monkeys2.root
    let firstmonkey = 0
    // second monkey is not tied to human
    const secondmonkey = resolve(_.cloneDeep(monkeys2), monkeyRoot.src2)

    // guessing humn until log.debug on line 73 produces a firstmonkey - secondmonkey closer to 0
    if (!params.isTest) {
      part2 = 3441198825000
    }

    while (firstmonkey !== secondmonkey) {
      part2++
      monkeys2.humn = part2
      firstmonkey = resolve(_.cloneDeep(monkeys2), monkeyRoot.src1)
      log.debug('tried', part2, 'got', firstmonkey, secondmonkey, firstmonkey - secondmonkey)
    }
  }

  return { part1, part2 }
}
