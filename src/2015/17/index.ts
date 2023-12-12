import { Params } from 'aoc.d'

type Container = { id: number; value: number }
type Containers = Array<Container>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const containers: Containers = []
  const fills = new Set<string>()
  let minimumFill: number = 0
  let numberOfMinimumFills: number = 0
  const target = params.limit

  const permute = (arr: Containers, temp: Containers = []) => {
    for (let i = 0; i < arr.length; i++) {
      const next: Containers = [...temp, arr[i]]
      // if we overshoot or match, do not permute more, skip to next. If not, keep digging
      const sum: number = next.reduce((acc, val) => acc + val.value, 0)
      if (sum >= target) {
        if (sum === target) {
          const key = next
            .map((_c) => '[' + _c.id + ']')
            .sort()
            .join('')
          fills.add(key)
          if (next.length < minimumFill) {
            minimumFill = next.length
            numberOfMinimumFills = 1
          } else if (next.length === minimumFill) {
            numberOfMinimumFills++
          }
        }
        continue
      }
      permute(arr.slice(i + 1), next)
    }
  }

  let i: number = 0
  for await (const line of lineReader) {
    containers.push({ id: i, value: parseInt(line) })
    i++
  }
  minimumFill = containers.length
  containers.sort((a, b) => b.value - a.value)
  permute(containers, [])
  log.debug(fills)

  return {
    part1: fills.size,
    part2: numberOfMinimumFills
  }
}
