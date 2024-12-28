import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Combination } from 'js-combinatorics'

type Floor = Array<string>

type Point = {
  floors: Array<Floor>
  distance: number // sum distance of elements to the top floor
  step: number // steps counter
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const data: Point = { floors: [], distance: 1000, step: 0 }

  let indexOfObjects: Array<string> = ['E']

  const calculateDistance = (floors: Array<Floor>) => {
    let count = 0
    const topFloor = floors.length - 1

    floors.forEach((f, i) => {
      // number of things * distance to topFloor
      count += f.length * (topFloor - i)
    })
    return count
  }

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
    data.floors![index] = objects.sort()
  }

  // elevator is always first
  const generateKey = (point: Point): string => {
    // for this, having [LM,LG] on flpor 2 and [XM,XG] on floor 3 is interchangeable
    // so let's "anonimize" the patters so we can create really unique floor configurations

    // this will be arrays of floors where [G,M] are (order is important)
    // So, a LG in 1st floor and LM in 4th yields [0,3]

    // elevator goes first as the [-1, x] (x = floor number)
    // sorting is important to ensure similar configurations belong to same key
    const hash: Record<string, Array<number>> = { E: [-1, 0] }
    point.floors.forEach((f, i) => {
      f.forEach((el) => {
        if (el === 'E') {
          hash.E[1] = i
        } else {
          const code = el[0]
          const type = ['G', 'M']
          if (!Object.prototype.hasOwnProperty.call(hash, code)) {
            hash[code] = []
          }
          hash[code][type.indexOf(el[1])] = i
        }
      })
    })

    const sorted = Object.values(hash).sort((a, b) =>
      a[0] - b[0] > 0 ? 1 : a[0] - b[0] < 0 ? -1 : a[1] - b[1]
    )
    return JSON.stringify(sorted)
  }

  const printFloors = (point: Point) => {
    for (let i = point.floors!.length - 1; i >= 0; i--) {
      log.info(
        'F' +
          clc.yellow('F' + (i + 1)) +
          ' ' +
          indexOfObjects
            .map((o) => {
              if (point.floors![i].indexOf(o) >= 0) {
                return o.padEnd(2, ' ')
              } else {
                return '. '
              }
            })
            .join(' ')
      )
    }
    log.info('step: ', point.step, 'distance:', point.distance)
  }

  const getElevatorFloor = (head: Point): number =>
    head.floors.findIndex((floor: Floor) => floor.includes('E'))

  const isValidFloor = (floor: Floor): boolean => {
    const objectsByElement: Record<string, Array<string>> = {}
    const unpairedMicrochips: Array<string> = []

    floor.forEach((object) => {
      if (!!object && object.length === 2) {
        // not an elevator
        if (!Object.prototype.hasOwnProperty.call(objectsByElement, object[0])) {
          objectsByElement[object[0]] = []
        }
        objectsByElement[object[0]].push(object)
      }
    })

    Object.keys(objectsByElement).forEach((el) => {
      if (objectsByElement[el].length === 1) {
        const _el = objectsByElement[el][0]
        if (_el.endsWith('M')) {
          unpairedMicrochips.push(_el)
        }
      }
    })

    const floorHasAGenerator = floor.find((el) => el.endsWith('G')) !== undefined

    // If I have an unpaired microchip XM in a floor where there is a YG, then it is invalid
    if (unpairedMicrochips.length > 0 && floorHasAGenerator) {
      return false
    }
    return true
  }

  const goodToAddToOpened = (
    newHead: Point,
    openedIndex: Record<string, number>,
    visitedIndex: Record<string, number>,
    lowest: number
  ) => {
    const newKey = generateKey(newHead)

    if (!Object.prototype.hasOwnProperty.call(visitedIndex, newKey)) {
      // still not in the open
      if (!Object.prototype.hasOwnProperty.call(openedIndex, newKey)) {
        if (newHead.step > lowest) {
          return false
        }
        openedIndex[newKey] = newHead.step
        return true
      }

      // already in the open but with lower steps
      if (openedIndex[newKey] > newHead.step) {
        if (newHead.step > lowest) {
          return false
        }
        openedIndex[newKey] = newHead.step
        return true
      }

      // do not add. it is unvisited, but it is in opened list with lower steps
      return false
    }

    // I revisit it but with lower steps -> re-add to opened
    if (visitedIndex[newKey] > newHead.step) {
      if (newHead.step > lowest) {
        return false
      }
      visitedIndex[newKey] = newHead.step
      openedIndex[newKey] = newHead.step
      return true
    }

    return false
  }

  const getNewPoints = (
    point: Point,
    openedIndex: Record<string, number>,
    visitedIndex: Record<string, number>,
    lowest: number
  ): Array<Point> => {
    // 1. Elevator can only go up or down
    // 2. Elevator can carry min 1 element, max 2 elements
    // 3. So that move is legal, no X+M in same floor with Y-G and no X-G

    const newPoints: Array<Point> = []

    const currentElevatorFloor: number = getElevatorFloor(point)
    const objectsInCurrentFloor: Array<string> = point.floors[currentElevatorFloor].filter(
      (el: string) => el !== 'E'
    )

    // on ground floor, only up
    const candidateFloors = []
    if (currentElevatorFloor === 0) {
      candidateFloors.push(1)
      // on top floor, only down
    } else if (currentElevatorFloor === point.floors.length - 1) {
      candidateFloors.push(point.floors.length - 2)
    } else {
      let floorsDownEmpty = true
      for (let i = 0; i < currentElevatorFloor; i++) {
        if (point.floors[i].length > 0) {
          floorsDownEmpty = false
        }
      }
      // go down only if there are objects there
      candidateFloors.push(currentElevatorFloor + 1)
      if (!floorsDownEmpty) {
        candidateFloors.push(currentElevatorFloor - 1)
      }
    }

    const combinationOfPairsOfElements = new Combination(objectsInCurrentFloor, 2).toArray()

    for (let nextFloor = 0; nextFloor < candidateFloors.length; nextFloor++) {
      // moving a floor with one element

      const candidateFloor = candidateFloors[nextFloor]
      for (
        let objectsToMoveIndex = 0;
        objectsToMoveIndex < objectsInCurrentFloor.length;
        objectsToMoveIndex++
      ) {
        const oldFloorObjects: Array<string> = objectsInCurrentFloor.slice()
        let newFloorObjects: Array<string> = point.floors[candidateFloor].slice()
        newFloorObjects.push('E')
        // take object from old floor, put on next floor
        newFloorObjects.push(oldFloorObjects.splice(objectsToMoveIndex, 1)[0])
        newFloorObjects = newFloorObjects.sort()

        const newPoint: Point = global.structuredClone(point)
        newPoint.floors[currentElevatorFloor] = oldFloorObjects
        newPoint.floors[candidateFloor] = newFloorObjects
        newPoint.step = newPoint.step + 1
        newPoint.distance = calculateDistance(newPoint.floors)

        // printFloors(newPoint)
        if (
          isValidFloor(newPoint.floors[candidateFloor]) &&
          isValidFloor(newPoint.floors[currentElevatorFloor]) &&
          goodToAddToOpened(newPoint, openedIndex, visitedIndex, lowest)
        ) {
          newPoints.push(newPoint)
        }
      }

      // moving a floor with two elements
      for (
        let objectPairIndex = 0;
        objectPairIndex < combinationOfPairsOfElements.length;
        objectPairIndex++
      ) {
        let oldFloorObjects = objectsInCurrentFloor.slice()
        let newFloorObjects = point.floors[candidateFloor].slice()
        newFloorObjects.push('E')
        // start with the rightmost index, which is always higher
        const objectsToMove: Array<string> = combinationOfPairsOfElements[objectPairIndex]
        oldFloorObjects = oldFloorObjects.filter((o: string) => !objectsToMove.includes(o))
        newFloorObjects.push(...objectsToMove)
        newFloorObjects = newFloorObjects.sort()

        const newPoint = global.structuredClone(point)
        newPoint.floors[currentElevatorFloor] = oldFloorObjects
        newPoint.floors[candidateFloor] = newFloorObjects
        newPoint.step = newPoint.step + 1
        newPoint.distance = calculateDistance(newPoint.floors)

        if (
          isValidFloor(newPoint.floors[candidateFloor]) &&
          isValidFloor(newPoint.floors[currentElevatorFloor]) &&
          goodToAddToOpened(newPoint, openedIndex, visitedIndex, lowest)
        ) {
          newPoints.push(newPoint)
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
    let lowestPoint: Point = { step: 999999, floors: [], distance: 0 }
    const searchAlgorithm = async (
      opened: Array<Point>,
      openedIndex: Record<string, number>,
      visitedIndex: Record<string, number>
    ) => {
      const point: Point = opened.splice(-1)[0]
      const key = generateKey(point)

      if (point.distance === 0) {
        if (lowestPoint.step > point.step) {
          lowestPoint = point
          // remove opened values that have higher steps than current lowest step
          for (let i = opened.length - 1; i >= 0; i--) {
            if (opened[i].step > lowestPoint.step) {
              const key = generateKey(opened[i])
              opened.splice(i, 1)
              delete openedIndex[key]
            }
          }
        }
        return
      }

      if (!Object.prototype.hasOwnProperty.call(visitedIndex, key)) {
        visitedIndex[key] = point.step
      } else {
        if (visitedIndex[key] > point.step) {
          visitedIndex[key] = point.step
        }
      }

      const newPoints: Array<Point> = getNewPoints(point, openedIndex, visitedIndex, lowestPoint.step)
      if (newPoints.length > 0) {
        opened.push(...newPoints)
        opened.sort((a, b) => b.distance - a.distance)
      }
    }

    let it = 0
    while (opened.length > 0) {
      searchAlgorithm(opened, openedIndex, visitedIndex)
      it++
      if (it % 10000 === 0) {
        console.log('it', it, 'opened', opened.length, 'lowestSteps', lowestPoint.step)
      }
    }
    return lowestPoint.step
  }

  indexOfObjects.sort()
  data.distance = calculateDistance(data.floors!)

  if (!params.skipPart1) {
    part1 = solveFor([data], { [generateKey(data)]: 0 }, {})
  }

  if (!params.skipPart2) {
    const data2 = global.structuredClone(data)
    indexOfObjects = indexOfObjects.concat(['XG', 'XM', 'YG', 'YM']).sort()
    data2.floors[0].push('XG', 'XM', 'YG', 'YM')
    data2.distance = calculateDistance(data2.floors!)
    printFloors(data2)
    part2 = solveFor([data2], { [generateKey(data2)]: 0 }, {})
  }

  return { part1, part2 }
}
