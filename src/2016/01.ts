import { Location } from 'declarations'

export default async (lineReader: any) => {
  let part1: number = 0
  let part2: number = 0

  const point: Location = [0, 0]
  const directions: string[] = ['>', 'v', '<', '^']
  const directionsMap: Record<string, Location> = { '>': [1, 0], v: [0, 1], '<': [-1, 0], '^': [0, -1] }
  let currentDirection: string = '^'
  const visitedPoints: Set<string> = new Set()
  let visitedPoint: Location | undefined = undefined

  for await (const line of lineReader) {
    line.split(', ').forEach((value: string) => {
      let instruction: [string, number] = [value[0], +value.substring(1, value.length)]

      const newIndex: number =
        instruction[0] === 'L'
          ? (directions.indexOf(currentDirection) - 1 + directions.length) % directions.length
          : (directions.indexOf(currentDirection) + 1) % directions.length
      currentDirection = directions[newIndex]

      if (!visitedPoint) {
        // using a for for part2, so I don't jump over overlapping positions,
        for (let i = 0; i < instruction[1]; i++) {
          point[0] += directionsMap[currentDirection][0]
          point[1] += directionsMap[currentDirection][1]
          let key = point.join(',')
          if (!visitedPoint && visitedPoints.has(key)) visitedPoint = [...point]
          else visitedPoints.add(key)
        }
      } else {
        point[0] += directionsMap[currentDirection][0] * instruction[1]
        point[1] += directionsMap[currentDirection][1] * instruction[1]
      }
    })

    part1 = Math.abs(point[0]) + Math.abs(point[1])
    part2 = Math.abs(visitedPoint?.[0] ?? 0) + Math.abs(visitedPoint?.[1] ?? 0)
  }

  return { part1, part2 }
}
