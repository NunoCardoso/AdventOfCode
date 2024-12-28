import { Params } from 'aoc.d'

//  destination, source length
type Convert = [number, number, number]
type Range = [number, number]

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = -1
  let part2: number = -1

  const seeds: Array<number> = []
  const sequence: Array<string> = ['seed', 'soil', 'fertilizer', 'water', 'light', 'temperature', 'humidity', 'location']
  const almanac: Record<string, Array<Convert>> = {
    'seed-to-soil': [],
    'soil-to-fertilizer': [],
    'fertilizer-to-water': [],
    'water-to-light': [],
    'light-to-temperature': [],
    'temperature-to-humidity': [],
    'humidity-to-location': []
  }

  let map: string = ''
  for await (const line of lineReader) {
    if (line.startsWith('seeds:')) {
      // prettier-ignore
      line
        .split(':')[1]
        .trim()
        .split(/\s+/)
        .forEach((seed: string) => seeds.push(+seed))
    } else if (line.endsWith('map:')) {
      map = line.split(/\s+/)[0].trim()
    } else if (line !== '') {
      almanac[map].push(line.split(/\s+/).map(Number))
    }
  }

  const applyRulesOnRange = (range: Range, rules: Array<Convert>) => {
    const selectedRules: Array<Convert> = []
    const selectedRanges: Array<Range> = []
    // pick rules that overlap the range
    for (let j = 0; j < rules.length; j++) {
      const overlap = rules[j][1] < range[0] ? rules[j][1] + rules[j][2] > range[0] : rules[j][1] < range[1]
      if (overlap) selectedRules.push(rules[j])
    }

    let lowValue = range[0]
    // apply rule on selected ranges
    while (true) {
      const rule = selectedRules.find((r) => r[1] <= lowValue && lowValue < r[1] + r[2])
      let highValue: number = -1
      if (rule) {
        highValue = rule[1] + rule[2]
        if (highValue > range[1]) highValue = range[1]
        const dist = rule[0] - rule[1]
        selectedRanges.push([lowValue + dist, highValue + dist])
        lowValue = highValue
      } else {
        highValue = range[1]
        selectedRanges.push([lowValue, highValue])
      }
      if (highValue >= range[1]) break
    }
    return selectedRanges
  }

  const doConvert = (rules: Array<Convert>, ranges: Array<Range>): Array<Range> => ranges.map((range) => applyRulesOnRange(range, rules)).flat()

  const getLocation = (range: Range): number => {
    let ranges: Array<Range> = [range]
    for (let i = 0; i < sequence.length - 1; i++) {
      ranges = doConvert(almanac[`${sequence[i]}-to-${sequence[i + 1]}`], ranges)
    }
    ranges.sort((a, b) => a[0] - b[0])
    return ranges.length > 0 ? ranges[0][0] : 0
  }

  if (!params.skipPart1) {
    seeds.forEach((seed) => {
      const range: Range = [seed, seed]
      const lowestLocation = getLocation(range)
      if (part1 < 0 || part1 > lowestLocation) {
        part1 = lowestLocation
      }
    })
  }

  if (!params.skipPart2) {
    for (let i = 0; i < seeds.length; i += 2) {
      const range: Range = [seeds[i], seeds[i] + seeds[i + 1]]
      const lowestLocation = getLocation(range)
      if (part2 < 0 || part2 > lowestLocation) {
        part2 = lowestLocation
      }
    }
  }

  return { part1, part2 }
}
