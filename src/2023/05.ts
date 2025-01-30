import { Params } from 'aoc.d'
import { Range } from 'declarations'

//  destination, source, length
type Rule = [number, number, number]

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = -1
  let part2: number = -1

  const seeds: number[] = []
  const sequence: string[] = ['seed', 'soil', 'fertilizer', 'water', 'light', 'temperature', 'humidity', 'location']
  const almanac: Record<string, Rule[]> = {
    'seed-to-soil': [],
    'soil-to-fertilizer': [],
    'fertilizer-to-water': [],
    'water-to-light': [],
    'light-to-temperature': [],
    'temperature-to-humidity': [],
    'humidity-to-location': []
  }

  const applyRulesOnRange = (range: Range, rules: Rule[]) => {
    const selectedRules: Rule[] = []
    const selectedRanges: Range[] = []
    // pick rules that overlap the range
    for (let rule of rules) {
      const overlap = rule[1] < range[0] ? rule[1] + rule[2] > range[0] : rule[1] < range[1]
      if (overlap) selectedRules.push(rule)
    }

    let lowValue: number = range[0]
    let highValue: number = Number.NaN
    // apply rule on selected ranges
    while (true) {
      const rule = selectedRules.find((r) => r[1] <= lowValue && lowValue < r[1] + r[2])
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

  const applyRules = (rules: Rule[], ranges: Range[]): Range[] =>
    ranges.map((range) => applyRulesOnRange(range, rules)).flat()

  const getLocation = (ranges: Range[]): number => {
    for (let i = 0; i < sequence.length - 1; i++)
      ranges = applyRules(almanac[`${sequence[i]}-to-${sequence[i + 1]}`], ranges)
    ranges.sort((a, b) => a[0] - b[0])
    return ranges.length > 0 ? ranges[0][0] : 0
  }

  let map: string = ''
  for await (const line of lineReader) {
    if (line.startsWith('seeds:'))
      line
        .split(':')[1]
        .trim()
        .split(/\s+/)
        .forEach((seed: string) => seeds.push(+seed))
    else if (line.endsWith('map:')) map = line.split(/\s+/)[0].trim()
    else if (line !== '') almanac[map].push(line.split(/\s+/).map(Number))
  }

  if (!params.skipPart1) {
    seeds.forEach((seed) => {
      const lowestLocation = getLocation([[seed, seed]])
      if (part1 < 0 || part1 > lowestLocation) part1 = lowestLocation
    })
  }

  if (!params.skipPart2) {
    for (let i = 0; i < seeds.length; i += 2) {
      const lowestLocation = getLocation([[seeds[i], seeds[i] + seeds[i + 1]]])
      if (part2 < 0 || part2 > lowestLocation) part2 = lowestLocation
    }
  }

  return { part1, part2 }
}
