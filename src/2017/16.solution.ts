import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: string = ''

  let instructions: string[] = []
  for await (const line of lineReader) instructions = line.split(',')

  const solveForPart1 = (programs: string[], instructions: string[]): string => {
    return performCommands(programs, instructions)
  }

  const solveForPart2 = (programs: string[], instructions: string[], maxIterations: number): string => {
    let iterations: number = 0
    let currentPrograms = [...programs]
    let currentProgramsString = currentPrograms.join('')
    let memory: Record<string, number> = { currentProgramsString: 0 }
    let found = undefined
    while (!found) {
      iterations++
      currentProgramsString = performCommands(currentPrograms, instructions)
      // console.log('iterations', iterations, 'string', currentProgramsString)
      currentPrograms = currentProgramsString.split('')
      if (memory[currentProgramsString] && !found) {
        log.debug('found constant', memory[currentProgramsString], 'iterations', iterations)
        found = iterations
      }
      if (!found) memory[currentProgramsString] = iterations
    }

    // if I am here, it is because I found a pattern
    let constant = memory[currentProgramsString]
    let delta = iterations - constant
    // constants + n * delta = maxIterations (100000000)
    // we need to find constants and n
    let n = Math.floor((maxIterations - constant) / delta)
    // now, let's get finalconstant
    let finalconstant = maxIterations - n * delta
    return Object.keys(memory).find((key) => memory[key] === finalconstant)!
  }

  const performCommands = (programs: string[], instructions: string[]) => {
    instructions.forEach((instruction: string) => {
      let command = instruction[0]
      instruction = instruction.substring(1, instruction.length)
      if (command === 's') {
        let amount = +instruction
        let remainer = programs.splice(-1 * amount)
        programs = remainer.concat(programs)
      }
      if (command === 'x') {
        let positions = instruction.split('/').map(Number)
        let temp = programs[positions[0]]
        programs[positions[0]] = programs[positions[1]]
        programs[positions[1]] = temp
      }
      if (command === 'p') {
        let positions = instruction.split('/')
        let indexes = [programs.indexOf(positions[0]), programs.indexOf(positions[1])]
        programs[indexes[0]] = positions[1]
        programs[indexes[1]] = positions[0]
      }
    })
    return programs.join('')
  }

  part1 = solveForPart1([...params.programs], instructions)

  part2 = solveForPart2([...params.programs], instructions, 1000000000)

  // 999 999 961
  return { part1, part2 }
}
