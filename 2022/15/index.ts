import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Point = { x: number; y: number; distance?: number; range?: Array<Point> }
  type RRange = [number, number]
  const dataBeacons: Array<Point> = []
  const dataSensors: Array<Point> = []
  let minX: number | undefined
  let minY: number | undefined
  let maxX: number | undefined
  let maxY: number | undefined

  for await (const line of lineReader) {
    const m = line.match(/^Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)$/)
    if (m) {
      const sensor = { x: parseInt(m[1]), y: parseInt(m[2]) }
      dataSensors.push(sensor)
      const beacon = { x: parseInt(m[3]), y: parseInt(m[4]) }
      if (dataBeacons.indexOf(beacon) < 0) {
        dataBeacons.push(beacon)
      }
      if (minX === undefined || sensor.x < minX) {
        minX = sensor.x
      }
      if (maxX === undefined || sensor.x > maxX) {
        maxX = sensor.x
      }
      if (minY === undefined || sensor.y < minY) {
        minY = sensor.y
      }
      if (maxY === undefined || sensor.y > maxY) {
        maxY = sensor.y
      }
      if (minX === undefined || beacon.x < minX) {
        minX = beacon.x
      }
      if (maxX === undefined || beacon.x > maxX) {
        maxX = beacon.x
      }
      if (minY === undefined || beacon.y < minY) {
        minY = beacon.y
      }
      if (maxY === undefined || beacon.y > maxY) {
        maxY = beacon.y
      }
    }
  }

  const generateRangeBoundariesForY = (s: Point, y: number, minX?: number, maxX?: number) => {
    const dist = Math.abs(s.y - y) - s.distance!
    if (dist > 0) {
      return []
    }
    const point1 = { x: s.x - Math.abs(dist), y: y }
    const point2 = { x: s.x + Math.abs(dist), y: y }
    if (_.isNumber(minX)) {
      if (point1.x < minX!) {
        point1.x = minX!
      }
      if (point2.x < minX!) {
        point2.x = minX!
      }
    }
    if (_.isNumber(maxX)) {
      if (point1.x > maxX!) {
        point1.x = maxX!
      }
      if (point2.x > maxX!) {
        point2.x = maxX!
      }
    }
    if (point1.x === point2.x) {
      return [point1]
    }
    return [point1, point2]
  }

  const getDistance = (s: Point, b: Point) => Math.abs(s.x - b.x) + Math.abs(s.y - b.y)

  const findDistance = (s: Point, beacons: Array<Point>): void => {
    let closestBeaconDistance: number | undefined
    beacons.forEach((b, i) => {
      const distanceFromPoint = getDistance(s, b)
      if (closestBeaconDistance === undefined || distanceFromPoint < closestBeaconDistance) {
        closestBeaconDistance = distanceFromPoint
      }
    })
    s.distance = closestBeaconDistance
  }

  const theyOverlap = (source: RRange, target: RRange): boolean =>
    target[0] <= source[0] ? target[1] >= source[0] : target[0] <= source[1]

  const mergeRanges = (ranges: Array<RRange>): Array<RRange> => {
    if (ranges.length < 2) {
      return ranges
    }
    const inputRange: Array<RRange> = _.cloneDeep(ranges).sort((a: RRange, b: RRange) => a[0] - b[0])
    for (let i = inputRange.length - 2; i >= 0; i--) {
      const source: RRange = inputRange[i]
      const target: RRange = inputRange[i + 1]
      if (theyOverlap(source, target)) {
        inputRange[i][0] = Math.min(source[0], target[0])
        inputRange[i][1] = Math.max(source[1], target[1])
        inputRange[i + 1] = [-123456789, -123456789]
      }
    }
    const res = _.filter(inputRange, (i: RRange) => i[0] !== -123456789 && i[1] !== -123456789)
    return res
  }

  const numberOfPointsWithoutBeaconAt = (y: number, minX?: number, maxX?: number): Array<RRange> => {
    let whereBeaconsAreNot: Array<RRange> = []
    dataSensors.forEach((s, i) => {
      log.info(i, 'calculating range for sensor', s)
      const rangePoints = generateRangeBoundariesForY(s, y, minX, maxX)
      if (rangePoints.length > 0) {
        const foundIndex: number = _.findIndex(
          whereBeaconsAreNot,
          (p: RRange) =>
            (p[0] >= rangePoints[0].x && p[0] <= rangePoints[rangePoints.length - 1].x) ||
            (p[1] >= rangePoints[0].x && p[1] <= rangePoints[rangePoints.length - 1].x)
        )
        if (foundIndex < 0) {
          whereBeaconsAreNot.push([rangePoints[0].x, rangePoints[rangePoints.length - 1].x])
        } else {
          whereBeaconsAreNot[foundIndex][0] = Math.min(rangePoints[0].x, whereBeaconsAreNot[foundIndex][0])
          whereBeaconsAreNot[foundIndex][1] = Math.max(
            rangePoints[rangePoints.length - 1].x,
            whereBeaconsAreNot[foundIndex][1]
          )
        }

        let originalLength = whereBeaconsAreNot.length
        whereBeaconsAreNot = mergeRanges(whereBeaconsAreNot)
        while (originalLength !== whereBeaconsAreNot.length) {
          originalLength = whereBeaconsAreNot.length
          whereBeaconsAreNot = mergeRanges(whereBeaconsAreNot)
        }
      }
    })
    return whereBeaconsAreNot
  }

  log.debug('sensors', dataSensors.length)
  log.debug('beacons', dataBeacons.length)
  log.debug('minX', minX, 'minY', minY, 'maxX', maxX, 'maxY', maxY)

  dataSensors.forEach((s, i) => {
    log.debug(i, 'Finding distance for sensor', s)
    findDistance(s, dataBeacons)
  })

  let part1: number = 0
  let part2: number = 0

  if (params.part1?.skip !== true) {
    const y = params!.y
    const part1BeaconRanges: Array<RRange> = numberOfPointsWithoutBeaconAt(y)
    part1 = _.reduce(part1BeaconRanges, (memo: number, val: RRange) => memo + (val[1] - val[0] + 1), 0)
    part1-- // I have to subtract the beacon itself,
  }

  if (params.part2?.skip !== true) {
    const limit = params!.limit
    for (let i = 0; i < limit; i++) {
      const partialBeaconRange: Array<RRange> = numberOfPointsWithoutBeaconAt(i, 0, limit)
      // console.log(partialBeaconRange)
      const partial: number = _.reduce(
        partialBeaconRange,
        (memo: number, val: RRange) => memo + (val[1] - val[0] + 1),
        0
      )
      if (partial <= limit) {
        // returns range at y 2906626 Total x 4000000
        // [ [ 0, 2572894 ], [ 2572896, 4000000 ] ]
        const x = partialBeaconRange[0][1] + 1
        part2 = x * 4000000 + i
      }
    }
  }

  return {
    part1,
    part2
  }
}
