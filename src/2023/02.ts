import { Params } from 'aoc.d'

type RGB = [number, number, number]

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const games: RGB[][] = []

  for await (const line of lineReader) {
    games.push(
      line
        .substring(line.indexOf(':') + 1, line.length)
        .split(';')
        .map((roundString: string) => {
          const round: RGB = [0, 0, 0]
          roundString.split(',').forEach((pair) => {
            const [key, value] = pair.trim().split(/\s+/)
            if (value === 'red') round[0] = +key
            if (value === 'green') round[1] = +key
            if (value === 'blue') round[2] = +key
          })
          return round
        })
    )
  }

  games.forEach((game, gameIndex) => {
    const minimumCubes: RGB = [0, 0, 0]
    let passed = true
    game.forEach((cubeSet) => {
      cubeSet.forEach((color, index) => {
        if (color > params.cubes[index]) passed = false
        if (color > minimumCubes[index]) minimumCubes[index] = color
      })
    })
    if (passed) part1 += gameIndex + 1
    part2 += minimumCubes.reduce((a: number, b: number) => a * b, 1)
  })

  return { part1, part2 }
}
