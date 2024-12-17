import { Params } from 'aoc.d'
import { Permutation } from 'js-combinatorics'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: number = 0

  let register: Record<string, bigint> = {}
  let program: number[] = []

  for await (const line of lineReader) {
    if (line.length > 0) {
      if (line.startsWith('Register')) {
        const [, letter, val] = line.match(/Register (.): (.+)/)
        register[letter] = BigInt(+val)
      }
      if (line.startsWith('Program')) {
        const [, val] = line.match(/Program: (.+)/)
        program = val.split(',').map(Number)
      }
    }
  }

  const combo = (operand: number, register: Record<string, bigint>): bigint | undefined => {
    if ([0, 1, 2, 3].includes(operand)) return BigInt(operand)
    if (operand === 4) return register['A']
    if (operand === 5) return register['B']
    if (operand === 6) return register['C']
    return undefined
  }

  const solveFor = (register: Record<string, bigint>, program: number[]): number[] => {
    let instructionPointer = 0
    let output = []
    while (instructionPointer >= 0 && instructionPointer < program.length) {
      let opcode = program[instructionPointer]
      let operand = program[instructionPointer + 1]

      // console.log(instructionPointer, opcode, operand, output, JSON.stringify(register))

      // adv
      if (opcode === 0) {
        register['A'] = register['A'] / 2n ** combo(operand, register)!
        instructionPointer += 2
      }
      // bxl
      if (opcode === 1) {
        register['B'] = register['B'] ^ BigInt(operand)
        instructionPointer += 2
      }
      // bst
      if (opcode === 2) {
        register['B'] = combo(operand, register)! % 8n
        instructionPointer += 2
      }
      // jnZ
      if (opcode === 3) {
        if (Number(register['A']) !== 0) {
          instructionPointer = operand
        } else {
          instructionPointer += 2
        }
      }
      // bxc
      if (opcode === 4) {
        register['B'] = register['B'] ^ register['C']
        instructionPointer += 2
      }
      // out
      if (opcode === 5) {
        output.push(Number(combo(operand, register)! % 8n))
        instructionPointer += 2
      }
      // bdv
      if (opcode === 6) {
        register['B'] = register['A'] / 2n ** combo(operand, register)!
        instructionPointer += 2
      }
      // cdv
      if (opcode === 7) {
        register['C'] = register['A'] / 2n ** combo(operand, register)!
        instructionPointer += 2
      }
    }
    return output
  }

  const solveForPart2 = (newRegister: Record<string, bigint>, program: number[]): number => {
    let valueOfA: bigint = 0n
    let newOutput: number[] = []
    while (newOutput.join(',') !== program.join(',')) {
      newRegister['A'] = valueOfA++
      //console.log(newRegister, program )
      newOutput = solveFor(newRegister, program)
      if (Number(valueOfA) % 1000000 === 0) {
        console.log('trying', valueOfA)
      }
    }
    return Number(valueOfA) - 1
  }

  if (!params.skipPart1) {
    part1 = solveFor(register, program).join(',')
  }
  if (!params.skipPart2) {
    part2 = solveForPart2({ ...register }, program)
  }

  return { part1, part2 }
}
