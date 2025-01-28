import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: string = ''

  const dec2SNAFU = (value: number) => {
    const exps: number[] = []
    const dividers: number[] = []
    const remainers: number[] = []

    // find the last exp
    let exp: number = 0
    let partial: number = 0
    do {
      partial = Math.pow(5, exp)
      if (partial <= value) exps.push(partial)
      exp++
    } while (partial < value)

    for (let i = exps.length - 1; i >= 0; i--) {
      const exp: number = exps[i]
      const divider: number = Math.floor(value / exp)
      dividers.unshift(divider)
      const remainer: number = value % exp
      remainers.unshift(remainer)
      value = remainer
    }

    let remainer: boolean = false
    const result: string[] = []
    for (let divider of dividers) {
      result.unshift(encode(divider, remainer))
      remainer = divider > 2
    }
    if (remainer) result.unshift('1')
    return result.join('')
  }

  const decode = (val: string): number => {
    if (val === '=') return -2
    if (val === '-') return -1
    return +val
  }

  const encode = (val: number, remainer: boolean): string => {
    if (val === 0) return remainer ? '1' : '0'
    if (val === 1) return remainer ? '2' : '1'
    if (val === 2) return remainer ? '=' : '2'
    if (val === 3) return remainer ? '-' : '='
    return remainer ? '0' : '-' //  if (val === 4) {
  }
  const SNAFU2dec = (line: string) => {
    const total = line.split('').map(decode)
    return total.reverse().reduce((acc: number, value: number, index) => acc + value * Math.pow(5, index), 0)
  }

  let acc: number = 0
  for await (const line of lineReader) acc += SNAFU2dec(line)

  part1 = dec2SNAFU(acc)

  return { part1, part2 }
}
