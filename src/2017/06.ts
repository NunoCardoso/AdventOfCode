import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let memoryBanks: number[] = []

  for await (const line of lineReader) memoryBanks = line.split(/\s+/g).map(Number)

  let memory: Set<string> = new Set()
  let memoryKey: string, maxBlocks: number, maxBlockIndex: number, blocksToRedistribute: number
  let reminderToRedistribute: number, higherIndex: number

  while (true) {
    maxBlocks = Math.max(...memoryBanks)
    maxBlockIndex = memoryBanks.findIndex((m) => m === maxBlocks)
    blocksToRedistribute = Math.floor(maxBlocks / memoryBanks.length)
    reminderToRedistribute = maxBlocks % memoryBanks.length
    higherIndex = (maxBlockIndex + reminderToRedistribute) % memoryBanks.length

    for (let i = 0; i < memoryBanks.length; i++) {
      memoryBanks[i] += blocksToRedistribute
      // spread the reminder
      if (
        (higherIndex > maxBlockIndex && i > maxBlockIndex && i <= higherIndex) ||
        (higherIndex < maxBlockIndex && (i > maxBlockIndex || i <= higherIndex))
      ) {
        memoryBanks[i]++
      }
      // remove the blocks from the memory slot that had the highest number of blocks
      if (i === maxBlockIndex) memoryBanks[i] -= maxBlocks
    }
    memoryKey = memoryBanks.join(',')
    if (memory.has(memoryKey)) break
    memory.add(memoryKey)
  }

  part1 = memory.size + 1
  // set preserves insert order, so I can know in which cycle the first memory key was added
  part2 = part1 - ([...memory].indexOf(memoryKey) + 1)

  return { part1, part2 }
}
