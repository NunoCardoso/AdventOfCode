import { Params } from 'aoc.d'

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

  const instructions: Array<Instruction> = []
  for await (const line of lineReader) {
    const [op, x, y] = line.split(/\s+/)
    instructions.push({
      op,
      x: x.match(/\d+/) ? +x : x,
      y: y ? (y.match(/\d+/) ? +y : y) : null
    })
  }

  const runRegister = (registers: Registers) => {
    let it = 0
    while (true) {
      if (it >= instructions.length) break
      log.debug('it', it, 'registers', registers, 'instruction', instructions[it])
      const value: number =
        typeof instructions[it].x === 'number'
          ? (instructions[it].x as number)
          : (registers[instructions[it].x] as number)

      switch (instructions[it].op) {
        case 'cpy':
          registers[instructions[it].y!] = value
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
          if (value !== 0) it += instructions[it].y as number
          else it++
          break
      }
    }
    return registers.a
  }

  part1 = runRegister({ a: 0, b: 0, c: 0, d: 0 })
  part2 = runRegister({ a: 0, b: 0, c: 1, d: 0 })
  return { part1, part2 }
}
