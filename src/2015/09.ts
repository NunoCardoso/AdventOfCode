import { Permutation } from 'js-combinatorics'

type Distances = Map<string, Map<string, number>>
export default async (lineReader: any) => {
  const distances: Distances = new Map()
  let part1: number = 1000000
  let part2: number = 0

  for await (const line of lineReader) {
    const [, city1, city2, distance] = line.match(/(.+) to (.+) = (\d+)/)
    if (!distances.has(city1)) distances.set(city1, new Map())
    if (!distances.has(city2)) distances.set(city2, new Map())
    distances.get(city1)!.set(city2, +distance)
    distances.get(city2)!.set(city1, +distance)
  }

  const places: Array<string> = Array.from(distances.keys())
  new Permutation(places).toArray().forEach((placeSet: Array<string>) => {
    let res = 0
    for (let index = 0; index < placeSet.length - 1; index++) {
      res += distances.get(placeSet[index])!.get(placeSet[index + 1])!
    }
    if (res < part1) part1 = res
    if (res > part2) part2 = res
  })

  return { part1, part2 }
}
