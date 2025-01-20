import { Params } from 'aoc.d'

export const diagnosticProgram = (values: number[], input: number[]): number => {
  const decode = (code: number): [number, number[]] => [
    code % 100,
    Math.floor(code / 100)
      .toString()
      .padStart(3, '0')
      .split('')
      .reverse()
      .map(Number)
  ]

  const getValue = (values: number[], mode: number, cursor: number) => (mode === 0 ? values[cursor] : cursor)

  let cursor = 0
  let collected: number[] = []
  while (true) {
    let [opcode, modes] = decode(values[cursor])
    if (opcode === 99) break
    if (opcode === 1) {
      values[getValue(values, modes[2], cursor + 3)] =
        values[getValue(values, modes[0], cursor + 1)] + values[getValue(values, modes[1], cursor + 2)]
      cursor += 4
    }
    if (opcode === 2) {
      values[getValue(values, modes[2], cursor + 3)] =
        values[getValue(values, modes[0], cursor + 1)] * values[getValue(values, modes[1], cursor + 2)]
      cursor += 4
    }
    if (opcode === 3) {
      values[getValue(values, modes[0], cursor + 1)] = input.shift()!
      cursor += 2
    }
    if (opcode === 4) {
      collected.push(values[getValue(values, modes[0], cursor + 1)])
      cursor += 2
    }
    if (opcode === 5) {
      if (values[getValue(values, modes[0], cursor + 1)] !== 0) cursor = values[getValue(values, modes[1], cursor + 2)]
      else cursor += 3
    }
    if (opcode === 6) {
      if (values[getValue(values, modes[0], cursor + 1)] === 0) cursor = values[getValue(values, modes[1], cursor + 2)]
      else cursor += 3
    }
    if (opcode === 7) {
      values[getValue(values, modes[2], cursor + 3)] =
        values[getValue(values, modes[0], cursor + 1)] < values[getValue(values, modes[1], cursor + 2)] ? 1 : 0
      cursor += 4
    }
    if (opcode === 8) {
      values[getValue(values, modes[2], cursor + 3)] =
        values[getValue(values, modes[0], cursor + 1)] === values[getValue(values, modes[1], cursor + 2)] ? 1 : 0
      cursor += 4
    }
  }
  return collected.pop()!
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let values: number[] = []
  for await (const line of lineReader) values = line.split(',').map(Number)

  if (!params.skipPart1) part1 = diagnosticProgram([...values], [params.input.part1])
  if (!params.skipPart2) part2 = diagnosticProgram([...values], [params.input.part2])

  return { part1, part2 }
}
