import { Params } from 'aoc.d'
import _ from 'lodash'

type RGB = [number | undefined, number | undefined, number | undefined]

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const games: Array<Array<RGB>> = []

  for await (const line of lineReader) {
    const game: Array<RGB> = []
    line
      .substring(line.indexOf(':') + 1, line.length)
      .trim()
      .split(';')
      .forEach((s: string) => {
        const subgame: RGB = [undefined, undefined, undefined]
        s.trim()
          .split(',')
          .forEach((_s) => {
            const __s = _s.trim().split(/\s+/)
            if (__s[1] === 'red') {
              subgame[0] = parseInt(__s[0])
            }
            if (__s[1] === 'green') {
              subgame[1] = parseInt(__s[0])
            }
            if (__s[1] === 'blue') {
              subgame[2] = parseInt(__s[0])
            }
          })
        game.push(subgame)
      })
    games.push(game)
  }

  for (let i = 0; i < games.length; i++) {
    const minCubes: RGB = [undefined, undefined, undefined]
    let passed = true
    for (let j = 0; j < games[i].length; j++) {
      if (_.isNumber(games[i][j][0])) {
        if (games[i][j][0]! > params.cubes[0]) {
          passed = false
        }
        if (minCubes[0] === undefined || games[i][j][0]! > minCubes[0]) {
          minCubes[0] = games[i][j][0]
        }
      }
      if (_.isNumber(games[i][j][1])) {
        if (games[i][j][1]! > params.cubes[1]) {
          passed = false
        }
        if (minCubes[1] === undefined || games[i][j][1]! > minCubes[1]) {
          minCubes[1] = games[i][j][1]
        }
      }

      if (_.isNumber(games[i][j][2])) {
        if (games[i][j][2]! > params.cubes[2]) {
          passed = false
        }
        if (minCubes[2] === undefined || games[i][j][2]! > minCubes[2]) {
          minCubes[2] = games[i][j][2]
        }
      }
    }
    if (passed) {
      part1 += i + 1
    }
    part2 += minCubes[0]! * minCubes[1]! * minCubes[2]!
  }

  return { part1, part2 }
}
