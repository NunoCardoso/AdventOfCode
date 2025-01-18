import { Params } from 'aoc.d'
import { leastCommonMultiple } from 'util/commons'

type Monkey = {
  items: number[]
  operator: '+' | '*'
  operand: string | number
  divisible: number
  iftrue: number
  iffalse: number
  inspections: number
}

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const solveFor = (monkeys: Monkey[], maxIterations: number, mode: string) => {
    let iterations = 0
    while (iterations++ < maxIterations) {
      for (let monkey of monkeys) {
        for (let item of monkey.items) {
          const operand = typeof monkey.operand !== 'number' ? item : monkey.operand
          let newItem = monkey.operator === '+' ? item + operand : item * operand
          if (mode === 'part1') newItem = Math.floor(newItem / 3)
          if (mode === 'part2') newItem = newItem % monkeyMod
          const targetMonkey = newItem % monkey.divisible === 0 ? monkey.iftrue : monkey.iffalse
          monkeys[targetMonkey].items.push(newItem)
          monkey.inspections++
        }
        monkey.items = []
      }
    }
    const inspections = monkeys.map((m: Monkey) => m.inspections).sort((a: number, b: number) => b - a)
    return inspections[0] * inspections[1]
  }

  const monkeysPart1: Monkey[] = []
  const monkeysPart2: Monkey[] = []
  let tempMonkey: Partial<Monkey> = {}

  for await (const line of lineReader) {
    if (line === '') {
      monkeysPart1.push({ ...tempMonkey, items: [...tempMonkey.items!], inspections: 0 } as Monkey)
      monkeysPart2.push({ ...tempMonkey, items: [...tempMonkey.items!], inspections: 0 } as Monkey)
      tempMonkey = {}
    }
    let items = line.match(/Starting items: (.*)$/)?.[1]
    if (items) tempMonkey.items = items.split(', ').map(Number)
    let divisable = line.match(/Test: divisible by (.*)$/)?.[1]
    if (divisable) tempMonkey.divisible = +divisable
    let iftrue = line.match(/If true: throw to monkey (.*)$/)?.[1]
    if (iftrue) tempMonkey.iftrue = +iftrue
    let iffalse = line.match(/If false: throw to monkey (.*)$/)?.[1]
    if (iffalse) tempMonkey.iffalse = +iffalse
    let m = line.match(/Operation: new = old (.+) (.+)$/)
    if (m) {
      tempMonkey.operator = m[1]
      tempMonkey.operand = m[2].match(/^\d+$/) ? +m[2] : m[2]
    }
  }

  // A test that combines all monkey tests is given by the least common multiple
  const monkeyMod: number = monkeysPart1.reduce(
    (acc: number, monkey: Monkey) => leastCommonMultiple(acc, monkey.divisible),
    1
  )

  part1 = solveFor(monkeysPart1, params!.iterations.part1, 'part1')
  part2 = solveFor(monkeysPart2, params!.iterations.part2, 'part2')

  return { part1, part2 }
}
