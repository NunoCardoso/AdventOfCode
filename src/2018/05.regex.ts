import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let polymer: string = ''
  for await (const line of lineReader) polymer = line

  const solveFor = (polymer: string, uniqueUnits: string[]): string => {
    let pattern = uniqueUnits.map((u) => u + u.toUpperCase() + '|' + u.toUpperCase() + u).join('|')
    let re = new RegExp(`(${pattern})`, 'g')
    let length = polymer.length
    do {
      length = polymer.length
      polymer = polymer.replaceAll(re, '')
    } while (polymer.length !== length)

    return polymer
  }

  if (!params.skipPart1) {
    let uniqueUnits = [...new Set(polymer.toLowerCase().split(''))]
    part1 = solveFor(polymer, uniqueUnits).length
  }
  if (!params.skipPart2) {
    // going to Set then back to Array does unique filter
    let uniqueUnits = [...new Set(polymer.toLowerCase().split(''))]
    let minPolymerSize = polymer.length
    uniqueUnits.forEach((unit) => {
      let pattern = new RegExp(`[${unit}${unit.toUpperCase()}]`, 'g')
      let partialPolymer = polymer.replaceAll(pattern, '')

      let thisMin = solveFor(partialPolymer, uniqueUnits).length
      if (thisMin < minPolymerSize) minPolymerSize = thisMin
    })

    part2 = minPolymerSize
  }

  return { part1, part2 }
}
