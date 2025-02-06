import { Params } from 'aoc.d'
import { intersect } from 'util/array'

type Passport = Record<string, string>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let mandatoryKeys: string[] = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

  const processPassport = (passport: Passport) => {
    let valid = intersect(Object.keys(passport), mandatoryKeys).length === mandatoryKeys.length
    if (!valid) return
    part1++
    if (!passport['byr'].match(/^\d{4}$/)) return
    if (1920 > +passport['byr'] || 2002 < +passport['byr']) return
    if (!passport['iyr'].match(/^\d{4}$/)) return
    if (2010 > +passport['iyr'] || 2020 < +passport['iyr']) return
    if (!passport['eyr'].match(/^\d{4}$/)) return
    if (2020 > +passport['eyr'] || 2030 < +passport['eyr']) return
    let h = passport['hgt'].match(/^(\d+)(cm|in)$/)
    if (!h) return
    if (h[2] === 'cm' && (150 > +h[1] || 193 < +h[1])) return
    if (h[2] === 'in' && (59 > +h[1] || 76 < +h[1])) return
    if (!passport['hcl'].match(/^#[0-9a-f]{6}$/)) return
    if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(passport['ecl'])) return
    if (!passport['pid'].match(/^\d{9}$/)) return
    part2++
  }

  let tempPassport: Passport = {}
  for await (const line of lineReader) {
    if (line.length === 0) {
      processPassport(tempPassport)
      tempPassport = {}
    } else {
      line.split(' ').forEach((e: string) => {
        let [key, value] = e.split(':')
        tempPassport[key] = value
      })
    }
  }
  return { part1, part2 }
}
