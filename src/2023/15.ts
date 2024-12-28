import { Params } from 'aoc.d'

type Instruction = [string, string, string?]
type Lens = [string, number]
type Box = Array<Lens>

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let data: Array<Instruction> = []
  for await (const line of lineReader) {
    data = line.split(',').map((bit: string) => bit.match(/^(\w+)=?(.+)/))
  }

  const calculateHash = (char: string, value: number) => ((value + char.charCodeAt(0)) * 17) % 256

  const getHashValue = (hash: string): number => {
    let value = 0
    hash.split('').forEach((char) => {
      value = calculateHash(char, value)
    })
    return value
  }

  if (!params.skipPart1) {
    data.forEach((instruction: Instruction) => {
      part1 += getHashValue(instruction[0])
    })
  }

  if (!params.skipPart2) {
    const boxes: Array<Box> = Array(256)
      .fill(null)
      .map(() => [])
    data.forEach((instruction: Instruction) => {
      const label = instruction[1]
      const boxId = getHashValue(instruction[1])
      if (instruction[2] === '-') {
        boxes[boxId] = boxes[boxId].filter((lens: any) => lens[0] !== label)
      } else {
        const indexOf = boxes[boxId].findIndex((lens: any) => lens[0] === label)
        indexOf >= 0 ? (boxes[boxId][indexOf][1] = +instruction[2]!) : boxes[boxId].push([label, +instruction[2]!])
      }
    })
    boxes.forEach((box: Box, boxIndex) => {
      box?.forEach((lens: Lens, lensIndex: number) => {
        part2 += (boxIndex + 1) * (lensIndex + 1) * lens[1]
      })
    })
  }

  return { part1, part2 }
}
