import { Params } from 'aoc.d'
import { range } from 'util/range'

type Stacks = string[][]
type Instruction = [amount: number, from: number, to: number]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: string = ''

  const printStacks = (stack: Stacks) => stack.map((s) => '[' + s.join('') + ']').join(',')

  let stacks: Stacks = []
  const instructions: Instruction[] = []

  for await (const line of lineReader) {
    if (line.includes('[')) {
      ;[...line.matchAll(/\[(.)]/g)].forEach((match) => {
        const index = Math.floor(match.index / 4)
        if (!stacks[index]) stacks[index] = []
        stacks[index].unshift(match[1])
      })
    }
    if (line.includes('move')) instructions.push(line.match(/\d+/g).map(Number))
  }

  const stacksPart1 = stacks.map((s) => [...s])
  for (let [amount, from, to] of instructions)
    for (let i of range(amount)) stacksPart1[to - 1].push(stacksPart1[from - 1].pop()!)
  if (params.ui?.show) log.info('part 1 end', printStacks(stacksPart1))
  part1 = stacksPart1.map((s) => s[s.length - 1]).join('')

  const stacksPart2 = stacks.map((s) => [...s])
  for (let [amount, from, to] of instructions) stacksPart2[to - 1].push(...stacksPart2[from - 1].splice(-1 * amount))
  if (params.ui?.show) log.debug('part 2 end', printStacks(stacksPart2))
  part2 = stacksPart2.map((s) => s[s.length - 1]).join('')

  return { part1, part2 }
}
