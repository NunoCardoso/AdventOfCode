import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Combination } from 'js-combinatorics'

type Floor = string[]

type Step = {
  floors: Floor[]
  key: string // serializing floor state
  distance: number // sum distance of elements to the top floor
  moves: number // moves counter
}

type Path = Step[]

type Data = {
  moves: number
  path: Path
}

type VisitedIndex = Record<string, number>
type QueueIndex = Record<string, [distance: number, moves: number]>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  // to use as A* heuristic if I want
  const calculateDistance = (floors: Floor[]) =>
    // items on last floor cost 0. This is "manhattan distance" of itens to top floor.
    floors.reduce((acc, f, i) => acc + f.length * (floors.length - 1 - i), 0)

  // see readme on why use this instead of a simple JSON.stringify
  const generateKey = (step: Step): string => {
    const hash: Record<string, number[]> = { E: [-1, 0] }
    step.floors.forEach((floor, i) => {
      floor.forEach((element) => {
        if (element === 'E') hash.E[1] = i
        else {
          const code = element[0]
          const type = ['G', 'M']
          if (!hash[code]) hash[code] = []
          hash[code][type.indexOf(element[1])] = i
        }
      })
    })

    const sorted = Object.values(hash).sort((a, b) => (a[0] - b[0] > 0 ? 1 : a[0] - b[0] < 0 ? -1 : a[1] - b[1]))
    return JSON.stringify(sorted)
  }

  const printFloors = (point: Step) => {
    for (let i = point.floors!.length - 1; i >= 0; i--) {
      log.info(
        clc.yellow('F' + (i + 1)) +
          ' ' +
          indexOfObjects.map((o) => (point.floors![i].includes(o) ? o.padEnd(2, ' ') : '. ')).join(' ')
      )
    }
    log.info('step: ', point.moves, 'distance:', point.distance)
  }

  const getElevatorFloor = (step: Step): number => step.floors.findIndex((floor) => floor.includes('E'))

  //  I cannot have an unpaired microchip XM in a floor where there is a YG
  const isValidFloor = (floor: Floor): boolean => {
    const objectsByElement: Record<string, string[]> = {}
    const unpairedMicrochips: string[] = []
    const floorHasAGenerator = floor.some((el) => el.endsWith('G'))

    // making hash of {radioisotope: [generator?, microchip?]} on this floor
    floor.forEach((object) => {
      if (object.length === 2) {
        // not an elevator
        if (!objectsByElement[object[0]]) objectsByElement[object[0]] = []
        objectsByElement[object[0]].push(object)
      }
    })
    // Collect list of unpaired microchips and generators
    Object.values(objectsByElement).forEach((elements) => {
      if (elements.length === 1 && elements[0].endsWith('M')) unpairedMicrochips.push(elements[0])
    })
    return !floorHasAGenerator || (floorHasAGenerator && unpairedMicrochips.length === 0)
  }

  const inTail = (path: Path, newHead: Step) => path.some((step) => step.key === newHead.key)

  // 1. Elevator can only go up or down with minimum of 1 element, maximum of 2 elements
  // 2. There is no point on moving generators down. We take microchips to go down.
  // 3. For a move to be legal, no X+M in same floor with Y+G, without X-G
  const getNewPaths = (path: Path): Path[] => {
    let newPaths: Path[] = []
    let head = path[path.length - 1]
    log.trace('Getting more paths for', head.key)

    const currentElevatorFloor: number = getElevatorFloor(head)
    const objectsInCurrentFloor: string[] = head.floors[currentElevatorFloor].filter((el: string) => el !== 'E')
    const floorAbove: number | null = currentElevatorFloor === head.floors.length - 1 ? null : currentElevatorFloor + 1
    const floorBelow: number | null = currentElevatorFloor === 0 ? null : currentElevatorFloor - 1
    let areFloorsBelowEmpty = true
    for (let i = 0; i < currentElevatorFloor; i++) {
      if (head.floors[i].length > 0) areFloorsBelowEmpty = false
    }

    // let's do up first
    if (floorAbove !== null) {
      let newPathsMovingUp: Path[] = []
      for (let objectPairsToMove of new Combination(objectsInCurrentFloor, 2)) {
        const newHead: Step = { ...head, floors: [...head.floors] }
        newHead.floors[currentElevatorFloor] = objectsInCurrentFloor.filter(
          (o) => o !== 'E' && !objectPairsToMove.includes(o)
        )
        newHead.floors[floorAbove] = newHead.floors[floorAbove].concat(['E', ...objectPairsToMove]).sort()
        newHead.moves++
        newHead.distance = calculateDistance(newHead.floors)
        newHead.key = generateKey(newHead)
        if (
          isValidFloor(newHead.floors[floorAbove]) &&
          isValidFloor(newHead.floors[currentElevatorFloor]) &&
          !inTail(path, newHead)
        )
          newPathsMovingUp.push([...path, newHead])
      }
      // if edge case where no legal moves going up (the test example), then do this with only one up
      if (newPathsMovingUp.length === 0) {
        for (let objectToMove of objectsInCurrentFloor) {
          const newHead: Step = { ...head, floors: [...head.floors] }
          newHead.floors[currentElevatorFloor] = objectsInCurrentFloor.filter((o) => o !== 'E' && o !== objectToMove)
          newHead.floors[floorAbove] = newHead.floors[floorAbove].concat(['E', objectToMove]).sort()
          newHead.moves++
          newHead.distance = calculateDistance(newHead.floors)
          newHead.key = generateKey(newHead)
          if (
            isValidFloor(newHead.floors[floorAbove]) &&
            isValidFloor(newHead.floors[currentElevatorFloor]) &&
            !inTail(path, newHead)
          )
            newPathsMovingUp.push([...path, newHead])
        }
      }
      newPaths = newPaths.concat(newPathsMovingUp)
    }

    // moving down => only one element
    if (floorBelow !== null && !areFloorsBelowEmpty) {
      for (let objectToMove of objectsInCurrentFloor) {
        const newHead: Step = { ...head, floors: [...head.floors] }
        newHead.floors[currentElevatorFloor] = objectsInCurrentFloor.filter((o) => o !== 'E' && o !== objectToMove)
        newHead.floors[floorBelow] = newHead.floors[floorBelow].concat(['E', objectToMove]).sort()
        newHead.moves++
        newHead.distance = calculateDistance(newHead.floors)
        newHead.key = generateKey(newHead)
        if (
          isValidFloor(newHead.floors[floorBelow]) &&
          isValidFloor(newHead.floors[currentElevatorFloor]) &&
          !inTail(path, newHead)
        )
          newPaths.push([...path, newHead])
      }
    }
    return newPaths
  }

  const aStarSorting = (a: Path, b: Path) => b[b.length - 1].moves - a[a.length - 1].moves

  const doAstar = async (queue: Path[], queueIndex: QueueIndex, visitedIndex: VisitedIndex, data: Data) => {
    log.trace('=== A* === queue', queue.length)
    const path: Path = queue.pop()!
    const head: Step = path[path.length - 1]
    log.trace('Picking head', head.key)
    delete queueIndex[head.key]

    if (head.moves > data.moves) {
      log.trace('No point in continuing this, worse than the current best path')
      return
    }

    if (head.distance === 0) {
      if (head.moves < data.moves) {
        log.debug('got lowest', head.moves)
        data.moves = head.moves
        data.path = path
      }
      return
    }

    // check visited status
    const visitedStep = visitedIndex[head.key]
    // never visited or visited with a worse move count
    if (visitedStep === undefined || visitedStep > head.moves) {
      log.trace('No visited with key', head.key, 'Set it with', head.moves)
      visitedIndex[head.key] = head.moves
    } else {
      log.trace('visited with key', head.key, 'is better, returning')
      // return, as there are better.
      return
    }

    const newPaths: Path[] = getNewPaths(path)
    if (newPaths.length > 0) {
      log.trace('Got ', newPaths.length, 'new paths: ')
      newPaths.forEach((newPath, i) => {
        let newHead = newPath[newPath.length - 1]
        log.trace(' > Path #', i, newHead.key, 'distance', newHead.distance, 'moves', newHead.moves)

        let queued = queueIndex[newHead.key]
        let visited = visitedIndex[newHead.key]

        if (!!visited && visited < newHead.moves) {
          log.trace('Found in visiting, it is worse, returning')
          return
        }

        // if visited and better, update
        if (!!visited && visited > newHead.moves) {
          log.trace('Found in visiting, it is better, updating')
          visitedIndex[newHead.key] = newHead.moves
        }

        // if opened and worse, return, do not add
        if (!!queued && queued[1] < newHead.moves) {
          log.trace('Found in queue, it is worse, returning')
          return
        }

        // if opened and better, remove it from queue
        if (!!queued && queued[1] > newHead.moves) {
          log.trace('Found in queue, it is better, removing from queue')
          let index = queue.findIndex((p: Path) => p[p.length - 1].key === newHead.key)
          if (index >= 0) {
            queue.splice(index, 1)
            delete queueIndex[newHead.key]
          }
        }

        // not visited and not opened, or visited and better, opened and better
        queue.push(newPath)
        queueIndex[newHead.key] = [newHead.distance, newHead.moves]
      })
      queue.sort(aStarSorting)
    }
  }

  const solveFor = (step: Step) => {
    let queue: Path[] = [[step]]
    let queueIndex: QueueIndex = { [step.key]: [step.distance, step.moves] }
    let visitedIndex: Record<string, number> = {}
    let data: Data = { moves: Number.MAX_VALUE, path: [] }
    let iterations = 0
    while (queue.length > 0) {
      doAstar(queue, queueIndex, visitedIndex, data)
      iterations++
    }
    console.log('finished in ', iterations, 'iterations')
    if (params.ui?.show && params.ui?.end) {
      data.path.forEach((step) => printFloors(step))
    }
    return data.moves
  }

  let part1: number = 0
  let part2: number = 0

  const step: Step = { floors: [], key: '', distance: 0, moves: 0 }

  let indexOfObjects: string[] = ['E']

  for await (const line of lineReader) {
    const objects: string[] = []
    const [, floor, content] = line.match(/The (.+) floor contains (.*)./)
    const index = ['first', 'second', 'third', 'fourth'].indexOf(floor)
    const bits = content.split(/(, |and )/)
    for (let bit of bits) {
      if (bit.trim().startsWith('a ')) {
        let [, radioisotope, type] = bit.match(/a (.+)(-compatible microchip| generator)/)
        let object = radioisotope[0].toUpperCase() + (type.endsWith('generator') ? 'G' : 'M')
        objects.push(object)
        indexOfObjects.push(object)
      }
    }
    step.floors![index] = objects.sort()
  }
  // add elevator
  step.floors[0].unshift('E')
  indexOfObjects.sort()

  if (!params.skipPart1) {
    const step1 = global.structuredClone(step)
    step1.distance = calculateDistance(step1.floors!)
    step1.key = generateKey(step1)
    if (params.ui?.show) printFloors(step1)
    part1 = solveFor(step1)
  }

  if (!params.skipPart2) {
    const step2 = global.structuredClone(step)
    indexOfObjects = indexOfObjects.concat(['XG', 'XM', 'YG', 'YM'])
    step2.floors[0].push('XG', 'XM', 'YG', 'YM')
    step2.distance = calculateDistance(step2.floors!)
    step2.key = generateKey(step2)
    if (params.ui?.show) printFloors(step2)
    part2 = solveFor(step2)
  }

  return { part1, part2 }
}
