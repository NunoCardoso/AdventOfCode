import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let polymer: string = ''
  for await (const line of lineReader) polymer = line

  const canReact = (char1: string, char2: string) => char1 !== char2 && char1.toLowerCase() === char2.toLowerCase()

  const solveFor = (polymer: string): number => {
    let newPolymer: string[] = []
    for (let i = 0; i < polymer.length; i++) {
      let char = polymer[i]
      if (newPolymer.length > 0 && canReact(newPolymer[newPolymer.length - 1]?.[0], char)) {
        newPolymer.pop()
      } else {
        newPolymer.push(char)
      }
    }
    return newPolymer.length
  }

  if (!params.skipPart1) {
    part1 = solveFor(polymer)
  }
  if (!params.skipPart2) {
    // going to Set then back to Array does unique filter
    let uniqueUnits = [...new Set(polymer.toLowerCase().split(''))]
    let minPolymerSize = polymer.length
    uniqueUnits.forEach((unit) => {
      let pattern = new RegExp(`[${unit}${unit.toUpperCase()}]`, 'g')
      let partialPolymer = polymer.replaceAll(pattern, '')
      let thisMin = solveFor(partialPolymer)
      if (thisMin < minPolymerSize) minPolymerSize = thisMin
    })

    part2 = minPolymerSize
  }

  return { part1, part2 }
}
