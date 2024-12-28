import { Params } from 'aoc.d'

/*export const otherSolve = (value: bigint): number[] => {

    while ()
   ((((value % 8n) ^ 1n) ^ 4n) ^ (value / (2n ** ((value % 8n) ^ 1n)))) % 8n


}*/

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

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

  const solveForPart2 = (program: number[]): number => {
    let output: number[] = []
    // the last n digits of the program it looks for
    let matched = program.slice(program.length - 1, program.length)

    let numberA = BigInt(8 ** 15)

    let power = 14n

    let iterations = 0
    while (program.join(',') !== output.join(',')) {
      // let's iterate the next octal number
      // 001_001_000_000_000_000_000_000_000_000_000_000_000_000_000_000
      // 001_010_000_000_000_000_000_000_000_000_000_000_000_000_000_000
      // 001_011_000_000_000_000_000_000_000_000_000_000_000_000_000_000
      // etc until it gives the proper match end
      numberA += 8n ** power
      output = solveFor({ A: numberA, B: 0n, C: 0n }, program)
      //when the digits match, decrement the power by 1 so we can go to the other octet
      //by decreasing the power, the matched digits will no longer change
      let outputSlice = output.slice(program.length - matched.length, program.length)

      //console.log('trying', numberA.toString(8), 'power', power, 'output', output, 'matched', matched)

      if (outputSlice.join(',') === matched.join(',')) {
        log.debug('GOT', numberA.toString(8), 'after', iterations, 'iterations')
        power = power - 1n < 0n ? 0n : power - 1n
        log.debug('Power decreased to', power)
        matched = program.slice(program.length - 1 - matched.length, program.length)

        log.debug('Matched to compare is now ', matched)
        iterations = 0
      }
      iterations++
    }
    return Number(numberA)
  }

  if (!params.skipPart1) {
    part1 = solveFor(register, [...program]).join(',')
  }
  if (!params.skipPart2) {
    part2 = solveForPart2(program)
  }

  return { part1, part2 }
}
