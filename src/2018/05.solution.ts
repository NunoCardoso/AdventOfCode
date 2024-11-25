import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let polymer: string = ''
  for await (const line of lineReader) {
    polymer = line
  }

  const canReact = (char1: string, char2: string) =>
    char1 !== char2 && char1.toLowerCase() === char2.toLowerCase()

  const react = (polymer: string, index: number): [string, number] => {
    if (canReact(polymer[index], polymer[index + 1])) {
      polymer = polymer.substring(0, index) + polymer.substring(index + 2, polymer.length)
      let newIndex = index > 0 ? index - 1 : index
      return [polymer, newIndex]
    }
    return [polymer, index + 1]
  }

  const solveFor = (polymer: string): number => {
    let index = 0
    while (index < polymer.length - 1) {
      ;[polymer, index] = react(polymer, index)
    }
    return polymer.length
  }

  if (!params.skipPart1) {
    part1 = solveFor(polymer)
  }
  if (!params.skipPart2) {
    // going to Set then back to Array does unique filter
    let uniqueUnits = [...new Set(polymer.toLowerCase().split(''))]
    let minPolymerSize = polymer.length

    uniqueUnits.forEach((unit) => {
      let partialPolymer = polymer.replaceAll(unit.toLowerCase(), '').replaceAll(unit.toUpperCase(), '')
      let thisMin = solveFor(partialPolymer)
      if (thisMin < minPolymerSize) minPolymerSize = thisMin
    })

    part2 = minPolymerSize
  }

  return { part1, part2 }
}
