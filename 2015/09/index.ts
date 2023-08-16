import { Params } from '../../aoc.d'

export default async (lineReader: any, params: Params) => {
  const distances: Record<string, Record<string, number>> = {}

  for await (const line of lineReader) {
    const vals = line.split(' ')
    if (!Object.prototype.hasOwnProperty.call(distances, vals[0])) {
      distances[vals[0]] = {}
    }
    if (!Object.prototype.hasOwnProperty.call(distances, vals[2])) {
      distances[vals[2]] = {}
    }
    distances[vals[0]][vals[2]] = parseInt(vals[4])
    distances[vals[2]][vals[0]] = parseInt(vals[4])
  }

  const places: Array<string> = Object.keys(distances)
  const permutes: Array<number> = new Array(places.length)
  for (let i = 0; i < permutes.length; i++) {
    permutes[i] = i
  }

  const permutation = (array: Array<number>): Array<Array<number>> => {
    const p = (array: Array<number>, temp: Array<number>) => {
      let i, x
      if (!array.length) {
        result.push(temp)
      }
      for (i = 0; i < array.length; i++) {
        x = array.splice(i, 1)[0]
        p(array, temp.concat(x))
        array.splice(i, 0, x)
      }
    }
    const result: Array<Array<number>> = []
    p(array, [])
    return result
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
