import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Stacks = Array<Array<string>>

  let part1: string = ''
  let part2: string = ''

  /*
  [T]             [P]     [J]
  [F]     [S]     [T]     [R]     [B]
  [V]     [M] [H] [S]     [F]     [R]
  [Z]     [P] [Q] [B]     [S] [W] [P]
  [C]     [Q] [R] [D] [Z] [N] [H] [Q]
  [W] [B] [T] [F] [L] [T] [M] [F] [T]
  [S] [R] [Z] [V] [G] [R] [Q] [N] [Z]
  [Q] [Q] [B] [D] [J] [W] [H] [R] [J]
   1   2   3   4   5   6   7   8   9
   */

  const stacks1: Stacks = params.isTest
    ? [['Z', 'N'], ['M', 'C', 'D'], ['P']]
    : [
        ['Q', 'S', 'W', 'C', 'Z', 'V', 'F', 'T'],
        ['Q', 'R', 'B'],
        ['B', 'Z', 'T', 'Q', 'P', 'M', 'S'],
        ['D', 'V', 'F', 'R', 'Q', 'H'],
        ['J', 'G', 'L', 'D', 'B', 'S', 'T', 'P'],
        ['W', 'R', 'T', 'Z'],
        ['H', 'Q', 'M', 'N', 'S', 'F', 'R', 'J'],
        ['R', 'N', 'F', 'H', 'W'],
        ['J', 'Z', 'T', 'Q', 'P', 'R', 'B']
      ]

  const stacks2: Stacks = _.cloneDeep(stacks1)

  const printStacks = (stack: Stacks) => stack.map((s) => '[' + s.join('') + ']').join(',')

  for await (const line of lineReader) {
    const match = line.match(/^move (\d+) from (\d+) to (\d+)$/)
    const howmuch: number = match[1]
    const from: number = match[2]
    const to: number = match[3]

    // part 1
    if (params.part1?.skip !== true) {
      log.trace(line, printStacks(stacks1))
      for (let i = 0; i < howmuch; i++) {
        const elem = stacks1[from - 1].splice(-1)
        stacks1[to - 1].splice(stacks1[to - 1].length, 0, elem[0])
        log.trace(printStacks(stacks1))
      }
      log.debug('part 1 end', printStacks(stacks1))
      part1 = stacks1.map((s) => s[s.length - 1]).join('')
    }

    // part 2
    if (params.part2?.skip !== true) {
      const elems = stacks2[from - 1].splice(-1 * howmuch)
      stacks2[to - 1].splice(stacks2[to - 1].length, 0, ...elems)
      log.debug('part 2 end', printStacks(stacks2))
      part2 = stacks2.map((s) => s[s.length - 1]).join('')
    }
  }

  return { part1, part2 }
}
