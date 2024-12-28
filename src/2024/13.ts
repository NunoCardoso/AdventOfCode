import { Params } from 'aoc.d'
import { Point } from 'declarations'

type Game = {
  buttons: Record<string, Point>
  prize: Point
}

type ArcadeMachine = Game[]

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const prices = { A: 3, B: 1 }
  let arcadePart1: ArcadeMachine = []
  let arcadePart2: ArcadeMachine = []
  let tempButtons: Record<string, Point> = {}

  for await (const line of lineReader) {
    if (line?.startsWith('Button')) {
      const [, button, x, y] = line.match(/Button (\w+): X\+(\d+), Y\+(\d+)/)
      tempButtons[button] = [+x, +y]
    }
    if (line?.startsWith('Prize')) {
      const [, x, y] = line.match(/Prize: X=(\d+), Y=(\d+)/)
      arcadePart1.push({ buttons: global.structuredClone(tempButtons), prize: [+x, +y] })
      arcadePart2.push({
        buttons: global.structuredClone(tempButtons),
        prize: [+x + 10000000000000, +y + 10000000000000]
      })
    }
  }

  const calculatePrize = (game: Game): number => {
    //(a.x * i + b.x * j = prize.x)
    //(a.y * i + b.y * j = prize.y)
    // => i = (prize.x * b.y - b.x * prize.y)/(a.x * b.y - a.y * b.x)
    let i =
      (game.prize[0] * game.buttons['B'][1] - game.buttons['B'][0] * game.prize[1]) /
      (game.buttons['A'][0] * game.buttons['B'][1] - game.buttons['A'][1] * game.buttons['B'][0])
    let j = (game.prize[0] - game.buttons['A'][0] * i) / game.buttons['B'][0]
    if (!Number.isInteger(i) || !Number.isInteger(j)) return 0
    return i * prices['A'] + j * prices['B']
  }

  if (!params.skipPart1) {
    part1 = arcadePart1.reduce((acc, game) => acc + calculatePrize(game), 0)
  }

  if (!params.skipPart2) {
    part2 = arcadePart2.reduce((acc, game) => acc + calculatePrize(game), 0)
  }

  return { part1, part2 }
}
