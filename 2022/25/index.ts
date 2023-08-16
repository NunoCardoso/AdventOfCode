import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const data: any = []

  const dec2SNAFU = (val: string) => {
    let _val: number = parseInt(val)
    const exps: Array<number> = []
    const dividers: Array<number> = []
    const remainers: Array<number> = []

    // find the last exp
    let exp: number = 0
    let result: number = 0
    do {
      result = Math.pow(5, exp)
      if (result <= _val) {
        exps.push(result)
      }
      exp++
    } while (result < _val)

    log.debug('exp', exp, 'exps', exps)
    for (let i = exps.length - 1; i >= 0; i--) {
      const exp: number = exps[i]
      const divider: number = Math.floor(_val / exp)
      dividers.unshift(divider)
      const remainer: number = _val % exp
      remainers.unshift(remainer)
      log.debug('_val', _val, 'exp', exp, 'divider', divider, 'remainer', remainer)
      _val = remainer
    }
    log.debug('remainers', remainers, 'divivers', dividers)

    let remainer: boolean = false
    const __res: Array<string> = []
    for (let i = 0; i < dividers.length; i++) {
      const _res: string = encode(dividers[i], remainer)
      __res.unshift(_res)
      if (dividers[i] > 2) {
        remainer = true
      } else {
        remainer = false
      }
    }
    log.debug('__res', __res, 'remainer', remainer)

    if (remainer) {
      __res.unshift('1')
    }
    return __res.join('')
  }

  const decode = (val: string): number => {
    if (val === '=') {
      return -2
    }
    if (val === '-') {
      return -1
    }
    return parseInt(val)
  }

  const encode = (val: number, remainer: boolean): string => {
    if (val === 0) {
      return remainer ? '1' : '0'
    }
    if (val === 1) {
      return remainer ? '2' : '1'
    }
    if (val === 2) {
      return remainer ? '=' : '2'
    }
    if (val === 3) {
      return remainer ? '-' : '='
    }
    //  if (val === 4) {
    return remainer ? '0' : '-'
  }

  const SNAFU2dec = (val: string) => {
    const total = val?.split('').map(decode)
    log.debug('val', val, 'total', total)
    let i = 0
    return _.reduceRight(
      total,
      (memo: number, val: number) => {
        return memo + val * Math.pow(5, i++)
      },
      0
    )
  }

  for await (const line of lineReader) {
    const vals = line.trim().split(/\s+/)
    if (vals.length === 1) {
      data.push(vals[0])
    } else {
      const d = { src: vals[0], trg: vals[1] }
      data.push(d)
    }
  }

  let part1: string = ''
  if (params.isTest) {
    console.log(params.mode)
    if (params.mode === 'dec2SNAFU') {
      data.forEach((x: any) => {
        log.info('Generated', dec2SNAFU(x.src), 'expected', x.trg)
      })
    }
    if (params.mode === 'SNAFU2dec') {
      data.forEach((x: any) => {
        log.info('Generated', SNAFU2dec(x.src), 'expected', x.trg)
      })
    }
  } else {
    if (params.part1?.skip !== true) {
      log.debug('data length', data.length)
      const decimals: Array<number> = data.map(SNAFU2dec)
      const total: number = _.reduce(decimals, (memo: number, val: number) => memo + val, 0)
      log.debug('total', total)
      part1 = dec2SNAFU('' + total)
    }
    return { part1, part2: 0 }
  }
}
