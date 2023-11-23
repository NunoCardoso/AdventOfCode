import { Params } from 'aoc.d'
import clc from 'cli-color'
import _ from 'lodash'
import { permutationForLength } from 'utils'

type Situation = Array<Array<string>>

type Point = {
  situation: Situation
  distance: number
  step: number
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  const part2: number = 0

  const data: Point = { situation: [], distance: 1000, step: 0 }

  let indexOfObjects: Array<string> = ['E']

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

  indexOfObjects = indexOfObjects.sort()

  const calculateDistance = (situation: Situation) => {
    let count = 0
    situation.forEach((s, i) => {
      count += s.length * (situation.length - 1 - i)
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
    console.log('step: ', point.step, 'distance:', point.distance)
  }

  const getElevatorFloor = (head: Point): number =>
    _.findIndex(head.situation, (floor: Array<string>) => floor.includes('E'))

  const isValidFloor = (floor: Array<string>): boolean => {
    const record: Record<string, Array<string>> = {}
    let valid: boolean = true
    const incompleteElements: Array<string> = []
    floor?.forEach((f) => {
      if (!!f && f.length === 2) {
        if (!Object.prototype.hasOwnProperty.call(record, f[0])) {
          record[f[0]] = []
        }
        record[f[0]].push(f)
      }
    })
    Object.keys(record).forEach((k) => {
      if (record[k].length === 1) {
        incompleteElements.push(record[k][0])
      }
    })

    if (
      _.find(incompleteElements, (el) => el.endsWith('G')) !== undefined &&
      _.find(incompleteElements, (el) => el.endsWith('M')) !== undefined
    ) {
      valid = false
    }
    console.log('Validating floor', floor, 'returning', valid)
    return valid
  }

  const goodToAdd = (
    newHead: Point,
    openedIndex: Record<string, number>,
    visitedIndex: Record<string, number>
  ) => {
    const newKey = pointToString(newHead)

    let unvisitedOrEarlyVisitor: boolean = false
    if (!Object.prototype.hasOwnProperty.call(visitedIndex, newKey)) {
      unvisitedOrEarlyVisitor = true
    } else {
      if (visitedIndex[newKey] > newHead.step) {
        unvisitedOrEarlyVisitor = true
      }
    }

    let unopenedOrEarlyOpener: boolean = false
    if (!Object.prototype.hasOwnProperty.call(openedIndex, newKey)) {
      unopenedOrEarlyOpener = true
    } else {
      if (openedIndex[newKey] > newHead.step) {
        unopenedOrEarlyOpener = true
      }
    }

    return unvisitedOrEarlyVisitor && unopenedOrEarlyOpener
  }

  const getNewPoints = (
    head: Point,
    openedIndex: Record<string, number>,
    visitedIndex: Record<string, number>
  ): Array<Point> => {
    // 1. Elevator can only go up or down
    // 2. Elevator can carry min 1 element, max 2 elements
    // 3. So that move is legal, no X+M in same floor with Y-G and no X-G

    const newPoints: Array<Point> = []

    const currentElevatorFloor: number = getElevatorFloor(head)
    const objectsInCurrentFloor: Array<string> = head.situation[currentElevatorFloor].filter(
      (el: string) => el !== 'E'
    )
    const candidateFloors = [currentElevatorFloor - 1, currentElevatorFloor + 1].filter(
      (v) => v >= 0 && v < head.situation.length - 1
    )

    const permutationRecord: Record<string, Array<number>> = {}
    permutationForLength(objectsInCurrentFloor.length)
      .map((e) => (e[0] > e[1] ? [e[1], e[0]] : [e[0], e[1]]))
      .forEach((e) => {
        const key = e[0] + '-' + e[1]
        if (!Object.prototype.hasOwnProperty.call(permutationRecord, key)) {
          permutationRecord[key] = e
        }
      })
    const indexOfPairsOfObjectsThatCanMovedBetweenFloors: Array<Array<number>> =
      Object.values(permutationRecord)

    /* log.debug('candidate floors:', candidateFloors)
    log.debug('objects in floor:', objectsInCurrentFloor)
    log.debug('indexOfPairsOfObjectsThatCanMovedBetweenFloors:', indexOfPairsOfObjectsThatCanMovedBetweenFloors)
*/
    for (let nextFloor = 0; nextFloor < candidateFloors.length; nextFloor++) {
      // moving a floor with one element

      for (
        let objectsToMoveIndex = 0;
        objectsToMoveIndex < objectsInCurrentFloor.length;
        objectsToMoveIndex++
      ) {
        const oldFloorObjects: Array<string> = _.cloneDeep(objectsInCurrentFloor)
        let newFloorObjects: Array<string> = _.cloneDeep(head.situation[candidateFloors[nextFloor]])
        newFloorObjects.push('E')
        // take object from old floor, put on next floor
        newFloorObjects.push(oldFloorObjects.splice(objectsToMoveIndex, 1)[0])
        newFloorObjects = newFloorObjects.sort()

        const newHead = _.cloneDeep(head)
        newHead.situation[currentElevatorFloor] = oldFloorObjects
        newHead.situation[candidateFloors[nextFloor]] = newFloorObjects
        newHead.step = newHead.step + 1
        newHead.distance = calculateDistance(newHead.situation)

        console.log('Checking if this is valid:')
        print(newHead)
        if (isValidFloor(newFloorObjects) && isValidFloor(oldFloorObjects)) {
          console.log('yup valid')
          if (goodToAdd(newHead, openedIndex, visitedIndex)) {
            console.log('Good to add, not visited or opened')
            newPoints.push(newHead)
          } else {
            console.log('visited or opened, skipped')
          }
        } else {
          console.log('Not valid')
        }
      }

      // moving a floor with two elements
      for (
        let objectPairIndex = 0;
        objectPairIndex < indexOfPairsOfObjectsThatCanMovedBetweenFloors.length;
        objectPairIndex++
      ) {
        console.log('trying floor', candidateFloors[nextFloor])
        const oldFloorObjects = _.cloneDeep(objectsInCurrentFloor)
        let newFloorObjects = _.cloneDeep(head.situation[candidateFloors[nextFloor]])
        newFloorObjects.push('E')
        // start with the rightmost index, which is always higher
        const objectIndexes: Array<number> = indexOfPairsOfObjectsThatCanMovedBetweenFloors[objectPairIndex]
        newFloorObjects.push(oldFloorObjects.splice(objectIndexes[1], 1)[0])
        newFloorObjects.push(oldFloorObjects.splice(objectIndexes[0], 1)[0])
        newFloorObjects = newFloorObjects.sort()

        const newHead = _.cloneDeep(head)
        newHead.situation[currentElevatorFloor] = oldFloorObjects
        newHead.situation[candidateFloors[nextFloor]] = newFloorObjects
        newHead.step = newHead.step + 1
        newHead.distance = calculateDistance(newHead.situation)

        console.log('Checking if this is valid:')
        print(newHead)
        if (isValidFloor(newFloorObjects) && isValidFloor(oldFloorObjects)) {
          console.log('yup valid')
          if (goodToAdd(newHead, openedIndex, visitedIndex)) {
            console.log('Good to add, not visited or opened')
            newPoints.push(newHead)
          } else {
            console.log('visited or opened, skipped')
          }
        } else {
          console.log('Not valid')
        }
      }
    }

    return newPoints
  }

  const solveFor = (
    opened: Array<Point>,
    openedIndex: Record<string, number>,
    visitedIndex: Record<string, number>
  ) => {
    let lowestSteps: number = 999999

    const searchAlgorithm = async (
      opened: Array<Point>,
      openedIndex: Record<string, number>,
      visitedIndex: Record<string, number>
    ) => {
      const head: Point = opened.splice(-1)[0]
      const key = pointToString(head)

      log.debug('search algorithm: looking at')
      print(head)
      if (head.distance === 0) {
        if (lowestSteps > head.step) {
          lowestSteps = head.step
        }
        return
      }

      if (!Object.prototype.hasOwnProperty.call(visitedIndex, key)) {
        visitedIndex[key] = head.step
      } else {
        if (visitedIndex[key] > head.step) {
          visitedIndex[key] = head.step
        }
      }

      const newPoints: Array<Point> = getNewPoints(head, openedIndex, visitedIndex)

      log.debug('point generated:', newPoints.length, 'new points')

      if (newPoints.length > 0) {
        opened.push(...newPoints)
        opened.sort((a, b) => b.distance - a.distance)
      }

      log.debug('there are', opened.length, 'opened points')
    }

    while (opened.length > 0) {
      searchAlgorithm(opened, openedIndex, visitedIndex)
    }
    return lowestSteps
  }

  if (params.part1?.skip !== true) {
    const openedIndex = { [pointToString(data)]: 0 }
    part1 = solveFor([data], openedIndex, {})
  }

  return { part1, part2 }
}
