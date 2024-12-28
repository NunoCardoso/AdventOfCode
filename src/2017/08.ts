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

  let values: Map<string, number> = new Map()
  let instructions: Array<Instruction> = []
  for await (const line of lineReader) {
    const [, variable, incdec, amount, testVariable, testOperator, testAmount] = line.match(/(.+) (.+) (.+) if (.+) (.+) (.+)/)
    if (!values.has(variable)) values.set(variable, 0)
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
    if (instruction.testOperator === '<') condition = values.get(instruction.testVariable)! < instruction.testAmount
    else if (instruction.testOperator === '>') condition = values.get(instruction.testVariable)! > instruction.testAmount
    else if (instruction.testOperator === '<=') condition = values.get(instruction.testVariable)! <= instruction.testAmount
    else if (instruction.testOperator === '>=') condition = values.get(instruction.testVariable)! >= instruction.testAmount
    else if (instruction.testOperator === '!=') condition = values.get(instruction.testVariable)! != instruction.testAmount
    else if (instruction.testOperator === '==') condition = values.get(instruction.testVariable)! == instruction.testAmount
    if (condition) {
      if (instruction.incdec === 'inc') values.set(instruction.variable, values.get(instruction.variable)! + instruction.amount)
      else values.set(instruction.variable, values.get(instruction.variable)! - instruction.amount)
    }
    let maxValue = Math.max(...Array.from(values.values()))
    if (maxValue > part2) part2 = maxValue
    part1 = maxValue
  })

  return { part1, part2 }
}
