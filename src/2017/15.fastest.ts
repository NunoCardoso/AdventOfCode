import * as console from 'console'
import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let A: number = 0,
    B: number = 0

  for await (const line of lineReader) {
    const values = line.match(/Generator (.) starts with (\d+)/)
    if (values[1] === 'A') A = +values[2]
    else B = +values[2]
  }

  const generate = (n: number, m: number) => {
    let a = (n >> 16) * m // 15 + 16 bits
    let b = ((n >> 8) & 0xff) * m // 8 + 16 bits
    let c = (n & 0xff) * m // 8 + 16 bits

    b += c >> 8
    c &= 0xff
    a += b >> 8
    b &= 0xff
    c += a >> 15
    a &= 0x7fff

    b += c >> 8
    c &= 0xff
    a += b >> 8
    b &= 0xff
    c += a >> 15
    a &= 0x7fff

    return (a << 16) + (b << 8) + c
  }

  let _A = A,
    _B = B
  let iterations = 0
  while (++iterations <= params.iterations.part1) {
    _A = generate(_A, params.generator.A)
    _B = generate(_B, params.generator.B)
    if ((_A & 65535) === (_B & 65535)) part1++
  }
  iterations = 0
  _A = A
  _B = B

  while (++iterations <= params.iterations.part2) {
    do {
      _A = generate(_A, params.generator.A)
    } while (_A & 3)
    do {
      _B = generate(_B, params.generator.B)
    } while (_B & 7)
    if ((_A & 65535) === (_B & 65535)) part2++
  }

  return { part1, part2 }
}
