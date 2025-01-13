import { Params } from 'aoc.d'

type Instruction = {
  variable: string
  incdec: 'inc' | 'dec'
  amount: number
  testVariable: string
  testOperator: '<' | '>' | '==' | '>=' | '<=' | '!='
  testAmount: number
}
export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let registers: Map<string, number> = new Map()

  let instructions: Instruction[] = []
  for await (const line of lineReader) {
    const [, variable, incdec, amount, testVariable, testOperator, testAmount] = line.match(
      /(.+) (.+) (.+) if (.+) (.+) (.+)/
    )
    if (!registers.has(variable)) registers.set(variable, 0)
    instructions.push({
      variable,
      incdec,
      amount: +amount,
      testVariable,
      testOperator,
      testAmount: +testAmount
    })
  }

  instructions.forEach((instruction) => {
    let condition: boolean | undefined = undefined
    if (instruction.testOperator === '<') condition = registers.get(instruction.testVariable)! < instruction.testAmount
    else if (instruction.testOperator === '>')
      condition = registers.get(instruction.testVariable)! > instruction.testAmount
    else if (instruction.testOperator === '<=')
      condition = registers.get(instruction.testVariable)! <= instruction.testAmount
    else if (instruction.testOperator === '>=')
      condition = registers.get(instruction.testVariable)! >= instruction.testAmount
    else if (instruction.testOperator === '!=')
      condition = registers.get(instruction.testVariable)! != instruction.testAmount
    else if (instruction.testOperator === '==')
      condition = registers.get(instruction.testVariable)! == instruction.testAmount
    if (condition) {
      if (instruction.incdec === 'inc')
        registers.set(instruction.variable, registers.get(instruction.variable)! + instruction.amount)
      else registers.set(instruction.variable, registers.get(instruction.variable)! - instruction.amount)
    }
    let maxValue = Math.max(...Array.from(registers.values()))
    if (maxValue > part2) part2 = maxValue
    part1 = maxValue
  })

  return { part1, part2 }
}
