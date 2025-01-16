import { Params } from 'aoc.d'
import { BoundingBox } from 'declarations'

type Hit = [time: number, speed: number]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getAllYHits = (initialYSpeed: number, target: BoundingBox) => {
    let yLocation = 0
    let ySpeed = initialYSpeed
    let time = 1
    let res: Hit[] = []
    while (true) {
      yLocation += ySpeed
      if (yLocation <= target[0][1] && yLocation >= target[1][1]) res.push([time, initialYSpeed])
      if (yLocation < target[1][1]) break // overshoot
      ySpeed -= 1
      time++
    }
    return res
  }

  const getAllXHits = (initialXSpeed: number, target: BoundingBox, highestXtime: number, allowedTimes: number[]) => {
    let xLocation = 0
    let xSpeed = initialXSpeed
    let time = 1
    let res: Hit[] = []
    while (true) {
      xLocation += xSpeed
      if (xLocation <= target[1][0] && xLocation >= target[0][0] && allowedTimes.includes(time))
        res.push([time, initialXSpeed])
      if (xLocation > target[1][0]) break // overshoot
      if (xSpeed > 0) xSpeed -= 1
      time++
      if (time > highestXtime) break
    }
    return res
  }

  const getLowestXSpeed = (leftmostPosition: number): number => {
    let val = -1 + Math.sqrt(1 + 8 * leftmostPosition) / 2
    return Math.ceil(val)
  }

  let target: BoundingBox = [
    [0, 0],
    [0, 0]
  ]

  for await (const line of lineReader) {
    const [, x1, x2, y1, y2] = line.match(/target area: x=(.+)\.\.(.+), y=(.+)\.\.(.+)/).map(Number)
    target = [
      [x1, y2],
      [x2, y1]
    ]
  }

  let timeAndYSpeeds: Record<number, number[]> = {}
  let timeAndXSpeeds: Record<number, number[]> = {}

  let shotsInTarget: Hit[] = []
  let lowestYSpeed = target[1][1]
  let highestYSpeed = -1 * (lowestYSpeed + 1)
  let highestYtime: number = 0

  part1 = (highestYSpeed * (highestYSpeed + 1)) / 2
  // ySpeed will range from targetBottomY to -1*(targetBottomY + 1)
  for (let ySpeed = lowestYSpeed; ySpeed <= highestYSpeed; ySpeed++) {
    shotsInTarget = getAllYHits(ySpeed, target)
    shotsInTarget.forEach((hit) => {
      if (!timeAndYSpeeds[hit[0]]) timeAndYSpeeds[hit[0]] = []
      if (!timeAndYSpeeds[hit[0]].includes(hit[1])) timeAndYSpeeds[hit[0]].push(hit[1])
      if (hit[0] > highestYtime) highestYtime = hit[0]
    })
  }

  // now let's get the X ones.
  let lowestXSpeed = getLowestXSpeed(target[0][0])
  let highestXSpeed = target[1][0]
  let highestXtime: number = highestYtime
  // we will only check times that exist in Y, so no point in adding times in X that are not common
  let allowedTimes: number[] = Object.keys(timeAndYSpeeds).map(Number)

  for (let xSpeed = lowestXSpeed; xSpeed <= highestXSpeed; xSpeed++) {
    shotsInTarget = getAllXHits(xSpeed, target, highestXtime, allowedTimes)
    shotsInTarget.forEach((hit) => {
      if (!timeAndXSpeeds[hit[0]]) timeAndXSpeeds[hit[0]] = []
      if (!timeAndXSpeeds[hit[0]].includes(hit[1])) timeAndXSpeeds[hit[0]].push(hit[1])
    })
  }

  let uniqueSpeeds: Set<string> = new Set<string>()

  Object.keys(timeAndXSpeeds).forEach((time: string) => {
    for (let xSpeed of timeAndXSpeeds[+time]) {
      for (let ySpeed of timeAndYSpeeds[+time]) {
        uniqueSpeeds.add(xSpeed + ',' + ySpeed)
      }
    }
  })

  part2 = uniqueSpeeds.size

  return { part1, part2 }
}
