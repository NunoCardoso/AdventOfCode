import _ from 'lodash'
import { Params } from 'aoc.d'

type BingoCard = { rows: Array<Array<number>>; columns: Array<Array<number>> }

export default async (lineReader: any, params: Params) => {
  //const log = require('console-log-level')({ level: params.logLevel ?? 'info' })
  let part1: number = 0
  let part2: number = 0

  let bingoNumbers: Array<number> = []
  let numberToBingoCardPositionIndex: Map<number, Array<[number, number, number]>> = new Map()
  const bingoCards: Array<BingoCard> = []
  let bingoCardIndex: number = 0
  let currentRow: number = 0
  let cardsWithoutBingo: Set<number> = new Set()

  for await (const line of lineReader) {
    if (_.isEmpty(bingoNumbers)) {
      bingoNumbers = line.split(',').map(Number)
      continue
    }
    if (line.length === 0) {
      if (bingoCards.length > 0) {
        currentRow = 0
        bingoCardIndex++
      }
    } else {
      let numbers: Array<number> = line.match(/\d+/g).map(Number)
      if (!bingoCards[bingoCardIndex])
        bingoCards[bingoCardIndex] = { rows: [], columns: [[], [], [], [], []] }
      cardsWithoutBingo.add(bingoCardIndex)
      bingoCards[bingoCardIndex].rows[currentRow] = numbers
      numbers.forEach((number, columnIndex) => {
        bingoCards[bingoCardIndex].columns[columnIndex].push(number)
        if (!numberToBingoCardPositionIndex.has(number)) numberToBingoCardPositionIndex.set(number, [])
        numberToBingoCardPositionIndex.get(number)!.push([bingoCardIndex, currentRow, columnIndex])
      })
      currentRow++
    }
  }

  const sumOfBingo = (card: BingoCard, number: number) => {
    let sum = card.rows.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0)
    return sum * number
  }

  let number: number = 0
  let lastBingoCard: number = -1

  while (part1 === 0 || part2 === 0) {
    number = bingoNumbers.shift()!
    let positionsWithNumber: Array<[number, number, number]> = numberToBingoCardPositionIndex.get(number)!
    positionsWithNumber?.forEach(([cardIndex, rowIndex, columnIndex]) => {
      let index = bingoCards[cardIndex].rows[rowIndex].indexOf(number)
      bingoCards[cardIndex].rows[rowIndex].splice(index, 1)
      index = bingoCards[cardIndex].columns[columnIndex].indexOf(number)
      bingoCards[cardIndex].columns[columnIndex].splice(index, 1)
      if (
        bingoCards[cardIndex].rows[rowIndex].length === 0 ||
        bingoCards[cardIndex].columns[columnIndex].length === 0
      ) {
        if (part1 === 0) part1 = sumOfBingo(bingoCards[cardIndex], number)
        cardsWithoutBingo.delete(cardIndex)
        if (cardsWithoutBingo.size === 1) lastBingoCard = Array.from(cardsWithoutBingo)[0]
        if (cardsWithoutBingo.size === 0 && part2 === 0) part2 = sumOfBingo(bingoCards[lastBingoCard], number)
      }
    })
  }

  return { part1, part2 }
}
