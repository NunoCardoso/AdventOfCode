import { Params } from 'aoc.d'
import _, { parseInt } from 'lodash'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  const part2: number = 0

  const instructions: Array<any> = []
  for await (const line of lineReader) {
    const values = line.split(/\s+/)
    const inst: any = {
      op: values[0],
      x: values[1].match(/\d+/) ? parseInt(values[1]) : values[1]
    }
    if (values.length === 3) {
      inst.y = values[2].match(/\d+/) ? parseInt(values[2]) : values[2]
    }
    instructions.push(inst)
  }

  const vars: Record<string, number> = {}
  let it = 0
  while (true) {
    if (it >= instructions.length) {
      break
    }
    // console.log('it',it,'vars',vars,'instructions[i]',instructions[it])
    let value: number
    switch (instructions[it].op) {
      case 'cpy':
        value = _.isNumber(instructions[it].x) ? instructions[it].x : vars[instructions[it].x]
        vars[instructions[it].y] = value
        it++
        break
      case 'inc':
        vars[instructions[it].x] = vars[instructions[it].x] + 1
        it++
        break
      case 'dec':
        vars[instructions[it].x] = vars[instructions[it].x] - 1
        it++
        break
      case 'jnz':
        value = _.isNumber(instructions[it].x) ? instructions[it].x : vars[instructions[it].x]
        if (value !== 0) {
          it += instructions[it].y
        } else {
          it++
        }
        break
    }
  }

  // too high 9227771

  part1 = vars.a
  return { part1, part2 }
}
