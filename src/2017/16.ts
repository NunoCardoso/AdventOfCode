import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: string = ''

  const performCommands = (programs: string[], instructions: string[]): string[] => {
    instructions.forEach((instruction: string) => {
      let command = instruction[0]
      instruction = instruction.substring(1, instruction.length)
      if (command === 's') {
        programs = programs.splice(-1 * +instruction).concat(programs)
      }
      if (command === 'x') {
        let [p1, p2] = instruction.split('/').map(Number)
        let temp = programs[p1]
        programs[p1] = programs[p2]
        programs[p2] = temp
      }
      if (command === 'p') {
        let [p1, p2] = instruction.split('/')
        let indexes = [programs.indexOf(p1), programs.indexOf(p2)]
        programs[indexes[0]] = p2
        programs[indexes[1]] = p1
      }
    })
    return programs
  }

  let instructions: string[] = []
  for await (const line of lineReader) instructions = line.split(',')

  const solveForPart1 = (programs: string[], instructions: string[]): string =>
    performCommands(programs, instructions).join('')

  const solveForPart2 = (programs: string[], instructions: string[], maxIterations: number): string => {
    let iterations: number = 0
    let programKey = programs.join('')
    let memory: Record<string, number> = { currentProgramsString: 0 }
    while (true) {
      iterations++
      programs = performCommands(programs, instructions)
      programKey = programs.join('')
      if (memory[programKey]) break
      memory[programKey] = iterations
    }

    // if I am here, it is because I found a pattern
    let constant = memory[programKey]
    let delta = iterations - constant
    // constants + n * delta = maxIterations (100000000)
    // we need to find constants and n
    let n = Math.floor((maxIterations - constant) / delta)
    // now, let's get final constant
    let finalconstant = maxIterations - n * delta
    return Object.keys(memory).find((key) => memory[key] === finalconstant)!
  }

  part1 = solveForPart1([...params.programs], instructions)

  part2 = solveForPart2([...params.programs], instructions, 1000000000)

  return { part1, part2 }
}
