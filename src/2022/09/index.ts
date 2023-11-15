import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  type Rope = Array<Array<number>>
  type RopePosition = Record<string, any>

  const moveHead = (pos: Array<number>, position: string): Array<number> => {
    if (position === 'L') {
      return [pos[0] - 1, pos[1]]
    }
    if (position === 'R') {
      return [pos[0] + 1, pos[1]]
    }
    if (position === 'U') {
      return [pos[0], pos[1] - 1]
    }
    // if (position === 'D') {
    return [pos[0], pos[1] + 1]
  }

  const moveTail = (tailPos: Array<number>, headPos: Array<number>) => {
    const diffX = headPos[0] - tailPos[0]
    const diffY = headPos[1] - tailPos[1]
    if (Math.abs(diffX) <= 1 && Math.abs(diffY) <= 1) {
      return tailPos
    }
    // real movement starts when there is a 2 difference
    const newX = diffX === 0 ? diffX : diffX / Math.abs(diffX)
    const newY = diffY === 0 ? diffY : diffY / Math.abs(diffY)
    return [tailPos[0] + newX, tailPos[1] + newY]
  }

  const moveRope = (amount: number, rope: Rope, direction: string, ropePosition: RopePosition) => {
    for (let i = 0; i < amount; i++) {
      rope[0] = moveHead(rope[0], direction)
      for (let j = 1; j < rope.length; j++) {
        rope[j] = moveTail(rope[j], rope[j - 1])
      }
      ropePosition['' + rope[rope.length - 1][0] + ';' + rope[rope.length - 1][1]] = 1
    }
  }

  const rope1: Rope = new Array(params!.part1.ropeLength).fill([0, 0])
  const rope2: Rope = new Array(params!.part2.ropeLength).fill([0, 0])
  const allTailPos1: RopePosition = {}
  const allTailPos2: RopePosition = {}

  for await (const line of lineReader) {
    const vals = line.split(' ')
    const direction = vals[0]
    const amount = parseInt(vals[1])

    if (params.part1?.skip !== true) {
      moveRope(amount, rope1, direction, allTailPos1)
    }

    if (params.part2?.skip !== true) {
      moveRope(amount, rope2, direction, allTailPos2)
    }
  }

  return {
    part1: Object.keys(allTailPos1).length,
    part2: Object.keys(allTailPos2).length
  }
}
