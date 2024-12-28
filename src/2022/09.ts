import { Params } from 'aoc.d'

// direction, amount
type Rope = Array<Array<number>>
type RopePosition = Record<string, any>
type Direction = [string, number]

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const moveHead = (pos: Array<number>, position: string): Array<number> => {
    if (position === 'L') return [pos[0] - 1, pos[1]]
    if (position === 'R') return [pos[0] + 1, pos[1]]
    if (position === 'U') return [pos[0], pos[1] - 1]
    return [pos[0], pos[1] + 1] // if (position === 'D') {
  }

  const moveTail = (tailPos: Array<number>, headPos: Array<number>) => {
    const diffX = Math.abs(headPos[0] - tailPos[0])
    const diffY = Math.abs(headPos[1] - tailPos[1])
    if (diffX <= 1 && diffY <= 1) return tailPos
    // real movement starts when there is a 2 difference
    const newX = diffX === 0 ? diffX : (headPos[0] - tailPos[0]) / diffX
    const newY = diffY === 0 ? diffY : (headPos[1] - tailPos[1]) / diffY
    return [tailPos[0] + newX, tailPos[1] + newY]
  }

  const moveRope = (direction: Direction, rope: Rope, ropePosition: RopePosition) => {
    for (let i = 0; i < direction[1]; i++) {
      rope[0] = moveHead(rope[0], direction[0])
      for (let j = 1; j < rope.length; j++) {
        rope[j] = moveTail(rope[j], rope[j - 1])
      }
      ropePosition.add(rope[rope.length - 1][0] + ';' + rope[rope.length - 1][1])
    }
  }

  const directions: Array<Direction> = []

  for await (const line of lineReader) {
    const [direction, amount] = line.split(' ')
    directions.push([direction, +amount])
  }

  const solveFor = (length: number): number => {
    const tailPositions: Set<string> = new Set()
    const rope: Rope = new Array(length).fill([0, 0])
    directions.forEach((d) => moveRope(d, rope, tailPositions))
    return tailPositions.size
  }

  if (!params.skipPart1) part1 = solveFor(params!.ropeLength.part1)
  if (!params.skipPart2) part2 = solveFor(params!.ropeLength.part2)

  return { part1, part2 }
}
