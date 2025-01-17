import { Params } from 'aoc.d'

type Program = {
  id: number
  index: number
  values: Record<string, number>
  queue: number[]
  status: 'processing' | 'waiting'
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const numberOrString = (target: string, values: Record<string, number>): number =>
    target.match(/\d+/) ? +target : values[target]

  const solveForPart1 = (instructions: string[], registers: Set<string>): number => {
    let values: Record<string, number> = Object.fromEntries([...registers].map((r) => [r, 0]))
    let index = 0
    let soundPlayed: number = Number.NaN
    let soundsPlayed: number[] = []
    while (Number.isNaN(soundPlayed)) {
      let [command, source, target] = instructions[index]
      if (command === 'snd') soundsPlayed.push(numberOrString(source, values))
      if (command === 'set') values[source] = numberOrString(target, values)
      if (command === 'add') values[source] += numberOrString(target, values)
      if (command === 'mul') values[source] *= numberOrString(target, values)
      if (command === 'mod') values[source] %= numberOrString(target, values)
      if (command === 'rcv' && values[source] !== 0) {
        soundPlayed = soundsPlayed[soundsPlayed.length - 1]
        continue
      }
      if (command === 'jgz') {
        let amount = numberOrString(source, values)
        index += amount > 0 ? +numberOrString(target, values) : 1
        continue
      }
      index++
    }
    return soundPlayed
  }

  const solveForPart2 = (instructions: string[], registers: Set<string>): number => {
    let count = 0
    let programs: [Program, Program] = [
      {
        id: 0,
        index: 0,
        values: Object.fromEntries([...registers].map((r) => [r, 0])),
        queue: [],
        status: 'processing'
      },
      {
        id: 1,
        index: 0,
        values: Object.fromEntries([...registers].map((r) => [r, 0])),
        queue: [],
        status: 'processing'
      }
    ]
    programs[0].values['p'] = 0
    programs[1].values['p'] = 1
    while (programs.some((p) => p.status === 'processing')) {
      programs
        .filter((p) => p.status === 'processing')
        .forEach((p) => {
          let otherProgramIndex = p.id === 0 ? 1 : 0
          if (p.index < 0 || p.index >= instructions.length) {
            p.status = 'waiting'
            programs[otherProgramIndex].status = 'waiting'
            return
          }
          let [command, source, target] = instructions[p.index]
          if (command === 'snd') {
            programs[otherProgramIndex].queue.push(numberOrString(source, p.values))
            if (programs[otherProgramIndex].status === 'waiting') programs[otherProgramIndex].status = 'processing'
            if (p.id === 1) count++
          }
          if (command === 'set') p.values[source] = numberOrString(target, p.values)
          if (command === 'add') p.values[source] += numberOrString(target, p.values)
          if (command === 'mul') p.values[source] *= numberOrString(target, p.values)
          if (command === 'mod') p.values[source] %= numberOrString(target, p.values)
          if (command === 'rcv') {
            // source has to be a string. can't receive a number
            if (p.queue.length > 0) {
              p.values[source] = p.queue.shift()!
            } else {
              return (p.status = 'waiting')
            }
          }
          if (command === 'jgz') {
            let amount = numberOrString(source, p.values)
            p.index += amount > 0 ? numberOrString(target, p.values) : 1
            return
          }
          p.index++
        })
    }
    return count
  }

  let instructions: string[] = []
  let registers: Set<string> = new Set()
  for await (const line of lineReader) {
    let instrArray = line.split(' ')
    if (instrArray[1].match(/\D+/)) registers.add(instrArray[1])
    instructions.push(instrArray)
  }

  if (!params.skipPart1) part1 = solveForPart1(instructions, registers)
  if (!params.skipPart2) part2 = solveForPart2(instructions, registers)

  return { part1, part2 }
}
