import { Params } from 'aoc.d'

export const getPrice = (n: number): number => n % 10

export const evolve = (n: number): number => {
  const mix = (n: bigint, n2: bigint): bigint => n ^ n2
  const prune = (n: bigint): bigint => n % 16777216n
  let pruned = prune(mix(BigInt(n) * 64n, BigInt(n)))
  let pruned2 = prune(mix(pruned / 32n, pruned))
  return Number(prune(mix(pruned2 * 2048n, pruned2)))
}

export const produce = (n: number, it: number): number => {
  for (var i = 0; i < it; i++) n = evolve(n)
  return n
}
export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let buyers: number[] = []
  for await (const line of lineReader) buyers.push(Number(line))

  if (!params.skipPart1) {
    part1 = buyers.reduce((acc, buyer) => acc + produce(buyer, 2000), 0)
  }
  if (!params.skipPart2) {
    let priceChange: Record<string, Record<string, number>> = {}
    buyers.forEach((buyer, buyerIndex) => {
      let lastSecretNumber: number = buyer
      let priceDiffArray: number[] = []
      let price: number = 0
      let priceDiffKey
      let newSecretNumber

      for (var i = 0; i < 2000; i++) {
        newSecretNumber = evolve(lastSecretNumber)
        price = getPrice(newSecretNumber)
        priceDiffArray.push(price - getPrice(lastSecretNumber))
        if (priceDiffArray.length > 4) priceDiffArray.shift()
        priceDiffKey = priceDiffArray.join(',')
        if (priceChange[priceDiffKey] === undefined) priceChange[priceDiffKey] = {}
        if (priceDiffArray.length === 4 && priceChange[priceDiffKey][buyerIndex] === undefined) {
          priceChange[priceDiffKey][buyerIndex] = price
        } // only record the first one
        lastSecretNumber = newSecretNumber
      }
    })

    part2 = Object.keys(priceChange).reduce((acc, key) => {
      let bananaSum = Object.values(priceChange[key]).reduce((a, b) => a + b, 0)
      return bananaSum > acc ? bananaSum : acc
    }, 0)
  }

  return { part1, part2 }
}
