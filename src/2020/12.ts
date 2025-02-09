import { Params } from 'aoc.d'
import { Location, LocationPlus } from 'declarations'
import { getManhattanDistance } from 'util/location'

type Instruction = [string, number]
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const solveForPart1 = (instructions: Instruction[]): number => {
    let position: LocationPlus<string> = [0, 0, '>']
    let directions: string[] = ['>', 'v', '<', '^']
    for (let instruction of instructions) {
      if (instruction[0] === 'N') position[0] -= instruction[1]
      else if (instruction[0] === 'S') position[0] += instruction[1]
      else if (instruction[0] === 'W') position[1] -= instruction[1]
      else if (instruction[0] === 'E') position[1] += instruction[1]
      else if (instruction[0] === 'R') {
        let newIndex = (directions.indexOf(position[2]) + instruction[1] / 90) % directions.length
        position[2] = directions[newIndex]
      } else if (instruction[0] === 'L') {
        let newIndex = (directions.indexOf(position[2]) - instruction[1] / 90 + directions.length) % directions.length
        position[2] = directions[newIndex]
      } else {
        //if (instruction[0] === 'F') {
        if (position[2] === '>') position[1] += instruction[1]
        if (position[2] === '<') position[1] -= instruction[1]
        if (position[2] === 'v') position[0] += instruction[1]
        if (position[2] === '^') position[0] -= instruction[1]
      }
    }
    return getManhattanDistance([0, 0], [position[0], position[1]])
  }

  const rotate = (waypoint: Location, amount: number): Location => {
    let newWaypoint: Location = [0, 0]
    if (amount === 1 || amount === -3) newWaypoint = [waypoint[1], -1 * waypoint[0]] // rotate 90
    if (amount === 2 || amount === -2) newWaypoint = [-1 * waypoint[0], -1 * waypoint[1]] // rotate 180
    if (amount === 3 || amount === -1) newWaypoint = [-1 * waypoint[1], waypoint[0]] // rotate -90
    return newWaypoint
  }

  const forward = (position: Location, waypoint: Location, amount: number) => {
    position[0] += waypoint[0] * amount
    position[1] += waypoint[1] * amount
  }

  const solveForPart2 = (instructions: Instruction[]): number => {
    let position: Location = [0, 0]
    let waypoint: Location = [-1, 10]
    for (let instruction of instructions) {
      if (instruction[0] === 'N') waypoint[0] -= instruction[1]
      else if (instruction[0] === 'S') waypoint[0] += instruction[1]
      else if (instruction[0] === 'W') waypoint[1] -= instruction[1]
      else if (instruction[0] === 'E') waypoint[1] += instruction[1]
      else if (instruction[0] === 'R') waypoint = rotate(waypoint, instruction[1] / 90)
      else if (instruction[0] === 'L') waypoint = rotate(waypoint, (-1 * instruction[1]) / 90)
      //else if (instruction[0] === 'F')
      else forward(position, waypoint, instruction[1])
    }
    return getManhattanDistance([0, 0], position)
  }

  let instructions: Instruction[] = []
  for await (const line of lineReader) instructions.push([line[0], +line.substring(1, line.length)])

  if (!params.skipPart1) part1 = solveForPart1(instructions)
  if (!params.skipPart2) part2 = solveForPart2(instructions)

  return { part1, part2 }
}
