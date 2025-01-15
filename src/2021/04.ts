import { Params } from 'aoc.d'

type BingoCard = { rows: number[][]; columns: number[][] }
type BingoIndex = [bingocardid: number, row: number, column: number]

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let bingoNumbers: number[] = []
  let numberToBingoCardPositionIndex: Map<number, BingoIndex[]> = new Map()
  const bingoCards: BingoCard[] = []
  let bingoCardIndex: number = 0
  let currentRow: number = 0
  let cardsWithoutBingo: Set<number> = new Set()

  const bingoCardSum = (card: BingoCard, number: number) =>
    number * card.rows.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0)

  for await (const line of lineReader) {
    if (bingoNumbers.length === 0) {
      bingoNumbers = line.split(',').map(Number)
      continue
    }
    if (line.length === 0) {
      if (bingoCards.length > 0) {
        currentRow = 0
        bingoCardIndex++
      }
    } else {
      let numbers: number[] = line.match(/\d+/g).map(Number)
      if (!bingoCards[bingoCardIndex]) bingoCards[bingoCardIndex] = { rows: [], columns: [[], [], [], [], []] }
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

  let bingoNumber: number = 0
  let lastBingoCard: number = Number.NaN

  while (part1 === 0 || part2 === 0) {
    bingoNumber = bingoNumbers.shift()!
    numberToBingoCardPositionIndex.get(bingoNumber)!.forEach(([cardIndex, row, col]) => {
      bingoCards[cardIndex].rows[row] = bingoCards[cardIndex].rows[row].filter((n) => n != bingoNumber)
      bingoCards[cardIndex].columns[col] = bingoCards[cardIndex].columns[col].filter((n) => n != bingoNumber)
      if (bingoCards[cardIndex].rows[row].length === 0 || bingoCards[cardIndex].columns[col].length === 0) {
        if (part1 === 0) part1 = bingoCardSum(bingoCards[cardIndex], bingoNumber)
        cardsWithoutBingo.delete(cardIndex)
        if (cardsWithoutBingo.size === 1) lastBingoCard = [...cardsWithoutBingo][0]
        if (cardsWithoutBingo.size === 0) part2 = bingoCardSum(bingoCards[lastBingoCard], bingoNumber)
      }
    })
  }

  return { part1, part2 }
}
