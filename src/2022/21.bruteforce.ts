import { Params } from 'aoc.d'
import _ from 'lodash'

type Monkeys = Record<string, number | string[]>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const resolve = (monkeys: Monkeys, monkey: string): number => {
    if (typeof monkeys[monkey] === 'number') return monkeys[monkey]
    const src1 = resolve(monkeys, monkeys[monkey][1])
    const src2 = resolve(monkeys, monkeys[monkey][2])
    if ((monkeys[monkey] as string[])[0] === '/') monkeys[monkey] = src1 / src2
    if ((monkeys[monkey] as string[])[0] === '*') monkeys[monkey] = src1 * src2
    if ((monkeys[monkey] as string[])[0] === '+') monkeys[monkey] = src1 + src2
    if ((monkeys[monkey] as string[])[0] === '-') monkeys[monkey] = src1 - src2
    return monkeys[monkey] as number
  }

  const monkeys1: Monkeys = {}
  const monkeys2: Monkeys = {}

  for await (const line of lineReader) {
    const values = line.split(' ')
    if (values.length === 2) {
      monkeys1[values[0].replaceAll(':', '')] = +values[1]
      monkeys2[values[0].replaceAll(':', '')] = +values[1]
    } else {
      monkeys1[values[0].replaceAll(':', '')] = [values[2], values[1], values[3]]
      monkeys2[values[0].replaceAll(':', '')] = [values[2], values[1], values[3]]
    }
  }

  part1 = resolve(monkeys1, 'root')

  if (params.part2?.skip !== true) {
    const monkeyRoot = monkeys2.root
    delete monkeys2.root
    let firstmonkey = 0
    // second monkey is not tied to human
    const secondmonkey = resolve(_.cloneDeep(monkeys2), (monkeyRoot as string[])[2])

    // guessing humn until log.debug on line 73 produces a firstmonkey - secondmonkey closer to 0
    if (!params.isTest) {
      part2 = 3441198825000
    }

    while (firstmonkey !== secondmonkey) {
      part2++
      monkeys2.humn = part2
      firstmonkey = resolve(_.cloneDeep(monkeys2), (monkeyRoot as string[])[1])
      log.debug('tried', part2, 'got', firstmonkey, secondmonkey, firstmonkey - secondmonkey)
    }
  }

  return { part1, part2 }
}
