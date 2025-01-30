import { Params } from 'aoc.d'

interface Hand {
  cards: string
  type: string
  cardsWithJoker: string
  typeWithJoker: string
  rank: number
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const hands: Hand[] = []
  const cardTypePart1 = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
  const cardTypePart2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']
  const handType = ['5kind', '4kind', 'FullHouse', '3kind', '2pairs', '1pair', 'HighCard']

  const countCards = (hand: string): Map<string, number> => {
    const count: Map<string, number> = new Map()
    hand.split('').forEach((v) => (!count.has(v) ? count.set(v, 1) : count.set(v, count.get(v)! + 1)))
    return count
  }

  const getHandType = (hand: string) => {
    const hash: Map<string, number> = countCards(hand)
    const values: number[] = [...hash.values()].sort((a, b) => a - b)
    if (values.length === 1) return '5kind'
    if (values.length === 2 && values[1] === 4) return '4kind'
    if (values.length === 2 && values[1] === 3) return 'FullHouse'
    if (values.length === 3 && values[2] === 3) return '3kind'
    if (values.length === 3 && values[2] === 2) return '2pairs'
    if (values.length === 4) return '1pair'
    return 'HighCard'
  }

  const decideOnStrongest = (a: Hand, b: Hand, cardType: string[]): number => {
    for (let i = 0; i < a.cards.length; i++) {
      if (cardType.indexOf(b.cards[i]) > cardType.indexOf(a.cards[i])) return 1
      if (cardType.indexOf(b.cards[i]) < cardType.indexOf(a.cards[i])) return -1
    }
    return 0
  }

  const doSort = (hand: Hand[], which: keyof Hand, cardScore: string[]) =>
    hand.sort((a: Hand, b: Hand) =>
      handType.indexOf(b[which] as string) > handType.indexOf(a[which] as string)
        ? 1
        : handType.indexOf(b[which] as string) < handType.indexOf(a[which] as string)
          ? -1
          : decideOnStrongest(a, b, cardScore)
    )

  const doJoker = (hand: string) => {
    const hash: Map<string, number> = countCards(hand)
    const allOtherCards = [...hash.keys()].filter((card) => card !== 'J')
    let bestHandType = handType.indexOf(getHandType(hand))
    let bestHand = hand

    allOtherCards.forEach((card: string) => {
      const replacedHand = hand.replaceAll('J', card)
      const replacedHandType = getHandType(replacedHand)
      if (handType.indexOf(replacedHandType) < bestHandType) {
        bestHandType = handType.indexOf(replacedHandType)
        bestHand = replacedHand
      }
    })
    log.debug('doJoker: Got', hand, 'returned', bestHand)
    return bestHand
  }

  for await (const line of lineReader) {
    const [hand, rank] = line.split(/\s/)
    const cardsWithJoker = doJoker(hand)
    hands.push({
      cards: hand,
      type: getHandType(hand),
      cardsWithJoker: cardsWithJoker,
      typeWithJoker: getHandType(cardsWithJoker),
      rank: +rank
    })
  }

  if (!params.skipPart1)
    part1 = doSort(hands, 'type' as keyof Hand, cardTypePart1).reduce((a, b, i) => a + b.rank * (i + 1), 0)

  if (!params.skipPart2)
    part2 = doSort(hands, 'typeWithJoker' as keyof Hand, cardTypePart2).reduce((a, b, i) => a + b.rank * (i + 1), 0)

  return { part1, part2 }
}
