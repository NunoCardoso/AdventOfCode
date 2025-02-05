import { Params } from 'aoc.d'

type Instruction = [string, string, string?]
type Lens = [string, number]
type Box = Lens[]

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  // & 0xFF is the same as % 256
  const calculateHash = (char: string, value: number): number => ((value + char.charCodeAt(0)) * 17) & 0xff

  const getHashValue = (hash: string): number => hash.split('').reduce((acc, char) => calculateHash(char, acc), 0)

  let instructions: Instruction[] = []
  for await (const line of lineReader) instructions = line.split(',').map((bit: string) => bit.match(/^(\w+)=?(.+)/))

  part1 = instructions.reduce((acc, instruction) => acc + getHashValue(instruction[0]), 0)

  const boxes: Box[] = Array(256)
    .fill(null)
    .map(() => [])
  instructions.forEach((instruction: Instruction) => {
    const label = instruction[1]
    const boxId = getHashValue(instruction[1])
    if (instruction[2] === '-') boxes[boxId] = boxes[boxId].filter((lens) => lens[0] !== label)
    else {
      const indexOf = boxes[boxId].findIndex((lens: any) => lens[0] === label)
      indexOf >= 0 ? (boxes[boxId][indexOf][1] = +instruction[2]!) : boxes[boxId].push([label, +instruction[2]!])
    }
  })

  part2 = boxes.reduce(
    (acc, box: Box, boxIndex) =>
      acc + box.reduce((acc, lens: Lens, lensIndex) => acc + (boxIndex + 1) * (lensIndex + 1) * lens[1], 0),
    0
  )

  return { part1, part2 }
}
