import * as console from 'console'
import { Params } from 'aoc.d'

type Program = {
  index: number
  values: Record<string, number>
  queue: number[]
  status: 'processing' | 'waiting' | 'deadlock'
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let instructions: string[] = []
  let registers: Set<string> = new Set()
  for await (const line of lineReader) {
    let instrArray = line.split(' ')
    if (instrArray[1].match(/\D+/)) registers.add(instrArray[1])
    instructions.push(instrArray)
  }

  const numberOrString = (target: string, values: Record<string, number>): number =>
    target.match(/\d+/) ? +target : values[target]

  const solveForPart1 = (instructions: string[]): number => {
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

  const solveForPart2 = (instructions: string[]): number => {
    let count = 0
    let programs: [Program, Program] = [
      {
        index: 0,
        values: Object.fromEntries([...registers].map((r) => [r, 0])),
        queue: [],
        status: 'processing'
      },
      {
        index: 0,
        values: Object.fromEntries([...registers].map((r) => [r, 0])),
        queue: [],
        status: 'processing'
      }
    ]
    programs[0].values['p'] = 0
    programs[1].values['p'] = 1
    let iterations = 0
    while (programs.some((p) => p.status === 'processing')) {
      iterations++
      if (iterations % 1000000 === 0) log.info('it', iterations, 'count', count)
      programs.forEach((p, pIndex) => {
        let otherProgramIndex = pIndex === 0 ? 1 : 0
        if (p.index < 0 || p.index >= instructions.length) {
          p.status = 'deadlock'
          programs[otherProgramIndex].status = 'deadlock'
          return
        }
        let [command, source, target] = instructions[p.index]
        log.debug('========')
        log.debug('start', pIndex, JSON.stringify(p))
        log.debug('instructions', instructions[p.index])
        if (p.status !== 'waiting') {
          if (command === 'snd') {
            p.queue.push(numberOrString(source, p.values))
            p.index++
            if (otherProgramIndex === 1) count++
          }
          if (command === 'set') {
            p.values[source] = numberOrString(target, p.values)
            p.index++
          }
          if (command === 'add') {
            p.values[source] += numberOrString(target, p.values)
            p.index++
          }
          if (command === 'mul') {
            p.values[source] *= numberOrString(target, p.values)
            p.index++
          }
          if (command === 'mod') {
            p.values[source] %= numberOrString(target, p.values)
            p.index++
          }
          if (command === 'rcv') {
            // source has to be a string. can't receive a number
            if (programs[otherProgramIndex].queue.length > 0) {
              p.values[source] = programs[otherProgramIndex].queue.splice(-1)[0]
              p.index++
            } else {
              p.status = 'waiting'
            }
          }
          if (command === 'jgz') {
            let amount = numberOrString(source, p.values)
            p.index += amount > 0 ? +numberOrString(target, p.values) : 1
          }
        } else {
          if (p.queue.length > 0) {
            p.values[source] = p.queue.pop()!
            p.status = 'processing'
            p.index++
          }
        }
        log.debug('end  ', pIndex, JSON.stringify(p))
      })
    }
    return count
  }

  if (!params.skipPart1) {
    part1 = solveForPart1(instructions)
  }
  if (!params.skipPart2) {
    part2 = solveForPart2(instructions)
  }

  return { part1, part2 }
}
