import { Location } from 'declarations'

export default async (lineReader: any) => {
  const locationsPart1 = new Set<string>()
  const currentPositionPart1: Location = [0, 0]

  const locationsPart2 = new Set<string>()
  const currentPositionSantaPart2: Location = [0, 0]
  const currentPositionRobotSantaPart2: Location = [0, 0]

  const move = (direction: string, location: Location, map: Set<string>) => {
    if (direction === '^') location[1]--
    if (direction === 'v') location[1]++
    if (direction === '<') location[0]--
    if (direction === '>') location[0]++
    map.add(location[0] + ',' + location[1])
  }

  for await (const line of lineReader) {
    line.split('').forEach((direction: string, i: number) => {
      move(direction, currentPositionPart1, locationsPart1)
      move(direction, i % 2 === 1 ? currentPositionRobotSantaPart2 : currentPositionSantaPart2, locationsPart2)
    })
  }

  return {
    part1: locationsPart1.size,
    part2: locationsPart2.size
  }
}
