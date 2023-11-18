import { Params } from 'aoc.d'
import clc from 'cli-color'
import _ from 'lodash'

type Situation = Array<Array<string>>

type Point = {
  situation: Situation,
  distance: number
  step: number
}


export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const data: Point = {situation: [], distance: 1000, step: 0}

  const indexOfObjects: Array<string> = ['E']

  for await (const line of lineReader) {
    const objects: Array<string> = []
    const m = line.match(/The (.+) floor contains (.*)./)
    const index = ['first', 'second', 'third', 'fourth'].indexOf(m[1])
    if (index === 0) {
      objects.push('E')
    }
    const bits = m[2].split(/(, |and )/)
    for (let i = 0; i < bits.length; i++) {
      if (bits[i].trim().startsWith('a ')) {
        let m2 = bits[i].match(/a (.+)-compatible microchip/)
        if (m2?.length > 0) {
          const object = m2[1][0].toUpperCase() + 'M'
          objects.push(object)
          indexOfObjects.push(object)
        } else {
          m2 = bits[i].match(/a (.+) generator/)
          if (m2?.length > 0) {
            const object = m2[1][0].toUpperCase() + 'G'
            objects.push(object)
            indexOfObjects.push(object)
          }
        }
      }
    }
    data.situation![index] = objects.sort()
  }

  const calculateDistance = (situation: Situation) => {
    let count = 0
    situation.forEach((s, i) => {
      count += s.length * ((situation.length - 1) - i)
    })
    return count
  }

  data.distance = calculateDistance(data.situation!)

  const pointToString = (point: Point) => JSON.stringify(point.situation)

  const print = (point: Point) => {
    for (let i = point.situation!.length - 1; i >= 0; i--) {
      console.log(
        clc.yellow('F' + (i + 1)) +
          ' ' +
          indexOfObjects
            .map((o) => {
              if (point.situation![i].indexOf(o) >= 0) {
                return o
              } else {
                return '. '
              }
            })
            .join(' ')
      )
    }
    console.log('step: ', data.step, 'distance:',  data.distance)
  }

  const getElevatorFloor = (head: Point): number =>
     _.findIndex(head.situation, (floor: Array<string>) => floor.includes('E'))

  const getNewPoints = (head: Point) : Array<Point> => {

    // 1. Elevator can only go up or down
    // 2. Elevator can carry min 1 element, max 2 elements
    // 3. Move has to be legal, no frying microchips
    let newPoints: Array<Point> = []
    const elevatorFloor: number = getElevatorFloor(head)
    const elementsInFloor: Array<string> = head.situation[elevatorFloor].filter((el: string) => el !== 'E')
    const candidateFloors = [elevatorFloor - 1, elevatorFloor + 1].filter(v => v >= 0 && v < head.situation.length - 1)



    return []
  }

  const solveFor = (opened: Array<Point>, visited: Record<string, number>) => {
    let lowestSteps: number = 999999

    const searchAlgorithm = async (opened: Array<Point>, visited: Record<string, number>) => {
      const head: Point = opened.splice(-1)[0]
      const key = pointToString(head)

      if (head.distance === 0) {
        if (lowestSteps > head.step) {
          lowestSteps = head.step
        }
        return
      }

      if (!Object.prototype.hasOwnProperty.call(visited, key)) {
        visited[key] = head.step
      } else {
        if (visited[key] > head.step) {
          visited[key] = head.step
        }
      }

      const newPoints: Array<Point> = getNewPoints(head)

      if (newPoints.length > 0) {
        opened.push(...newPoints)
        opened.sort((a, b) => b.distance - a.distance)
      }
    }

    while (opened.length > 0) {
      searchAlgorithm(opened, visited)
    }
    return lowestSteps

  }

  print(data)

  if (params.part1?.skip !== true) {
    part1 = solveFor([data], {})
  }

  return { part1, part2 }
}
