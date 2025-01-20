import { Params } from 'aoc.d'
import { Location, Range } from 'declarations'
import { lineIntersect } from 'util/geometry'
import { getKey } from 'util/location'
import { mergeRange } from 'util/range'

// x, y, index of beacon
type Sensor = {
  center: Location
  corners: Location[]
}
type Beacon = Location

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const beacons: Beacon[] = []
  const beaconIndex: Set<string> = new Set() // to remove duplicates
  const sensors: Sensor[] = []

  const rotate45deg = (beacon: Beacon): Beacon => [beacon[0] + beacon[1], beacon[1] - beacon[0]]
  const unrotate45deg = (beacon: Beacon): Beacon => [(beacon[0] - beacon[1]) / 2, (beacon[1] + beacon[0]) / 2]
  const getAxisRatio = (p: Location) => p[0] + p[1]

  const sensorIncludesLocation = (sensor1: Sensor, location: Location) => {
    if (location[0] < sensor1.corners[0][0] || sensor1.corners[1][0] < location[0]) return false
    if (location[1] < sensor1.corners[0][1] || sensor1.corners[3][1] < location[1]) return false
    return true
  }

  const getInterceptedSensors = (sensors: Sensor[], constantY: number): Sensor[] =>
    sensors.filter(
      (sensor) =>
        sensor.corners.some((corner) => getAxisRatio(corner) < constantY) &&
        sensor.corners.some((corner) => getAxisRatio(corner) >= constantY)
    )

  const getSensorRangeInterceptions = (sensors: Sensor[], axis: number): Location[][] => {
    const sensorRangeInterceptions: Location[][] = []

    sensors.forEach((sensor) => {
      // square corners: [0=NW, 1=NE, 2=SW, 3=NE]
      // will return either the intercepts on lines [W, N (0->1)], or lines [S (2->3), E]
      // x goes from min to max
      if (getAxisRatio(sensor.corners[0]) <= axis && axis < getAxisRatio(sensor.corners[1])) {
        sensorRangeInterceptions.push([
          [sensor.corners[0][0], axis - sensor.corners[0][0]],
          [axis - sensor.corners[0][1], sensor.corners[0][1]]
        ])
      }
      if (getAxisRatio(sensor.corners[2]) <= axis && axis <= getAxisRatio(sensor.corners[3])) {
        sensorRangeInterceptions.push([
          [sensor.corners[3][0] - (getAxisRatio(sensor.corners[3]) - axis), sensor.corners[3][1]],
          [sensor.corners[3][0], sensor.corners[3][1] - (getAxisRatio(sensor.corners[3]) - axis)]
        ])
      }
    })
    return sensorRangeInterceptions
  }

  const rectangleLines = (sensor: Sensor): [Location, Location][] => [
    [sensor.corners[0], sensor.corners[1]],
    [sensor.corners[0], sensor.corners[2]],
    [sensor.corners[1], sensor.corners[3]],
    [sensor.corners[2], sensor.corners[3]]
  ]

  const rectangleIntersects = (sensorA: Sensor, sensorB: Sensor) => {
    const intersects: Location[] = []
    rectangleLines(sensorA).forEach((lineA: [Location, Location]) => {
      rectangleLines(sensorB).forEach((lineB: [Location, Location]) => {
        const intersectLocation = lineIntersect(lineA, lineB)
        if (intersectLocation) intersects.push(intersectLocation)
      })
    })
    return intersects
  }

  const augmentRectangle = (sensor: Sensor): Sensor => ({
    ...sensor,
    corners: [
      [sensor.corners[0][0] - 1, sensor.corners[0][1] - 1],
      [sensor.corners[1][0] + 1, sensor.corners[1][1] - 1],
      [sensor.corners[2][0] - 1, sensor.corners[2][1] + 1],
      [sensor.corners[3][0] + 1, sensor.corners[3][1] + 1]
    ]
  })

  for await (const line of lineReader) {
    const [, x1, y1, x2, y2] = line
      .match(/^Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)$/)
      .map(Number)
    const beacon = rotate45deg([x2, y2])
    if (!beaconIndex.has(getKey(beacon))) {
      beacons.push(beacon)
      beaconIndex.add(getKey(beacon))
    }
    const sensor: Sensor = { center: rotate45deg([x1, y1]), corners: [] }
    const beaconRadius = Math.max(Math.abs(beacon[0] - sensor.center[0]), Math.abs(beacon[1] - sensor.center[1]))
    sensor.corners = [
      [sensor.center[0] - beaconRadius, sensor.center[1] - beaconRadius],
      [sensor.center[0] + beaconRadius, sensor.center[1] - beaconRadius],
      [sensor.center[0] - beaconRadius, sensor.center[1] + beaconRadius],
      [sensor.center[0] + beaconRadius, sensor.center[1] + beaconRadius]
    ] as Location[]
    sensors.push(sensor)
  }

  if (!params.skipPart1) {
    const startLocation: Location = [0!, params!.y]
    const endLocation: Location = [params.limit!, params!.y]
    const startLocationRotated = rotate45deg(startLocation)
    const endLocationRotated = rotate45deg(endLocation)
    const probedAxisSlope = getAxisRatio(startLocationRotated) // endLocationRotated will have the same
    log.debug(startLocation, endLocation, startLocationRotated, endLocationRotated, probedAxisSlope)
    const interceptedSensors: Sensor[] = getInterceptedSensors(sensors, probedAxisSlope)
    // pairs of points where max sensor range intercepts the axis slope, one pair per beacon
    // if it intercepts a corner, both points are equal
    const rangeInterceptions: Location[][] = getSensorRangeInterceptions(interceptedSensors, probedAxisSlope)
    // since the flat slope is now converted to a 45 degree, I can count y or x values. I will use x as they are sorted
    log.debug('range interceptions', rangeInterceptions)
    let rangesWhereBeaconCannotExist: Range[] = rangeInterceptions
      .map((range: Location[]) => [range[0][0], range[1][0]] as Range)
      .sort((a: Range, b: Range) => a[0] - b[0] || a[1] - b[1])
    // let's merge common ranges so it is easier to see h (have it sorted by x from min to max)
    rangesWhereBeaconCannotExist = mergeRange(rangesWhereBeaconCannotExist)
    // range 8-10 has 3 slots, hence 10-8+1.
    part1 = rangesWhereBeaconCannotExist.reduce((acc, range) => acc + (range[1] - range[0]) + 1, 0)
    // slots that have already beacons should be removed
    const beaconsInAxisSlope = beacons.filter((beacon) => getAxisRatio(beacon) === probedAxisSlope)
    log.debug('Beacons in slope', beaconsInAxisSlope)
    part1 -= beaconsInAxisSlope.length
  }

  if (!params.skipPart2) {
    // we need to find intersects for all rectangles, along with corners
    const intersectsAndCorners: Location[] = []
    const intersectsAndCornersIndex: Set<string> = new Set()

    for (let i = 0; i < sensors.length - 1; i++) {
      augmentRectangle(sensors[i]).corners.forEach((corner) => {
        if (!intersectsAndCornersIndex.has(getKey(corner))) {
          intersectsAndCorners.push(corner)
          intersectsAndCornersIndex.add(getKey(corner))
        }
      })
      for (let j = i + 1; j < sensors.length; j++) {
        // there is a max of 4 intercepts
        const intersects = rectangleIntersects(augmentRectangle(sensors[i]), augmentRectangle(sensors[j]))
        intersects.forEach((intersect) => {
          if (!intersectsAndCornersIndex.has(getKey(intersect))) {
            intersectsAndCorners.push(intersect)
            intersectsAndCornersIndex.add(getKey(intersect))
          }
        })
      }
    }
    // add the last i
    augmentRectangle(sensors[sensors.length - 1]).corners.forEach((corner) => {
      if (!intersectsAndCornersIndex.has(getKey(corner))) {
        intersectsAndCorners.push(corner)
        intersectsAndCornersIndex.add(getKey(corner))
      }
    })

    const foundBeacons: Location[] = []
    intersectsAndCorners.forEach((candidateBeacon) => {
      // let's see if that beacon is not inside a sensor square
      const originalBeacon = unrotate45deg(candidateBeacon)
      if (sensors.every((sensor, i) => !sensorIncludesLocation(sensor, candidateBeacon))) {
        if (
          originalBeacon[0] >= 0 &&
          originalBeacon[0] <= params.limit &&
          originalBeacon[1] >= 0 &&
          originalBeacon[1] <= params.limit
        ) {
          foundBeacons.push(originalBeacon)
        }
      }
    })

    part2 = foundBeacons![0][0] * 4000000 + foundBeacons![0][1]
  }

  return { part1, part2 }
}
