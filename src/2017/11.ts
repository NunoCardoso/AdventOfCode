import { Params } from 'aoc.d'
import { Location } from 'declarations'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const newMove = (location: Location, value: string): Location => {
    if (value === 'n') return [location[0], location[1] + 2]
    if (value === 's') return [location[0], location[1] - 2]
    if (value === 'ne') return [location[0] + 1.5, location[1] + 1]
    if (value === 'se') return [location[0] + 1.5, location[1] - 1]
    if (value === 'nw') return [location[0] - 1.5, location[1] + 1]
    //sw
    return [location[0] - 1.5, location[1] - 1]
  }

  const getStepsFrom = (location: Location, steps: number = 0): number => {
    // get the increment step to go to 0,0
    let increment = [location[0] >= 0 ? -1.5 : 1.5, location[1] >= 0 ? -1 : 1]
    let stepsX = Math.abs(location[0] / increment[0])
    let stepsY = Math.abs(location[1] / increment[1])

    if (stepsX >= stepsY) {
      // x axis hit first
      let remainerX = location[0] + increment[0] * stepsY
      return stepsY + Math.abs(remainerX / 1.5)
    }

    let remainerY = location[1] + increment[1] * stepsX
    return stepsX + Math.abs(remainerY / 2)
  }

  let steps: string[] = []
  for await (const line of lineReader) steps = line.split(',')

  let location: Location = [0, 0]
  let maximumDistance: number = 0
  let distance: number = 0
  steps.forEach((step) => {
    location = newMove(location, step)
    distance = getStepsFrom(location)
    if (maximumDistance < distance) maximumDistance = distance
  })
  let part1 = distance
  let part2 = maximumDistance

  return { part1, part2 }
}
