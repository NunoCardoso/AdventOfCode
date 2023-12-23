import { Params } from 'aoc'
import _ from 'lodash'

type Disc = {
  position: number
  maxPositions: number
}
export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const discs: Array<Disc> = []

  for await (const line of lineReader) {
    const values = line.match(/Disc #\d+ has (\d+) positions; at time=0, it is at position (\d+)./)
    discs.push({
      maxPositions: parseInt(values[1]),
      position: parseInt(values[2])
    })
  }

  const areAligned = (discs: Array<Disc>): boolean => {
    const position: number = discs[0].position
    for (let i = 1; i < discs.length; i++) {
      if (discs[i].position !== position) {
        return false
      }
    }
    return true
  }

  const doIt = (discs: Array<Disc>): number => {
    let found = 0
    let it = 0
    while (true) {
      const _discs = _.cloneDeep(discs)
      for (let i = 0; i < _discs.length; i++) {
        _discs[i].position = (_discs[i].position + i + it) % _discs[i].maxPositions
      }
      if (areAligned(_discs)) {
        found = it
        break
      }
      it++
    }
    return found - 1
  }

  part1 = doIt(discs.slice())
  const discs2 = discs.slice()
  discs2.push({
    position: 0,
    maxPositions: 11
  })
  part2 = doIt(discs2)
  return { part1, part2 }
}
