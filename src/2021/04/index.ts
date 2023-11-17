import _ from 'lodash'
import { Params } from 'aoc.d'

type BingoCard = Array<Array<number | undefined>>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let bingoNumbers: Array<number> = []
  const bingoCards: Array<BingoCard> = []
  let tempBingo: BingoCard = []

  for await (const line of lineReader) {
    if (_.isEmpty(bingoNumbers)) {
      bingoNumbers = line.split(',').map((val: string) => parseInt(val))
      continue
    }
    let row: Array<number> = line
      .trim()
      .split(/\s+/)
      .map((val: string) => parseInt(val))

    row = row.filter((val) => !_.isNaN(val))

    if (_.isEmpty(row)) {
      if (!_.isEmpty(tempBingo)) {
        bingoCards.push(_.cloneDeep(tempBingo))
        tempBingo = []
      }
      continue
    }
    tempBingo.push(row)
  }

  if (!_.isEmpty(tempBingo)) {
    bingoCards.push(tempBingo)
  }

  log.debug('Bingo numbers', bingoNumbers.length, 'Bingo cards', bingoCards.length)

  const hasBingo = (number: number, bingoCard: BingoCard): boolean => {
    for (let i = 0; i < bingoCard.length; i++) {
      for (let j = 0; j < bingoCard[i].length; j++) {
        if (bingoCard[i][j] === number) {
          bingoCard[i][j] = undefined
          let isThereANumberInColumn: boolean = false
          let isThereANumberInRow: boolean = false
          for (let m = 0; m < bingoCard.length; m++) {
            if (_.isNumber(bingoCard[m][j])) {
              isThereANumberInColumn = true
            }
          }
          if (!isThereANumberInColumn) {
            return true
          }
          for (let m = 0; m < bingoCard[j].length; m++) {
            if (_.isNumber(bingoCard[i][m])) {
              isThereANumberInRow = true
            }
          }
          if (!isThereANumberInRow) {
            return true
          }
        }
      }
    }
    return false
  }

  const sumOfBingo = (card: BingoCard, number: number) => {
    let sum = 0
    for (let i = 0; i < card.length; i++) {
      for (let j = 0; j < card[i].length; j++) {
        if (_.isNumber(card[i][j])) {
          sum += card[i][j]!
        }
      }
    }
    return sum * number
  }

  let part1: number = 0
  let part2: number = 0
  let ball: number = 0

  while (bingoCards.length > 0) {
    ball = bingoNumbers.shift()!

    // go from length to 0 so I can splice without messing up indexes
    for (let i = bingoCards.length - 1; i >= 0; i--) {
      if (hasBingo(ball, bingoCards[i])) {
        if (part1 === 0) {
          part1 = sumOfBingo(bingoCards[i], ball)
        }
        part2 = sumOfBingo(bingoCards[i], ball)
        bingoCards.splice(i, 1)
      }
    }
  }

  return {
    part1,
    part2
  }
}
