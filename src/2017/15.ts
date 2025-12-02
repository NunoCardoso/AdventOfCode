import { Params } from 'aoc.d'
import * as console from 'console'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let A: bigint = 0n,
    B: bigint = 0n

  for await (const line of lineReader) {
    const values = line.match(/Generator (.) starts with (\d+)/)
    if (values[1] === 'A') A = BigInt(values[2])
    else B = BigInt(values[2])
  }

  const mod2147483647 = (x: bigint, factor: bigint): bigint => (x * factor) % 2147483647n

  // 2147483647 is 0x7FFFFFFF
  /* const mod2147483647 =(g: bigint, factor: bigint): bigint => {
    let prod = g * factor
    g = (prod & 2147483647n) + (prod >> 31n);
    return g >> 31n ? g - 2147483647n : g;
  }
*/
  let _A = A,
    _B = B
  let iterations = 0
  while (++iterations <= params.iterations.part1) {
    _A = mod2147483647(_A, params.generatorBigInt.A)
    _B = mod2147483647(_B, params.generatorBigInt.B)
    if ((_A & 65535n) === (_B & 65535n)) part1++
    if (iterations % 10000000 === 0) log.debug('it', iterations, 'part1', part1)
  }
  iterations = 0
  _A = A
  _B = B

  while (++iterations <= params.iterations.part2) {
    do {
      _A = mod2147483647(_A, params.generatorBigInt.A)
    } while (_A & 3n)
    do {
      _B = mod2147483647(_B, params.generatorBigInt.B)
    } while (_B & 7n)
    if ((_A & 65535n) === (_B & 65535n)) part2++
    if (iterations % 1000000 === 0) log.debug('it', iterations, 'part2', part2)
  }

  return { part1, part2 }
}
