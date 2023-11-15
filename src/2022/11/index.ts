import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Monkey = {
    items: Array<number>
    operation: { op: '+' | '*'; op2: string | number }
    divisible: number
    iftrue: number
    iffalse: number
    inspections: number
  }

  const monkeys: Array<Monkey> = []
  let tempMonkey: Partial<Monkey> = {}
  let m: any

  for await (const line of lineReader) {
    if (line === '') {
      tempMonkey.inspections = 0
      monkeys.push(tempMonkey as Monkey)
      tempMonkey = {}
    }
    m = line.match(/Starting items: (.*)$/)
    if (m) {
      tempMonkey.items = m[1].split(', ').map((s: string) => parseInt(s))
    }
    m = line.match(/Operation: new = old (.+) (.+)$/)
    if (m) {
      tempMonkey.operation = {
        op: m[1],
        op2: m[2].toString().match(/^\d+$/) ? parseInt(m[2]) : 'x'
      }
    }
    m = line.match(/Test: divisible by (.*)$/)
    if (m) {
      tempMonkey.divisible = parseInt(m[1])
    }
    m = line.match(/If true: throw to monkey (.*)$/)
    if (m) {
      tempMonkey.iftrue = parseInt(m[1])
    }
    m = line.match(/If false: throw to monkey (.*)$/)
    if (m) {
      tempMonkey.iffalse = parseInt(m[1])
    }
  }

  // all tests are a mod. If I make a mod that combines all monkey mods,
  // them it is a test that is approved for all of them, regardless of how big the number is
  const monkeyMod: number = _.reduce(monkeys, (memo: number, monkey: Monkey) => memo * monkey.divisible, 1)

  const generateMonkeyBusiness = (rounds: number, monkeys: Array<Monkey>, mode: string) => {
    for (let i = 0; i < rounds; i++) {
      // monkeys
      for (let j = 0; j < monkeys.length; j++) {
        // items
        for (let k = 0; k < monkeys[j].items.length; k++) {
          log.debug('    Monkey inspects', monkeys[j].items[k])
          const op2: number =
            monkeys[j].operation.op2 === 'x' ? monkeys[j].items[k] : (monkeys[j].operation.op2 as number)
          let newItem =
            monkeys[j].operation.op === '+' ? monkeys[j].items[k] + op2 : monkeys[j].items[k] * op2
          log.debug('    worry level is now ', newItem)
          if (mode === 'part1') {
            newItem = Math.floor(newItem / 3)
          }
          if (mode === 'part2') {
            newItem = newItem % monkeyMod
          }
          log.debug('    worry level lowered to ', newItem)
          const toWhere = newItem % monkeys[j].divisible === 0 ? monkeys[j].iftrue : monkeys[j].iffalse
          log.debug('    thrown to monkey ', toWhere, monkeys[toWhere])
          monkeys[toWhere].items = monkeys[toWhere].items.concat(newItem)
          monkeys[j].inspections++
        }
        monkeys[j].items = []
      }
    }
  }

  let part1: number = 0
  let part2: number = 0

  if (params.part1?.skip !== true) {
    const monkeys1 = _.cloneDeep(monkeys)
    generateMonkeyBusiness(params!.part1.iterations, monkeys1, 'part1')
    const vals1 = monkeys1.map((m: Monkey) => m.inspections).sort((a: number, b: number) => b - a)
    part1 = vals1[0] * vals1[1]
  }
  if (params.part2?.skip !== true) {
    const monkeys2 = _.cloneDeep(monkeys)
    generateMonkeyBusiness(params!.part2.iterations, monkeys2, 'part2')
    const vals2 = monkeys2.map((m: Monkey) => m.inspections).sort((a: number, b: number) => b - a)
    part2 = vals2[0] * vals2[1]
  }

  return { part1, part2 }
}
