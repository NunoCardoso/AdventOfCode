import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const instructions = []

  for await (const line of lineReader) {
    const values = line.split(/\s+/)
    switch (values[0]) {
      case 'hlf':
      case 'tpl':
      case 'inc':
        instructions.push({ instruction: values[0], register: values[1] })
        break
      case 'jmp':
        instructions.push({ instruction: values[0], amount: parseInt(values[1]) })
        break
      case 'jie':
      case 'jio':
        instructions.push({ instruction: values[0], register: values[1][0], amount: parseInt(values[2]) })
        break
    }
  }

  const doIt = (
    registers: Record<string, number>,
    instructions: Array<any>,
    returnRegister: String
  ): number => {
    for (let i = 0; i < instructions.length; i++) {
      switch (instructions[i].instruction) {
        case 'hlf':
          registers[instructions[i].register] = registers[instructions[i].register] / 2
          log.debug(
            i,
            instructions[i].instruction,
            instructions[i].register,
            registers[instructions[i].register]
          )
          break
        case 'tpl':
          registers[instructions[i].register] = registers[instructions[i].register] * 3
          log.debug(
            i,
            instructions[i].instruction,
            instructions[i].register,
            registers[instructions[i].register]
          )
          break
        case 'inc':
          registers[instructions[i].register] = registers[instructions[i].register] + 1
          log.debug(
            i,
            instructions[i].instruction,
            instructions[i].register,
            registers[instructions[i].register]
          )

          break
        case 'jmp':
          i += instructions[i].amount! - 1
          log.debug(i, instructions[i].instruction)
          break
        case 'jie':
          if (registers[instructions[i].register] % 2 === 0) {
            i += instructions[i].amount! - 1
          }
          log.debug(
            i,
            instructions[i].instruction,
            instructions[i].register,
            registers[instructions[i].register]
          )
          break
        case 'jio':
          if (registers[instructions[i].register] === 1) {
            i += instructions[i].amount! - 1
          }
          log.debug(
            i,
            instructions[i].instruction,
            instructions[i].register,
            registers[instructions[i].register]
          )
          break
      }
    }
    return registers[returnRegister as any]
  }

  part1 = doIt(
    {
      a: 0,
      b: 0
    },
    instructions,
    params.isTest ? 'a' : 'b'
  )
  part2 = doIt(
    {
      a: 1,
      b: 0
    },
    instructions,
    'b'
  )

  return { part1, part2 }
}
