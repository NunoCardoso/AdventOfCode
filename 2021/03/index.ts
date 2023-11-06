import _ from 'lodash'
import { Params } from '../../aoc.d'

export default async (lineReader: any, params: Params) => {
  const rawData: Array<number> = []
  let lineLength: number = 0
  for await (const line of lineReader) {
    rawData.push(parseInt(line, 2))
    if (lineLength === 0) {
      lineLength = line.length
    }
  }

  const filterData = (rawData: Array<any>, cleanMod: number, verifyMod: number) => {
    const _with: any = []
    const _without: any = []
    rawData.forEach((raw) => {
      const workingValue = raw % cleanMod
      // console.log('raw', raw, 'cleanMod', cleanMod, 'verifyMod', verifyMod, 'work value', workingValue )
      if (workingValue >= verifyMod) {
        _with.push(raw)
      } else {
        _without.push(raw)
      }
    })

    return [_with, _without]
  }
  const part1 = (): number => {
    const data: any = { gammaRate: [], epsilonRate: [] }

    Array(lineLength)
      .fill(undefined)
      .forEach((val, index) => {
        const cleanMod = Math.pow(2, lineLength - index)
        const verifyMod = Math.pow(2, lineLength - 1 - index)

        const [rawDataWithLeftmostBit] = filterData(rawData, cleanMod, verifyMod)

        if (rawDataWithLeftmostBit.length > rawData.length / 2) {
          data.gammaRate.push('1')
          data.epsilonRate.push('0')
        } else {
          data.gammaRate.push('0')
          data.epsilonRate.push('1')
        }
      })
    return parseInt(data.gammaRate.join(''), 2) * parseInt(data.epsilonRate.join(''), 2)
  }

  const part2 = (): any => {
    const data: any = { O2rating: undefined, CO2rating: undefined }

    let rawDataO2 = _.cloneDeep(rawData)
    let rawDataCO2 = _.cloneDeep(rawData)

    Array(lineLength)
      .fill(undefined)
      .forEach((val, index) => {
        const cleanMod = Math.pow(2, lineLength - index)
        const verifyMod = Math.pow(2, lineLength - 1 - index)

        if (rawDataO2.length >= 2) {
          const [withBitO2, withoutBitO2] = filterData(rawDataO2, cleanMod, verifyMod)
          if (withBitO2.length === 1) {
            data.O2rating = withBitO2[0]
            rawDataO2 = []
            return
          }
          rawDataO2 = withBitO2.length >= withoutBitO2.length ? withBitO2 : withoutBitO2
        }

        if (rawDataCO2.length >= 2) {
          const [withBitCO2, withoutBitCO2] = filterData(rawDataCO2, cleanMod, verifyMod)
          if (withoutBitCO2.length === 1) {
            data.CO2rating = withoutBitCO2[0]
            rawDataCO2 = []
            return
          }
          rawDataCO2 = withBitCO2.length <= withoutBitCO2.length ? withBitCO2 : withoutBitCO2
        }
      })
    return data.O2rating * data.CO2rating
  }

  return {
    part1: params.part2.skip !== true ? part1() : 0,
    part2: params.part2.skip !== true ? part2() : 0
  }
}
