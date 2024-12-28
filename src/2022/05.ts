import { Params } from 'aoc.d'

type Stacks = Array<Array<string>>
type Instruction = [number, number, number]
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: string = ''

  const printStacks = (stack: Stacks) => stack.map((s) => '[' + s.join('') + ']').join(',')

  let stacks: Stacks = []
  const instructions: Array<Instruction> = []

  for await (const line of lineReader) {
    if (line.includes('[')) {
      ;[...line.matchAll(/\[(.)]/g)].forEach((match) => {
        const index = Math.floor(match.index / 3)
        if (!stacks[index]) stacks[index] = []
        stacks[index].unshift(match[1])
      })
    }
    if (line.includes('move')) {
      instructions.push(line.match(/\d+/g).map(Number))
    }
  }
  stacks = stacks.filter((s) => !!s)
  log.debug(stacks)

  if (!params.skipPart1) {
    const stacks1 = global.structuredClone(stacks)
    instructions.forEach(([howmuch, from, to]) => {
      for (let i = 0; i < howmuch; i++) {
        stacks1[to - 1].splice(stacks1[to - 1].length, 0, stacks1[from - 1].splice(-1)[0])
      }
    })
    if (params.ui.end) log.info('part 1 end', printStacks(stacks1))
    part1 = stacks1.map((s) => s[s.length - 1]).join('')
  }

  if (!params.skipPart2) {
    const stacks2 = global.structuredClone(stacks)
    instructions.forEach(([howmuch, from, to]) =>
      stacks2[to - 1].splice(stacks2[to - 1].length, 0, ...stacks2[from - 1].splice(-1 * howmuch))
    )
    if (params.ui.end) log.debug('part 2 end', printStacks(stacks2))
    part2 = stacks2.map((s) => s[s.length - 1]).join('')
  }

  return { part1, part2 }
}
