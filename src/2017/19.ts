import { Params } from 'aoc.d'
import { LocationPlus, World } from 'declarations'

type Packet = LocationPlus<string>

type WorldLocation = LocationPlus<string>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const getWorldLocation = (world: World<string>, row: number, col: number): WorldLocation | null => {
    if (row < 0 || row >= world.length || col < 0 || col >= world[row].length) return null
    return [row, col, world[row][col]]
  }

  const move = (location: Packet, world: World<string>, letters: string[]): Packet | null => {
    let newPacketLocation: Packet = location
    if (newPacketLocation[2] === '^') newPacketLocation = [location[0] - 1, location[1], newPacketLocation[2]]
    if (newPacketLocation[2] === 'v') newPacketLocation = [location[0] + 1, location[1], newPacketLocation[2]]
    if (newPacketLocation[2] === '<') newPacketLocation = [location[0], location[1] - 1, newPacketLocation[2]]
    if (newPacketLocation[2] === '>') newPacketLocation = [location[0], location[1] + 1, newPacketLocation[2]]
    let newLoc = getWorldLocation(world, newPacketLocation[0], newPacketLocation[1])
    // assuming that it will end on a space. If it ended on another road, this would not work
    if (!newLoc || newLoc[2] === ' ') return null

    if (newLoc[2]!.match(/[A-Z]/)) {
      letters.push(newLoc[2]!)
      return newPacketLocation
    }
    // we only change direction with + and if we cannot keep going straight
    if (newLoc[2] === '+') {
      // trim makes ' ' to '', to get as false
      let charOnTop: string | undefined = getWorldLocation(world, newLoc[0] - 1, newLoc[1])?.[2]?.trim()
      let charOnBottom: string | undefined = getWorldLocation(world, newLoc[0] + 1, newLoc[1])?.[2]?.trim()
      let charOnLeft: string | undefined = getWorldLocation(world, newLoc[0], newLoc[1] - 1)?.[2]?.trim()
      let charOnRight: string | undefined = getWorldLocation(world, newLoc[0], newLoc[1] + 1)?.[2]?.trim()
      if (newPacketLocation[2] === '^') {
        if (!!charOnLeft && !charOnRight) newPacketLocation[2] = '<'
        if (!charOnLeft && !!charOnRight) newPacketLocation[2] = '>'
      } else if (newPacketLocation[2] === 'v') {
        if (!!charOnLeft && !charOnRight) newPacketLocation[2] = '<'
        if (!charOnLeft && !!charOnRight) newPacketLocation[2] = '>'
      } else if (newPacketLocation[2] === '<') {
        if (!!charOnTop && !charOnBottom) newPacketLocation[2] = '^'
        if (!charOnTop && !!charOnBottom) newPacketLocation[2] = 'v'
      } else if (newPacketLocation[2] === '>') {
        if (!!charOnTop && !charOnBottom) newPacketLocation[2] = '^'
        if (!charOnTop && !!charOnBottom) newPacketLocation[2] = 'v'
      }
    }
    return newPacketLocation
  }

  let world: World<string> = []
  let rowIndex: number = 0
  let location: Packet | null = [0, 0, 'v']

  for await (const line of lineReader) {
    if (rowIndex === 0) location = [0, line.indexOf('|'), 'v']
    world.push(line.split(''))
    rowIndex++
  }

  let letters: string[] = []
  //let newLocation: Packet | null  = [...location]
  let iteration: number = 0
  do {
    location = move(location!, world, letters)
    iteration++
  } while (!!location)
  let part1 = letters.join('')
  let part2 = iteration

  return { part1, part2 }
}
