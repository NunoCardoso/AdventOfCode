import { Params } from 'aoc.d'

type Hands = {
  cards: string
  type: string
  cardsWithJoker: string
  typeWithJoker: string
  rank: number
}

type HandKey = keyof Hands

const cardTypePart1 = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const cardTypePart2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']
const handType = ['5kind', '4kind', 'FullHouse', '3kind', '2pairs', '1pair', 'HighCard']
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const deck: Array<Hands> = []

  const splitHand = (hand: string): Record<string, number> => {
    const hash: Record<string, number> = {}
    hand.split('').forEach((v) => {
      if (!hash[v]) {
        hash[v] = 0
      }
      hash[v]++
    })
    return hash
  }

  const getHandType = (hand: string) => {
    const hash: Record<string, number> = splitHand(hand)
    const vals: Array<number> = Object.values(hash).sort((a, b) => a - b)
    if (vals.length === 1) {
      return '5kind'
    }
    if (vals.length === 2) {
      if (vals[1] === 4) {
        return '4kind'
      }
      if (vals[1] === 3) {
        return 'FullHouse'
      }
    }
    if (vals.length === 3) {
      if (vals[2] === 3) {
        return '3kind'
      }
      if (vals[2] === 2) {
        return '2pairs'
      }
    }
    if (vals.length === 4) {
      return '1pair'
    }
    return 'HighCard'
  }

  const decideOnStrongest = (a: Hands, b: Hands, cardType: Array<string>): number => {
    for (let i = 0; i < a.cards.length; i++) {
      if (cardType.indexOf(b.cards[i]) > cardType.indexOf(a.cards[i])) {
        return 1
      }
      if (cardType.indexOf(b.cards[i]) < cardType.indexOf(a.cards[i])) {
        return -1
      }
    }
    return 0
  }

  const doSort = (d: Array<Hands>, which: HandKey, cardScore: Array<string>) => {
    return d.sort((a: Hands, b: Hands) => {
      // @ts-ignore
      if (handType.indexOf(b[which]) > handType.indexOf(a[which])) {
        return 1
      }
      // @ts-ignore
      if (handType.indexOf(b[which]) < handType.indexOf(a[which])) {
        return -1
      }
      return decideOnStrongest(a, b, cardScore)
    })
  }

  const doJoker = (hand: string) => {
    const hash: Record<string, number> = splitHand(hand)
    const allOtherCards = Object.keys(hash).filter((k) => k !== 'J')
    let bestHandType = handType.indexOf(getHandType(hand))
    let bestHand = hand

    for (let i = 0; i < allOtherCards.length; i++) {
      const replacedHand = hand.replaceAll('J', allOtherCards[i])
      const replacedHandType = getHandType(replacedHand)
      if (handType.indexOf(replacedHandType) < bestHandType) {
        bestHandType = handType.indexOf(replacedHandType)
        bestHand = replacedHand
      }
    }
    log.debug('doJoker: Got', hand, 'returned', bestHand)
    return bestHand
  }

  for await (const line of lineReader) {
    const values = line.split(/\s/)
    const cardsWithJoker = doJoker(values[0])
    deck.push({
      cards: values[0],
      type: getHandType(values[0]),
      cardsWithJoker: cardsWithJoker,
      typeWithJoker: getHandType(cardsWithJoker),
      rank: parseInt(values[1])
    })
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = doSort(deck.slice(), 'type', cardTypePart1).reduce((a, b, i) => {
      return a + b.rank * (i + 1)
    }, 0)
  }
  if (params.skip !== true && params.skip !== 'part2') {
    part2 = doSort(deck.slice(), 'typeWithJoker', cardTypePart2).reduce((a, b, i) => {
      return a + b.rank * (i + 1)
    }, 0)
  }

  return { part1, part2 }
}
