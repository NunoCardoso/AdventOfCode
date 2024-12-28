import { Params } from 'aoc.d'

type RGB = [number?, number?, number?]

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const games: Array<Array<RGB>> = []

  for await (const line of lineReader) {
    games.push(
      line
        .substring(line.indexOf(':') + 1, line.length)
        .split(';')
        .map((roundString: string) => {
          const round: RGB = []
          roundString
            .trim()
            .split(',')
            .forEach((pair) => {
              const [key, value] = pair.trim().split(/\s+/)
              if (value === 'red') round[0] = +key
              if (value === 'green') round[1] = +key
              if (value === 'blue') round[2] = +key
            })
          return round
        })
    )
  }

  games.forEach((game, i) => {
    const minimumCubes: RGB = []
    let passed = true
    game.forEach((round) => {
      ;[0, 1, 2].forEach((index) => {
        if (round[index]) {
          if (round[index]! > params.cubes[index]) passed = false
          if (!minimumCubes[index] || round[index]! > minimumCubes[index]!) minimumCubes[index] = round[index]
        }
      })
    })
    if (passed) part1 += i + 1
    part2 += minimumCubes[0]! * minimumCubes[1]! * minimumCubes[2]!
  })

  return { part1, part2 }
}
