import { Params } from 'aoc.d'

type Instruction = {
  instruction: string
  register?: string
  amount?: number
}

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const instructions: Instruction[] = []

  for await (const line of lineReader) {
    const [instruction, param1, param2] = line.split(/\s+/)
    switch (instruction) {
      case 'hlf':
      case 'tpl':
      case 'inc':
        instructions.push({ instruction, register: param1 })
        break
      case 'jmp':
        instructions.push({ instruction, amount: +param1 })
        break
      case 'jie':
      case 'jio':
        instructions.push({ instruction, register: param1[0], amount: +param2 })
        break
    }
  }

  const solveFor = (registers: Record<string, number>, instructions: Instruction[], returnRegister: string): number => {
    for (let i = 0; i < instructions.length; i++) {
      switch (instructions[i].instruction) {
        case 'hlf':
          registers[instructions[i].register!] = registers[instructions[i].register!] / 2
          break
        case 'tpl':
          registers[instructions[i].register!] = registers[instructions[i].register!] * 3
          break
        case 'inc':
          registers[instructions[i].register!] = registers[instructions[i].register!] + 1
          break
        case 'jmp':
          i += instructions[i].amount! - 1
          break
        case 'jie':
          if (registers[instructions[i].register!] % 2 === 0) i += instructions[i].amount! - 1
          break
        case 'jio':
          if (registers[instructions[i].register!] === 1) i += instructions[i].amount! - 1
          break
      }
    }
    return registers[returnRegister]
  }

  part1 = solveFor({ a: 0, b: 0 }, instructions, params.isTest ? 'a' : 'b')
  part2 = solveFor({ a: 1, b: 0 }, instructions, 'b')

  return { part1, part2 }
}
