import { Params } from 'aoc.d'
import { Location as Coord, World } from 'declarations'

// x, y, straightsLeft, direction, distance, score
type Location = {
  position: Coord
  straightsLeft: number
  direction: string
  distance: number
  score: number
}

type CoordPlus = [number, number, string, number]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World = []
  for await (const line of lineReader) {
    world.push(line.split('').map(Number))
  }
  const worldDimensions = [world.length, world[0].length]
  log.info('world dimensions', worldDimensions)
  const calculateDistance = (p: Coord | CoordPlus, end: Coord) => end[0] - p[0] + (end[1] - p[1])
  const getKey = (p: Location) => p.position[0] + ';' + p.position[1] + ';' + p.straightsLeft + ';' + p.direction
  const isValidEnd = (c1: Location, c2: Coord) => c1.position[0] === c2[0] && c1.position[1] === c2[1]

  // prettier ignore
  const printLocation = (p: Location) =>
    '[' +
    p.position[0] +
    ',' +
    p.position[1] +
    '](' +
    p.direction +
    ',' +
    p.straightsLeft +
    ',' +
    p.distance +
    ',' +
    p.score +
    ')'

  const isOutOfBounds = (c: Coord | CoordPlus) =>
    c[0] < 0 || c[1] < 0 || c[0] >= worldDimensions[0] || c[1] >= worldDimensions[1]

  const isSame = (p1: Location, p2: Location) =>
    p1.position[0] === p2.position[0] &&
    p1.position[1] === p2.position[1] &&
    p1.straightsLeft === p2.straightsLeft &&
    p1.direction === p2.direction

  const getScores = (p: Coord, dir: string, amount: number) => {
    let sum: number = 0
    for (let i = 1; i <= amount; i++) {
      const newP = [...p]
      switch (dir) {
        case '^':
          newP[0] -= i
          break
        case 'v':
          newP[0] += i
          break
        case '<':
          newP[1] -= i
          break
        case '>':
          newP[1] += i
          break
      }
      sum += world[newP[0]][newP[1]]
    }
    return sum
  }

  const getNewLocations = (p: Location, data: any) => {
    const newLocations: Array<Location> = []
    let newPositions: Array<CoordPlus> = []
    // straight is allowed
    if (p.direction !== '' && p.straightsLeft > 0) {
      if (p.direction === '>' && !isOutOfBounds([p.position[0], p.position[1] + 1])) {
        newPositions = [[p.position[0], p.position[1] + 1, p.direction, world[p.position[0]][p.position[1] + 1]]]
      }
      if (p.direction === '<' && !isOutOfBounds([p.position[0], p.position[1] - 1])) {
        newPositions = [[p.position[0], p.position[1] - 1, p.direction, world[p.position[0]][p.position[1] - 1]]]
      }
      if (p.direction === '^' && !isOutOfBounds([p.position[0] - 1, p.position[1]])) {
        newPositions = [[p.position[0] - 1, p.position[1], p.direction, world[p.position[0] - 1][p.position[1]]]]
      }
      if (p.direction === 'v' && !isOutOfBounds([p.position[0] + 1, p.position[1]])) {
        newPositions = [[p.position[0] + 1, p.position[1], p.direction, world[p.position[0] + 1][p.position[1]]]]
      }
      newPositions?.forEach((newPosition) => {
        newLocations.push({
          position: [newPosition[0], newPosition[1]]!,
          direction: newPosition[2],
          distance: calculateDistance(newPosition!, data.end),
          straightsLeft: --p.straightsLeft,
          score: p.score + newPosition[3]
        })
      })
    }
    // do a turn: left first, right second
    newPositions = []
    let newP: Coord

    if (p.direction === '' || p.direction === '>') {
      newP = [p.position[0] - data.minCurve, p.position[1]]
      if (!isOutOfBounds(newP)) {
        newPositions.push([newP[0], newP[1], '^', getScores(p.position, '^', data.minCurve)])
      }
      newP = [p.position[0] + data.minCurve, p.position[1]]
      if (!isOutOfBounds(newP)) {
        newPositions.push([newP[0], newP[1], 'v', getScores(p.position, 'v', data.minCurve)])
      }
    }
    if (p.direction === '<') {
      newP = [p.position[0] + data.minCurve, p.position[1]]
      if (!isOutOfBounds(newP)) {
        newPositions.push([newP[0], newP[1], 'v', getScores(p.position, 'v', data.minCurve)])
      }
      newP = [p.position[0] - data.minCurve, p.position[1]]
      if (!isOutOfBounds(newP)) {
        newPositions.push([newP[0], newP[1], '^', getScores(p.position, '^', data.minCurve)])
      }
    }
    if (p.direction === '' || p.direction === '^') {
      newP = [p.position[0], p.position[1] - data.minCurve]
      if (!isOutOfBounds(newP)) {
        newPositions.push([newP[0], newP[1], '<', getScores(p.position, '<', data.minCurve)])
      }
      newP = [p.position[0], p.position[1] + data.minCurve]
      if (!isOutOfBounds(newP)) {
        newPositions.push([newP[0], newP[1], '>', getScores(p.position, '>', data.minCurve)])
      }
    }
    if (p.direction === 'v') {
      newP = [p.position[0], p.position[1] + data.minCurve]
      if (!isOutOfBounds(newP)) {
        newPositions.push([newP[0], newP[1], '>', getScores(p.position, '>', data.minCurve)])
      }
      newP = [p.position[0], p.position[1] - data.minCurve]
      if (!isOutOfBounds(newP)) {
        newPositions.push([newP[0], newP[1], '<', getScores(p.position, '<', data.minCurve)])
      }
    }
    newPositions?.forEach((newPosition, i) => {
      newLocations.push({
        position: [newPosition[0], newPosition[1]]!,
        direction: newPosition[2],
        distance: calculateDistance(newPosition!, data.end),
        straightsLeft: data.maxStraight - data.minCurve,
        score: p.score + newPosition[3]
      })
    })

    return newLocations
  }

  const breathFirst = (opened: Array<Location>, openedIndex: Set<string>, visited: Map<string, number>, data: any) => {
    const Location = opened.splice(-1)[0]
    const key = getKey(Location)
    openedIndex.delete(key)

    log.debug('Start Location', printLocation(Location), 'opened', opened.length, 'visited', visited.size)

    if (isValidEnd(Location, data.end)) {
      if (!data.lowestScore || data.lowestScore > Location.score!) {
        // log.info('lowest score found', Location.score)
        data.lowestScore = Location.score!
        // cleanup opened with worse scores
        for (let i = opened.length - 1; i >= 0; i--) {
          if (opened[i].score >= data.lowestScore) {
            const key = getKey(opened[i])
            opened.splice(i, 1)
            openedIndex.delete(key)
          }
        }
      }
      return
    }

    // I already visited this Location with a lower or equal score, return, useless
    if (visited.has(key) && visited.get(key)! <= Location.score!) {
      log.debug('hit on visited cache')
      return
    }
    visited.set(key, Location.score)

    if (openedIndex.has(key)) {
      // I have this Location opened with a lower or equal score, return, useless
      const foundOpenedIndex = opened.findIndex((o) => isSame(o, Location))
      if (foundOpenedIndex >= 0 && opened[foundOpenedIndex].score! <= Location.score!) {
        log.debug('hit on opened cache')
        return
      } else {
        // delete that opened, we have it now
        opened.splice(foundOpenedIndex, 1)
        // already deleted from index
      }
    }

    const newLocations = getNewLocations(Location, data)
    log.debug('Got', newLocations.length, 'new Locations,', newLocations.map(printLocation).join(','))
    if (newLocations.length > 0) {
      opened.push(...newLocations)
      // lowest distance to end first
      opened.sort((a, b) =>
        // (b.distance - a.distance > 0 ? 1 : b.distance - a.distance < 0 ? -1 : b.score! - a.score!)
        b.score - a.score > 0 ? 1 : b.score - a.score < 0 ? -1 : b.distance! - a.distance!
      )
    }
  }

  const solveFor = (maxStraight: number, minCurve: number): number => {
    const visited: Map<string, number> = new Map()
    const data: any = {
      lowestScore: undefined,
      end: [worldDimensions[0] - 1, worldDimensions[1] - 1],
      maxStraight,
      minCurve
    }
    const start: Location = {
      position: [0, 0],
      straightsLeft: maxStraight,
      direction: '',
      distance: calculateDistance([0, 0], data.end),
      score: 0
    }
    const opened: Array<Location> = [start]
    const openedIndex: Set<string> = new Set<string>().add(getKey(start))
    let it = 0
    while (opened.length > 0) {
      breathFirst(opened, openedIndex, visited, data)
      it++
      if (it % 100000 === 0) {
        log.info('it', it, 'opened', opened.length, 'visited', visited.size, 'lowest', data.lowestScore)
      }
    }
    return data.lowestScore
  }

  if (!params.skipPart1) {
    part1 = solveFor(3, 1)
  }
  if (!params.skipPart2) {
    part2 = solveFor(10, 4)
  }

  return { part1, part2 }
}
