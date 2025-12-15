import { Params } from 'aoc.d'
import { arraysEqual } from 'util/array'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  type Machine = {
    lights: string
    buttons: number[][]
    joltage: number[]
  }

  let machines: Machine[] = []
  for await (const line of lineReader) {
    let machine: Partial<Machine> = { buttons: [] }
    line.split(' ').forEach((l: string) => {
      if (l.startsWith('[')) machine.lights = l.replaceAll(/[\[\]]/g, '')
      if (l.startsWith('('))
        machine.buttons!.push(
          l
            .replaceAll(/[\(\)]/g, '')
            .split(',')
            .map(Number)
        )
      if (l.startsWith('{'))
        machine.joltage = l
          .replaceAll(/[\{\}]/g, '')
          .split(',')
          .map(Number)
    })
    machines.push(machine as Machine)
  }

  const pressButtonForLight = (lights: string, button: number[]): string => {
    let newLights: string[] = lights.split('')
    button.forEach((b) => (newLights[b] = newLights[b] === '.' ? '#' : '.'))
    return newLights.join('')
  }

  const pressButtonForJoltage = (joltage: string, button: number[], targetJoltage: number[]): string => {
    let newJoltage: number[] = joltage.split(',').map(Number)
    button.forEach((b) => newJoltage[b]++)
    // overflow check
    if (newJoltage.some((j, i) => j > targetJoltage[i])) return ''
    return newJoltage.join(',')
  }

  const searchJoltage = (machine: Machine): number => {
    let iteration = 0
    let joltageQueue = new Set<string>()
    let targetJoltage = machine.joltage.join(',')
    joltageQueue.add(machine.joltage.map(() => 0).join(','))
    let cache: Record<string, number> = {}
    cache[machine.joltage.join(',')] = 0
    outer: do {
      iteration++
      let newJoltageQueue = new Set<string>()
      for (const joltage of joltageQueue) {
        for (const button of machine.buttons) {
          // if we have this joltage config from older iterations, then don't bother
          if (!!cache[joltage] && cache[joltage] < iteration) continue
          let newJoltage = pressButtonForJoltage(joltage, button, machine.joltage)
          if (newJoltage.length > 0) {
            if (newJoltage === targetJoltage) break outer
            newJoltageQueue.add(newJoltage)
          }
        }
      }
      joltageQueue = newJoltageQueue
      log.info('iteration', iteration, 'machine', machine, 'list', joltageQueue.size)
    } while (true)
    log.info('iteration', iteration, 'machine', machine)
    return iteration
  }

  const searchButtons = (machine: Machine): number => {
    let iteration = 0
    let lightsQueue = new Set<string>()
    lightsQueue.add(machine.lights.replaceAll('#', '.'))
    let cache: Record<string, number> = {}
    cache[machine.lights.replaceAll('#', '.')] = 0
    outer: do {
      iteration++
      let newLightsQueue = new Set<string>()
      for (const light of lightsQueue) {
        for (const button of machine.buttons) {
          // if we have this light config from older iterations, then don't bother
          if (!!cache[light] && cache[light] < iteration) continue
          let newLight = pressButtonForLight(light, button)
          if (newLight === machine.lights) break outer
          else newLightsQueue.add(newLight)
        }
      }
      lightsQueue = newLightsQueue
    } while (true)
    return iteration
  }

  if (!params.skipPart1) part1 = machines.reduce((acc, machine) => acc + searchButtons(machine), 0)
  if (!params.skipPart2) part2 = machines.reduce((acc, machine) => acc + searchJoltage(machine), 0)

  return { part1, part2 }
}
