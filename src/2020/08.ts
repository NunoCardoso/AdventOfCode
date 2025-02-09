import { Params } from 'aoc.d'
import { range } from 'util/range'

type Instruction = [string, number]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let instructions: Instruction[] = []
  for await (const line of lineReader) {
    let values = line.split(' ')
    instructions.push([values[0], +values[1]])
  }

  const solveFor = (instructions: Instruction[], acc: number, seen: Set<number>): [number, number] => {
    let cursor = 0
    while (cursor < instructions.length) {
      if (seen.has(cursor)) break
      else seen.add(cursor)
      if (instructions[cursor][0] === 'acc') {
        acc += instructions[cursor][1]
        if (cursor === instructions.length - 1) break
        cursor++
      }
      if (instructions[cursor][0] === 'jmp') {
        if (cursor === instructions.length - 1) break
        cursor += instructions[cursor][1]
      }
      if (instructions[cursor][0] === 'nop') {
        if (cursor === instructions.length - 1) break
        cursor++
      }
    }
    return [acc, cursor]
  }

  if (!params.skipPart1) [part1] = solveFor(instructions, 0, new Set<number>())

  let cursor: number = 0
  if (!params.skipPart2) {
    while (part2 === 0) {
      if (!['jmp', 'nop'].includes(instructions[cursor][0])) {
        cursor++
        continue
      }
      let spikedInstructions: Instruction[] = instructions.map((i) => [...i])
      spikedInstructions[cursor][0] = spikedInstructions[cursor][0] === 'nop' ? 'jmp' : 'nop'
      let [acc, i] = solveFor(spikedInstructions, 0, new Set<number>())
      if (i === instructions.length - 1) part2 = acc
      else cursor++
    }
  }

  return { part1, part2 }
}
