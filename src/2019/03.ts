import { Params } from 'aoc.d'
import { LocationPlus } from 'declarations'
import { intersect } from 'util/array'
import { fromKey, getKey, getManhattanDistance } from 'util/location'
import { range } from 'util/range'

type Coordinate = [string, number]
type Wires = [Coordinate[], Coordinate[]]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const processWire = (coordinates: Coordinate[]): [Set<string>, Record<string, number>] => {
    let location: LocationPlus = [0, 0, 0]
    let wire: Set<string> = new Set<string>()
    let wireMap: Record<string, number> = {}
    coordinates.forEach((coordinate: Coordinate) => {
      for (let repeat of range(coordinate[1])) {
        if (coordinate[0] === 'L') location[0]--
        if (coordinate[0] === 'R') location[0]++
        if (coordinate[0] === 'U') location[1]--
        if (coordinate[0] === 'D') location[1]++
        location[2]++
        let key = getKey(location)
        wire.add(key)
        wireMap[key] = location[2]
      }
    })
    return [wire, wireMap]
  }

  let wires: Wires = [[], []]
  for await (const line of lineReader)
    if (wires[0].length === 0) wires[0] = line.split(',').map((el: string) => [el[0], +el.substring(1, el.length)])
    else wires[1] = line.split(',').map((el: string) => [el[0], +el.substring(1, el.length)])

  let [wire1, wire1map] = processWire(wires[0])
  let [wire2, wire2map] = processWire(wires[1])

  let intersects: string[] = intersect([...wire1], [...wire2])
  part1 = intersects.reduce((acc, a) => {
    let distance = getManhattanDistance(fromKey(a), [0, 0])
    return distance < acc ? distance : acc
  }, Number.MAX_VALUE)
  part2 = intersects.reduce((acc, a) => {
    let distance = wire1map[a] + wire2map[a]
    return distance < acc ? distance : acc
  }, Number.MAX_VALUE)

  return { part1, part2 }
}
