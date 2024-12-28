import { Permutation } from 'js-combinatorics'

type Distances = Map<string, Map<string, number>>
export default async (lineReader: any) => {
  const distances: Distances = new Map()
  let part1: number = Number.MAX_VALUE
  let part2: number = Number.MIN_VALUE

  for await (const line of lineReader) {
    const [, city1, city2, distance] = line.match(/(.+) to (.+) = (\d+)/)
    if (!distances.has(city1)) distances.set(city1, new Map())
    if (!distances.has(city2)) distances.set(city2, new Map())
    distances.get(city1)!.set(city2, +distance)
    distances.get(city2)!.set(city1, +distance)
  }

  for (let placeSet of new Permutation(Array.from(distances.keys()))) {
    let distance = placeSet.reduce(
      (acc, place, index) => (index === 0 ? acc : acc + distances.get(placeSet[index - 1])!.get(placeSet[index])!),
      0
    )
    if (distance < part1) part1 = distance
    if (distance > part2) part2 = distance
  }

  return { part1, part2 }
}
