import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const cardWins: Array<number> = []

  for await (const line of lineReader) {
    const m = line.match(/^Card\s+\d+: (.+)$/)[1].split('|')
    cardWins.push(
      _.intersection(m[0].trim().split(/\s+/).map(Number), m[1].trim().split(/\s+/).map(Number)).length
    )
  }

  // fill with 1 for the original copies
  const cardCollect = Array(cardWins.length).fill(1)

  cardWins.forEach((cardWin, i) => {
    if (cardWin > 0) {
      part1 += Math.pow(2, cardWin - 1)
    }
    for (let j = 0; j < cardWin!; j++) {
      cardCollect[i + (j + 1)] = cardCollect[i + (j + 1)] + cardCollect[i]
    }
  })

  part2 = cardCollect.reduce((a, b) => a + b)

  return { part1, part2 }
}
