import { Params } from 'aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const rawData: string[][] = []
  let transposedData: string[][] = []

  for await (const line of lineReader) {
    if (transposedData.length === 0) transposedData = new Array(line.length).fill(null).map(() => [])
    rawData.push(line.split(''))
    line.split('').forEach((val: string, index: number) => transposedData[index].push(val))
  }

  let rawDataO2: string[][] = [...rawData]
  let rawDataCO2: string[][] = [...rawData]
  let gammaRate: string[] = []
  let epsilonRate: string[] = []
  let o2: string[] = []
  let co2: string[] = []

  transposedData.forEach((column: string[], index: number) => {
    // this is for part 1
    let ones = column.filter((c) => c === '1').length
    let zeroes = column.length - ones
    gammaRate.push(ones >= zeroes ? '1' : '0')
    epsilonRate.push(ones >= zeroes ? '0' : '1')

    // this is for part 2
    let rawDataO2ones = rawDataO2.filter((data: string[]) => data[index] === '1')
    let rawDataO2zeroes = rawDataO2.filter((data: string[]) => data[index] === '0')
    let rawDataCO2zeroes = rawDataCO2.filter((data: string[]) => data[index] === '0')
    let rawDataCO2ones = rawDataCO2.filter((data: string[]) => data[index] === '1')

    if (rawDataO2.length > 1)
      rawDataO2 = rawDataO2ones.length >= rawDataO2zeroes.length ? rawDataO2ones : rawDataO2zeroes
    if (rawDataO2.length === 1) o2 = rawDataO2[0]

    if (rawDataCO2.length > 1)
      rawDataCO2 = rawDataCO2zeroes.length <= rawDataCO2ones.length ? rawDataCO2zeroes : rawDataCO2ones
    if (rawDataCO2.length === 1) co2 = rawDataCO2[0]
  })
  part1 = parseInt(gammaRate.join(''), 2) * parseInt(epsilonRate.join(''), 2)
  part2 = parseInt(o2.join(''), 2) * parseInt(co2.join(''), 2)

  return { part1, part2 }
}
