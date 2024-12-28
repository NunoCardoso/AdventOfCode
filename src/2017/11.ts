import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let values: string[] = []
  for await (const line of lineReader) {
    values = line.split(',')
  }

  const getDistance = (position: number[]) => Math.sqrt(position[0] * position[0] + position[1] * position[1])

  const newMove = (position: number[], value: string) => {
    if (value === 'n') return [position[0], position[1] - 2]
    if (value === 's') return [position[0], position[1] + 2]
    if (value === 'ne') return [position[0] + 1.5, position[1] - 1]
    if (value === 'se') return [position[0] + 1.5, position[1] + 1]
    if (value === 'nw') return [position[0] - 1.5, position[1] - 1]
    //sw
    return [position[0] - 1.5, position[1] + 1]
  }

  const getStepsFrom = (position: number[], steps: number = 0): number => {
    if (position[0] === 0 && position[1] === 0) return steps
    let candidates: Record<string, number> = {
      n: getDistance(newMove(position, 'n')),
      s: getDistance(newMove(position, 's')),
      ne: getDistance(newMove(position, 'ne')),
      se: getDistance(newMove(position, 'se')),
      sw: getDistance(newMove(position, 'sw')),
      nw: getDistance(newMove(position, 'nw'))
    }
    let sorted = Object.keys(candidates).sort((a, b) => candidates[a] - candidates[b])
    return getStepsFrom(newMove(position, sorted[0]), steps + 1)
  }

  let position = [0, 0]
  let maximumDistance: number = 0
  let lastDistance: number = 0
  values.forEach((value) => {
    position = newMove(position, value)
    lastDistance = getStepsFrom(position)
    if (maximumDistance < lastDistance) maximumDistance = lastDistance
  })
  // console.log('I am in ', position)
  let part1 = lastDistance
  let part2 = maximumDistance

  return { part1, part2 }
}
