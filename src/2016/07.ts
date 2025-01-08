import { intersect } from 'util/array'

export default async (lineReader: any) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const oddsPart1: string[] = []
    const evensPart1: string[] = []
    const oddsPart2: string[] = []
    const evensPart2: string[] = []

    // inside brackets will be always on odd index numbers (1,3,5,...)
    line.split(/[[\]]/).forEach((v: string, i: number) => {
      const abba = v.match(/(.)(.)\2\1/g)
      if (abba?.[0][0] !== abba?.[0][1]) {
        i % 2 === 0 ? evensPart1.push(abba![0]) : oddsPart1.push(abba![0])
      }
      for (let aba of v.matchAll(/(.)(?=(.)\1)/g)) {
        if (aba?.[1] !== aba?.[2]) {
          i % 2 === 0 ? evensPart2.push(aba![1] + aba![2] + aba![1]) : oddsPart2.push(aba![2] + aba![1] + aba![2]) // let's store the inverse now to make it easy for match
        }
      }
    })

    if (evensPart1.length > 0 && oddsPart1.length === 0) part1++
    if (intersect(oddsPart2, evensPart2).length > 0) part2++
  }

  return { part1, part2 }
}
