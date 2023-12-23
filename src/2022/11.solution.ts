import { Params } from 'aoc.d'
import { leastCommonMultiple } from 'util/op'

type Monkey = {
  items: Array<number>
  operator: '+' | '*'
  operand: string | number
  divisible: number
  iftrue: number
  iffalse: number
  inspections: number
}

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const monkeys: Array<Monkey> = []
  let tempMonkey: Partial<Monkey> = { inspections: 0 }

  for await (const line of lineReader) {
    if (line === '') {
      monkeys.push(tempMonkey as Monkey)
      tempMonkey = { inspections: 0 }
    }
    let m = line.match(/Starting items: (.*)$/)
    if (m) tempMonkey.items = m[1].split(', ').map(Number)
    m = line.match(/Operation: new = old (.+) (.+)$/)
    if (m) {
      tempMonkey.operator = m[1]
      tempMonkey.operand = m[2].match(/^\d+$/) ? +m[2] : m[2]
    }
    m = line.match(/Test: divisible by (.*)$/)
    if (m) tempMonkey.divisible = parseInt(m[1])
    m = line.match(/If true: throw to monkey (.*)$/)
    if (m) tempMonkey.iftrue = parseInt(m[1])
    m = line.match(/If false: throw to monkey (.*)$/)
    if (m) tempMonkey.iffalse = parseInt(m[1])
  }

  // A test that combines all monkey tests is given by the least common multiple
  const monkeyMod: number = monkeys.reduce(
    (memo: number, monkey: Monkey) => leastCommonMultiple(memo, monkey.divisible),
    1
  )

  const generateMonkeyBusiness = (maxIterations: number, monkeys: Array<Monkey>, mode: string) => {
    let iterations = 0
    while (iterations++ < maxIterations) {
      monkeys.forEach((monkey, j) => {
        monkey.items.forEach((item, k) => {
          const operand = typeof monkey.operand !== 'number' ? item : monkey.operand
          let newItem = monkey.operator === '+' ? item + operand : item * operand
          if (mode === 'part1') newItem = Math.floor(newItem / 3)
          if (mode === 'part2') newItem = newItem % monkeyMod
          const targetMonkey = newItem % monkey.divisible === 0 ? monkey.iftrue : monkey.iffalse
          monkeys[targetMonkey].items.push(newItem)
          monkey.inspections++
        })
        monkey.items = []
      })
    }
  }

  let part1: number = 0
  let part2: number = 0

  const solveFor = (maxIterations: number, mode: string) => {
    const _monkeys = global.structuredClone(monkeys)
    generateMonkeyBusiness(maxIterations, _monkeys, mode)
    const inspections = _monkeys.map((m: Monkey) => m.inspections).sort((a: number, b: number) => b - a)
    return inspections[0] * inspections[1]
  }
  if (!params.skipPart1) part1 = solveFor(params!.iterations.part1, 'part1')
  if (!params.skipPart1) part2 = solveFor(params!.iterations.part2, 'part2')

  return { part1, part2 }
}
