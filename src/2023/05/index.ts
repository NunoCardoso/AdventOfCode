import { Params } from 'aoc.d'

//  destination, source length
type Convert = [number, number, number]
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = -1
  let part2: number = -1

  const seeds: Array<number> = []

  const db: Record<string, Array<Convert>> = {
    seed2soil: [],
    soil2fertilizer: [],
    fertilizer2water: [],
    water2light: [],
    light2temperature: [],
    temperature2humidity: [],
    humidity2location: []
  }

  const sequence = ['seed', 'soil', 'fertilizer', 'water', 'light', 'temperature', 'humidity', 'location']

  let mode: string = ''
  for await (const line of lineReader) {
    if (line.startsWith('seeds:')) {
      line
        .split(':')[1]
        .trim()
        .split(/\s+/)
        .forEach((x: string) => seeds.push(parseInt(x)))
    } else if (line.endsWith('map:')) {
      mode = line.split(/\s+/)[0].trim().split('-to-').join('2')
    } else if (line !== '') {
      const c: Convert = line.split(/\s+/).map((x: string) => parseInt(x))
      db[mode].push(c)
    }
  }

  const doConvert = (map: string, source: number) => {
    const converts = db[map]
    let res: number
    for (let i = 0; i < converts.length; i++) {
      log.debug('converts[i][1]', converts[i][1], 'source', source)
      if (converts[i][1] <= source && source < converts[i][1] + converts[i][2]) {
        const dist = converts[i][0] - converts[i][1]
        res = source + dist
        return res
      }
    }
    return source
  }

  const getLocation = (seed: number) => {
    log.debug('seed', seed)
    let value = seed
    for (let i = 0; i < sequence.length - 1; i++) {
      const mode = sequence[i] + '2' + sequence[i + 1]
      const _value = doConvert(mode, value)
      log.debug('applying', mode, 'with source', value, 'got', _value)
      value = _value
    }
    return value
  }

  if (params.skip !== true && params.skip !== 'part1') {
    seeds.forEach((seed) => {
      const value = getLocation(seed)
      if (part1 < 0 || part1 > value) {
        part1 = value
      }
    })
  }

  if (params.skip !== true && params.skip !== 'part2') {
    for (let i = 0; i < seeds.length; i += 2) {
      console.log('doing', seeds[i], seeds[i + 1])
      for (let j = seeds[i]; j < seeds[i] + seeds[i + 1]; j++) {
        const value = getLocation(j)
        if (part2 < 0 || part2 > value) {
          part2 = value
        }
      }
    }
  }

  return { part1, part2 }
}
