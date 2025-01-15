import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getCurrentMarble = (currentMarble: number, marbles: number[]): number =>
    ((currentMarble + 1) % marbles.length) + 1

  const goBackMarble = (currentMarble: number, marbles: number[]): number =>
    (currentMarble - 7 + marbles.length) % marbles.length

  let players: number = 0
  let points: number = 0

  for await (const line of lineReader) {
    let matches = line.match(/(\d+) players; last marble is worth (\d+) points/).map(Number)
    players = matches[1]
    points = matches[2]
  }

  const solveFor = (players: number, points: number): number => {
    let scores: Record<number, number> = {}
    let marbles = [0]
    let currentMarble = 0
    let currentPlayer = 1

    let i = 1
    while (i <= points) {
      if (i % 23 === 0) {
        if (!scores[currentPlayer]) scores[currentPlayer] = 0
        scores[currentPlayer] += i
        currentMarble = goBackMarble(currentMarble, marbles)
        scores[currentPlayer] += marbles[currentMarble]
        marbles.splice(currentMarble, 1)
      } else {
        currentMarble = getCurrentMarble(currentMarble, marbles)
        marbles.splice(currentMarble, 0, i)
      }
      //log.debug('[' + currentPlayer + '] ' +
      //    marbles.map((m, i) => (i === currentMarble ? '(' + m + ')' :  m )
      //  ).join(' '))

      currentPlayer = (currentPlayer + 1) % players
      i++
      if (i % 100000 === 0) log.info('i', i)
    }
    return Object.values(scores).sort((a, b) => b - a)[0]
  }

  if (!params.skipPart1) {
    part1 = solveFor(players, points)
  }
  if (!params.skipPart2) {
    part2 = solveFor(players, points * 100)
  }

  return { part1, part2 }
}
