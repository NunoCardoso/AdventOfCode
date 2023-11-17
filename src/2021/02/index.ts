import { Params } from 'aoc.d'

type Coord = {
  action: string
  amount: number
}
export default async (lineReader: any, params: Params) => {
  const data: Array<Coord> = []

  for await (const line of lineReader) {
    const raw = line.split(' ')
    data.push({ action: raw[0], amount: parseInt(raw[1]) })
  }

  const part1 = () => {
    let distance: number = 0
    let depth: number = 0
    data.forEach((coord) => {
      switch (coord.action) {
        case 'forward':
          distance += coord.amount
          return
        case 'up':
          depth += -1 * coord.amount
          return
        case 'down':
          depth += coord.amount
      }
    })
    return depth * distance
  }

  const part2 = () => {
    let distance: number = 0
    let aim: number = 0
    let depth: number = 0
    data.forEach((coord) => {
      switch (coord.action) {
        case 'forward':
          distance += coord.amount
          depth += coord.amount * aim
          return
        case 'up':
          aim += -1 * coord.amount
          return
        case 'down':
          aim += coord.amount
      }
    })
    return depth * distance
  }

  return {
    part1: params.part2?.skip !== true ? part1() : 0,
    part2: params.part2?.skip !== true ? part2() : 0
  }
}
