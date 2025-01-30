import { Params } from 'aoc.d'
import { intersect } from 'util/array'
import { range } from 'util/range'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const cardWins: number[] = []

  for await (const line of lineReader) {
    const [left, right] = line.match(/^Card\s+\d+: (.+)$/)[1].split('|')
    cardWins.push(intersect(left.trim().split(/\s+/).map(Number), right.trim().split(/\s+/).map(Number)).length)
  }

  // track card duplicates. Fill it with 1 for the original copies
  const cardCollect = Array(cardWins.length).fill(1)

  cardWins.forEach((cardWin, cardId) => {
    if (cardWin > 0) part1 += Math.pow(2, cardWin - 1)
    for (let nextCardId of range(cardWin, 1)) {
      cardCollect[cardId + nextCardId] += cardCollect[cardId]
    }
  })

  part2 = cardCollect.reduce((a, b) => a + b)

  return { part1, part2 }
}
