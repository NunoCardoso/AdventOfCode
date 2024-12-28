import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const filterData = (rawData: Array<number>, cleanMod: number, verifyMod: number) => {
    const _with: Array<number> = []
    const _without: Array<number> = []
    rawData.forEach((raw) => (raw % cleanMod >= verifyMod ? _with.push(raw) : _without.push(raw)))
    return [_with, _without]
  }

  const rawData: Array<number> = []
  let lineLength: number = 0
  for await (const line of lineReader) {
    rawData.push(parseInt(line, 2))
    if (lineLength === 0) lineLength = line.length
  }

  let gammaRate: Array<string> = [],
    epsilonRate: Array<string> = []
  let O2rating: number = 0,
    CO2rating: number = 0
  let rawDataO2 = rawData.slice(),
    rawDataCO2 = rawData.slice()

  Array(lineLength)
    .fill(undefined)
    .forEach((val, index) => {
      const cleanMod = Math.pow(2, lineLength - index)
      const verifyMod = Math.pow(2, lineLength - 1 - index)

      // part1
      const [rawDataWithLeftmostBit] = filterData(rawData, cleanMod, verifyMod)
      if (rawDataWithLeftmostBit.length > rawData.length / 2) {
        gammaRate.push('1')
        epsilonRate.push('0')
      } else {
        gammaRate.push('0')
        epsilonRate.push('1')
      }

      // part2
      if (rawDataO2.length >= 2) {
        const [withBitO2, withoutBitO2] = filterData(rawDataO2, cleanMod, verifyMod)
        if (withBitO2.length === 1) {
          O2rating = withBitO2[0]
          rawDataO2 = []
          return
        }
        rawDataO2 = withBitO2.length >= withoutBitO2.length ? withBitO2 : withoutBitO2
      }

      if (rawDataCO2.length >= 2) {
        const [withBitCO2, withoutBitCO2] = filterData(rawDataCO2, cleanMod, verifyMod)
        if (withoutBitCO2.length === 1) {
          CO2rating = withoutBitCO2[0]
          rawDataCO2 = []
          return
        }
        rawDataCO2 = withBitCO2.length <= withoutBitCO2.length ? withBitCO2 : withoutBitCO2
      }
    })

  part1 = parseInt(gammaRate.join(''), 2) * parseInt(epsilonRate.join(''), 2)
  part2 = O2rating * CO2rating

  return { part1, part2 }
}
