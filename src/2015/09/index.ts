import { Params } from 'aoc.d'
import { permutation } from 'utils'

type Distances = Record<string, Record<string, number>>
export default async (lineReader: any, params: Params) => {
  const distances: Distances = {}

  for await (const line of lineReader) {
    const values = line.split(' ')
    if (!Object.prototype.hasOwnProperty.call(distances, values[0])) {
      distances[values[0]] = {}
    }
    if (!Object.prototype.hasOwnProperty.call(distances, values[2])) {
      distances[values[2]] = {}
    }
    distances[values[0]][values[2]] = parseInt(values[4])
    distances[values[2]][values[0]] = parseInt(values[4])
  }

  const places: Array<string> = Object.keys(distances)
  const permutes: Array<number> = new Array(places.length)
  for (let i = 0; i < permutes.length; i++) {
    permutes[i] = i
  }

  const combinations: Record<string, number> = {}

  permutation(permutes).forEach((permute: Array<number>) => {
    let res = 0
    const key: string = permute.map((i: number) => i.toString()).join('')
    for (let j = 0; j < permute.length - 1; j++) {
      res += distances[places[permute[j]]][places[permute[j + 1]]]
    }
    combinations[key] = res
  })

  const sortedKeys: Array<string> = Object.keys(combinations).sort(
    (a, b) => combinations[a] - combinations[b]
  )

  return {
    part1: combinations[sortedKeys[0]],
    part2: combinations[sortedKeys[sortedKeys.length - 1]]
  }
}
