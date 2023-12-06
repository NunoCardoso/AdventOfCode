import { Params } from 'aoc.d'
import _ from 'lodash'

//  destination, source length
type Convert = [number, number, number]
type Range = [number, number]

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

  Object.keys(db).forEach((key) => {
    db[key] = db[key].sort((a, b) => a[0] - b[0])
  })

  const applyRulesOnRange = (range: Range, rules: Array<Convert>) => {
    const selectedRules: Array<Convert> = []
    const selectedRanges: Array<Range> = []
    for (let j = 0; j < rules.length; j++) {
      let overlap: boolean
      if (rules[j][1] < range[0]) {
        overlap = rules[j][1] + rules[j][2] > range[0]
      } else {
        overlap = rules[j][1] < range[1]
      }
      if (overlap) {
        selectedRules.push(rules[j])
      }
    }

    let lowValue = range[0]
    while (true) {
      const rule = _.find(selectedRules, (r) => r[1] <= lowValue && lowValue < r[1] + r[2])
      let highValue: number = -1
      if (rule) {
        highValue = rule[1] + rule[2]
        if (highValue > range[1]) {
          highValue = range[1]
        }
        const dist = rule[0] - rule[1]
        selectedRanges.push([lowValue + dist, highValue + dist])
        lowValue = highValue
      } else {
        highValue = range[1]
        selectedRanges.push([lowValue, highValue])
      }
      if (highValue >= range[1]) {
        break
      }
    }
    return selectedRanges
  }

  const doConvert = (map: string, ranges: Array<Range>): Array<Range> => {
    const rules: Array<Convert> = db[map]
    let convertedRanges: Array<Range> = []
    for (let i = 0; i < ranges.length; i++) {
      convertedRanges = convertedRanges.concat(applyRulesOnRange(ranges[i], rules))
    }
    return convertedRanges
  }

  const getLocation = (range: Range): number => {
    let ranges: Array<Range> = [range]
    for (let i = 0; i < sequence.length - 1; i++) {
      ranges = doConvert(sequence[i] + '2' + sequence[i + 1], ranges)
    }
    ranges.sort((a, b) => a[0] - b[0])
    if (ranges.length > 0) {
      return ranges[0][0]
    }
    return 0
  }

  if (params.skip !== true && params.skip !== 'part1') {
    seeds.forEach((seed) => {
      const range: Range = [seed, seed]
      log.debug('Part1: seed range', range)
      const lowestLocation = getLocation(range)
      if (part1 < 0 || part1 > lowestLocation) {
        part1 = lowestLocation
      }
    })
  }

  if (params.skip !== true && params.skip !== 'part2') {
    for (let i = 0; i < seeds.length; i += 2) {
      const range: Range = [seeds[i], seeds[i] + seeds[i + 1]]
      log.debug('Part2: seed range', range)
      const lowestLocation = getLocation(range)
      if (part2 < 0 || part2 > lowestLocation) {
        part2 = lowestLocation
      }
    }
  }

  return { part1, part2 }
}
