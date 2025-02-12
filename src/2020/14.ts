import { Params } from 'aoc.d'
import { bin2dec, dec2bin } from 'util/conversion'
import { permutationWithRepetition } from 'util/permutation'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let memoryPart1: Record<number, number> = {}
  let memoryPart2: Record<number, number> = {}
  let mask: string[] = []

  const transformPart1 = (memory: Record<string, number>, address: number, right: number, mask: string[]) => {
    let valueIn36bits: string[] = dec2bin(right).padStart(36, '0').split('')
    for (let i = 0; i < mask.length; i++) if (mask[i] !== 'X') valueIn36bits[i] = mask[i]
    memory[address] = bin2dec(valueIn36bits.join(''))
  }

  const transformPart2 = (memory: Record<string, number>, address: number, right: number, mask: string[]) => {
    let valueIn36bits: string[] = dec2bin(address).padStart(36, '0').split('')
    let numberOfX: number = 0
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] !== '0') valueIn36bits[i] = mask[i]
      if (mask[i] === 'X') numberOfX++
    }

    permutationWithRepetition(['0', '1'], numberOfX).forEach((permutation) => {
      let val = valueIn36bits.map((v: string) => (v !== 'X' ? v : permutation.shift()))
      let newAddress = bin2dec(val.join(''))
      memory[newAddress] = right
    })
  }

  for await (const line of lineReader) {
    const [left, right] = line.split(' = ')
    if (left === 'mask') mask = right.split('')
    else {
      let address = Number(left.replace(/\D/g, ''))
      if (!params.skipPart1) transformPart1(memoryPart1, address, +right, mask)
      if (!params.skipPart2) transformPart2(memoryPart2, address, +right, mask)
    }
  }

  part1 = Object.values(memoryPart1).reduce((a, b) => a + b, 0)
  part2 = Object.values(memoryPart2).reduce((a, b) => a + b, 0)

  return { part1, part2 }
}
