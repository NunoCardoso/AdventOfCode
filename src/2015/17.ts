import { Params } from 'aoc.d'

type Container = { id: number; value: number }
type Containers = Array<Container>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const containers: Containers = []
  const fills = new Set<string>()
  let numberOfMinimumFills: number = 0
  const target = params.limit

  let id: number = 0
  for await (const line of lineReader) {
    containers.push({ id: id++, value: +line })
  }

  let minimumFill: number = containers.length
  containers.sort((a, b) => b.value - a.value)

  const permute = (containers: Containers, temp: Containers = []) => {
    for (let i = 0; i < containers.length; i++) {
      const currentContainer: Containers = [...temp, containers[i]]
      // if we overshoot or match, do not permute more, skip to next. If not, keep digging
      const sum: number = currentContainer.reduce((acc, val) => acc + val.value, 0)
      if (sum >= target) {
        if (sum === target) {
          const key = currentContainer
            .map((_c) => '[' + _c.id + ']')
            .sort()
            .join('')
          fills.add(key)
          if (currentContainer.length < minimumFill) {
            minimumFill = currentContainer.length
            numberOfMinimumFills = 1
          } else if (currentContainer.length === minimumFill) {
            numberOfMinimumFills++
          }
        }
        continue
      }
      permute(containers.slice(i + 1), currentContainer)
    }
  }

  permute(containers, [])
  log.debug(fills)

  return {
    part1: fills.size,
    part2: numberOfMinimumFills
  }
}
