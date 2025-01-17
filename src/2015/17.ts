import { Params } from 'aoc.d'

type Container = { id: number; value: number }
type Containers = Container[]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const containers: Containers = []
  const fills = new Set<string>()
  let numberOfMinimumFills: number = 0
  const target = params.limit

  const combine = (containers: Containers, temp: Containers = []) => {
    for (let i = 0; i < containers.length; i++) {
      const currentContainer: Containers = [...temp, containers[i]]
      // if we overshoot or match, do not permute more, skip to next. If not, keep digging
      const sum: number = currentContainer.reduce((acc, val) => acc + val.value, 0)
      if (sum > target) continue
      if (sum === target) {
        const key = currentContainer
          .map((_c) => _c.id)
          .sort()
          .join(',')
        fills.add(key)
        if (currentContainer.length < minimumFill) {
          minimumFill = currentContainer.length
          numberOfMinimumFills = 1
        } else if (currentContainer.length === minimumFill) {
          numberOfMinimumFills++
        }
        continue
      }
      combine(containers.slice(i + 1), currentContainer)
    }
  }

  let id: number = 0
  // ID is needed so jars with same capacity can be identified differently
  for await (const line of lineReader) containers.push({ id: id++, value: +line })

  let minimumFill: number = containers.length
  containers.sort((a, b) => b.value - a.value)
  combine(containers)

  return {
    part1: fills.size,
    part2: numberOfMinimumFills
  }
}
