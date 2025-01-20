import { Params } from 'aoc.d'
import { intersection } from 'lodash'

type Orbits = Record<string, string>
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let planets: Set<string> = new Set<string>()
  let orbits: Orbits = {}
  for await (const line of lineReader) {
    let [from, to] = line.split(')')
    orbits[to] = from
    planets.add(from)
    planets.add(to)
  }

  const distanceFrom = (from: string, to: string, orbits: Orbits): string[] => {
    let currentPlanets: string[] = [from]
    while (currentPlanets[currentPlanets.length - 1] !== to) {
      let planet = currentPlanets[currentPlanets.length - 1]
      currentPlanets.push(orbits[planet])
    }
    return currentPlanets
  }

  const solveFor = (planets: string[], orbits: Orbits): number =>
    planets.reduce((acc, planet) => {
      if (planet === 'COM') return acc
      return acc + distanceFrom(planet, 'COM', orbits).length - 1 // do not use the initial planet
    }, 0)

  const solveForPart2 = (planets: string[], orbits: Orbits): number => {
    let youConnection = distanceFrom(orbits['YOU'], 'COM', orbits)
    let sanConnection = distanceFrom(orbits['SAN'], 'COM', orbits)
    let intersect = intersection(youConnection, sanConnection)
    return youConnection.indexOf(intersect[0]) + sanConnection.indexOf(intersect[0])
  }

  if (!params.skipPart1) part1 = solveFor([...planets], orbits)
  if (!params.skipPart2) part2 = solveForPart2([...planets], orbits)

  return { part1, part2 }
}
