import { Params } from 'aoc.d'
import { Location } from 'declarations'
import { getKey } from 'util/location'

// direction, amount
type Rope = Location[]
type RopePosition = Set<string>
type Direction = [string, number]

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const moveHead = (location: Location, direction: string): Location => {
    if (direction === 'L') return [location[0] - 1, location[1]]
    if (direction === 'R') return [location[0] + 1, location[1]]
    if (direction === 'U') return [location[0], location[1] - 1]
    return [location[0], location[1] + 1] // if (position === 'D') {
  }

  const moveTail = (tailLocation: Location, headLocation: Location): Location => {
    const diffX = Math.abs(headLocation[0] - tailLocation[0])
    const diffY = Math.abs(headLocation[1] - tailLocation[1])
    if (diffX <= 1 && diffY <= 1) return tailLocation
    // real movement starts when there is a 2 difference
    const newX = diffX === 0 ? diffX : (headLocation[0] - tailLocation[0]) / diffX
    const newY = diffY === 0 ? diffY : (headLocation[1] - tailLocation[1]) / diffY
    return [tailLocation[0] + newX, tailLocation[1] + newY]
  }

  const moveRope = (direction: Direction, rope: Rope, ropePosition: RopePosition) => {
    for (let i = 0; i < direction[1]; i++) {
      rope[0] = moveHead(rope[0], direction[0])
      for (let j = 1; j < rope.length; j++) {
        rope[j] = moveTail(rope[j], rope[j - 1])
      }
      ropePosition.add(getKey(rope[rope.length - 1]))
    }
  }

  const solveFor = (ropeLength: number): number => {
    const tailPositions: RopePosition = new Set()
    const rope: Rope = new Array<Location>(ropeLength).fill([0, 0])
    directions.forEach((d) => moveRope(d, rope, tailPositions))
    return tailPositions.size
  }

  const directions: Direction[] = []

  for await (const line of lineReader) {
    const [direction, amount] = line.split(' ')
    directions.push([direction, +amount])
  }

  part1 = solveFor(params!.ropeLength.part1)
  part2 = solveFor(params!.ropeLength.part2)

  return { part1, part2 }
}
