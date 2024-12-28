import { Point } from 'declarations'

export default async (lineReader: any) => {
  let part1: number = 0
  let part2: number = 0
  const instructions: Array<[string, number]> = []
  const point: Point = [0, 0]
  const directions: Array<string> = ['>', 'v', '<', '^']
  const directionsMap: Record<string, Point> = { '>': [1, 0], v: [0, 1], '<': [-1, 0], '^': [0, -1] }
  let currentDirection: string = ''
  const visitedPoints: Set<string> = new Set()
  let visitedPoint: Point | undefined

  for await (const line of lineReader) {
    line.split(', ').forEach((value: string) => instructions.push([value[0], +value.substring(1, value.length)]))
  }

  instructions.forEach((instruction) => {
    if (currentDirection === '') {
      currentDirection = instruction[0] === 'L' ? '<' : '>'
    } else {
      const newIndex: number =
        instruction[0] === 'L' ? (directions.indexOf(currentDirection) - 1 + directions.length) % directions.length : (directions.indexOf(currentDirection) + 1) % directions.length
      currentDirection = directions[newIndex]
    }

    if (!visitedPoint) {
      for (let i = 0; i < instruction[1]; i++) {
        point[0] += directionsMap[currentDirection][0]
        point[1] += directionsMap[currentDirection][1]
        if (!visitedPoint && visitedPoints.has(point[0] + ',' + point[1])) visitedPoint = [point[0], point[1]]
        else visitedPoints.add(point[0] + ',' + point[1])
      }
    } else {
      point[0] += directionsMap[currentDirection][0] * instruction[1]
      point[1] += directionsMap[currentDirection][1] * instruction[1]
    }
  })

  part1 = Math.abs(point[0]) + Math.abs(point[1])
  if (visitedPoint) part2 = Math.abs(visitedPoint[0]) + Math.abs(visitedPoint[1])

  return { part1, part2 }
}
