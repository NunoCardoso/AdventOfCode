import { Params } from 'aoc.d'
import _, { parseInt } from 'lodash'

type Instruction = {
  op: string
  x: string | number
  y?: string | number
}

type Registers = Record<string, number>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const instructions: Array<any> = []
  for await (const line of lineReader) {
    const values = line.split(/\s+/)
    const instruction: Instruction = {
      op: values[0],
      x: values[1].match(/\d+/) ? parseInt(values[1]) : values[1]
    }
    if (values.length === 3) {
      instruction.y = values[2].match(/\d+/) ? parseInt(values[2]) : values[2]
    }
    instructions.push(instruction)
  }

  const runRegister = (registers: Registers) => {
    let it = 0
    while (true) {
      if (it >= instructions.length) {
        break
      }
      log.debug('it', it, 'registers', registers, 'instruction', instructions[it])
      const value: number = _.isNumber(instructions[it].x)
        ? instructions[it].x
        : registers[instructions[it].x]

      switch (instructions[it].op) {
        case 'cpy':
          registers[instructions[it].y] = value
          it++
          break
        case 'inc':
          registers[instructions[it].x] = registers[instructions[it].x] + 1
          it++
          break
        case 'dec':
          registers[instructions[it].x] = registers[instructions[it].x] - 1
          it++
          break
        case 'jnz':
          if (value !== 0) {
            it += instructions[it].y
          } else {
            it++
          }
          break
      }
    }
    return registers.a
  }

  part1 = runRegister({ a: 0, b: 0, c: 0, d: 0 })
  part2 = runRegister({ a: 0, b: 0, c: 1, d: 0 })
  return { part1, part2 }
}
