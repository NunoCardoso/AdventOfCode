import { Params } from 'aoc.d'
import clc from 'cli-color'
import { World } from 'declarations'
import { waitForKey } from 'util/promise'

type PointObj = {
  row: number
  col: number
}
type Step = PointObj & {
  direction: string
  distanceDone: number
  distanceLeft: number
}

type Path = Step[]

type Data = {
  end: PointObj
  path: Path | undefined
  shortestDistance: number
  uniqueLocations: Set<string>
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let world: World<string> = []
  let start: PointObj
  let end: PointObj
  let rowIndex = 0
  for await (const line of lineReader) {
    const values = line.split('')
    let startIndex = values.findIndex((v: string) => v === 'S')
    let endIndex = values.findIndex((v: string) => v === 'E')
    if (startIndex >= 0) {
      start = { row: rowIndex, col: startIndex }
      values[startIndex] = '.'
    }
    if (endIndex >= 0) {
      end = { row: rowIndex, col: endIndex }
      values[endIndex] = '.'
    }
    world.push(values)
    rowIndex++
  }

  const printWorld = (world: World<string>, bestOpened: Path, openedIndex: Record<string, number>, visitedIndex: Record<string, number>, data: Data) => {
    log.info('best opened', bestOpened?.[bestOpened.length - 1]?.distanceDone, 'data', data.path?.[data.path.length - 1]?.distanceDone)
    for (var row = 0; row < world.length; row++) {
      let s = ''
      for (var col = 0; col < world[row].length; col++) {
        let val = world[row][col]
        if (val === '#') {
          s += clc.yellow('#')
        } else {
          let points = [row + ',' + col + ',<', row + ',' + col + ',^', row + ',' + col + ',v', row + ',' + col + ',>']
          let openedIndexHas = points.some((p) => openedIndex[p] !== undefined)
          let visitedIndexHas = points.some((p) => visitedIndex[p] !== undefined)
          let inPath = bestOpened?.some((s) => s.row === row && s.col === col)
          s += inPath ? clc.green('#') : openedIndexHas ? clc.blue('O') : visitedIndexHas ? clc.red('V') : '.'
        }
      }
      log.info(s)
    }
  }

  const getKeyWithDirection = (s: Step): string => s.row + ',' + s.col + ',' + s.direction
  const isSame = (p1: PointObj, p2: PointObj): boolean => p1.row === p2.row && p1.col === p2.col

  const inTail = (p1: PointObj, path: PointObj[]): boolean => path.some((p) => isSame(p1, p))

  const getManhattanDistance = (p1: PointObj, p2: PointObj) => Math.abs(p1.row - p2.row) + Math.abs(p1.col - p2.col)

  const isWall = (world: World<string>, head: Step) => world[head.row][head.col] === '#'

  const getNewPaths = (world: World<string>, path: Path, data: Data): Path[] => {
    let head = path[path.length - 1]
    let nextSteps: Step[] = []
    let newStep = { ...head }

    // front
    if (newStep.direction === '^') newStep.row = newStep.row - 1
    if (newStep.direction === 'v') newStep.row = newStep.row + 1
    if (newStep.direction === '<') newStep.col = newStep.col - 1
    if (newStep.direction === '>') newStep.col = newStep.col + 1
    newStep.distanceDone = newStep.distanceDone + 1
    if (!isWall(world, newStep) && !inTail(newStep, path)) nextSteps.push(newStep)

    newStep = { ...head }
    // left
    let leftConvertHash: Record<string, string> = { '>': '^', '^': '<', '<': 'v', v: '>' }
    if (newStep.direction === '>') newStep.row = newStep.row - 1
    if (newStep.direction === '<') newStep.row = newStep.row + 1
    if (newStep.direction === '^') newStep.col = newStep.col - 1
    if (newStep.direction === 'v') newStep.col = newStep.col + 1
    if (!isWall(world, newStep))
      nextSteps.push({
        ...head,
        direction: leftConvertHash[head.direction],
        distanceDone: head.distanceDone + 1000
      })

    newStep = { ...head }
    // right
    let rightConvertHash: Record<string, string> = { '>': 'v', v: '<', '<': '^', '^': '>' }
    if (newStep.direction === '<') newStep.row = newStep.row - 1
    if (newStep.direction === '>') newStep.row = newStep.row + 1
    if (newStep.direction === 'v') newStep.col = newStep.col - 1
    if (newStep.direction === '^') newStep.col = newStep.col + 1
    if (!isWall(world, newStep))
      nextSteps.push({
        ...head,
        direction: rightConvertHash[head.direction],
        distanceDone: head.distanceDone + 1000
      })
    return nextSteps.map((step: Step) => [
      ...path,
      {
        ...step,
        distanceLeft: getManhattanDistance(step, data.end)
      }
    ])
  }

  const doAstar = (world: World<string>, opened: Path[], openedIndex: Record<string, number>, visitedIndex: Record<string, number>, data: Data) => {
    log.trace('=== A* === opened', opened.length)
    let path: Path = opened.splice(-1)[0]
    let head = path[path.length - 1]
    log.trace('Picking head', head)
    let headKey = getKeyWithDirection(head)

    if (isSame(head, data.end)) {
      if (head.distanceDone! <= data.shortestDistance) {
        log.debug('got lowest', head.distanceDone)
        data.path = path
        data.shortestDistance = head.distanceDone
        path.forEach((step) => data.uniqueLocations.add(step.row + ',' + step.col))
      }
      return
    }

    visitedIndex[headKey] = head.distanceDone
    delete openedIndex[headKey]

    const newPaths: Path[] = getNewPaths(world, path, data)
    if (newPaths.length !== 0) {
      newPaths.forEach((newPath) => {
        let newHead = newPath[newPath.length - 1]
        const newHeadKey = getKeyWithDirection(newHead)
        // if it matches an openedIndex
        // note that we do not discard if they are the same, so we can get alternative paths
        // this is exclusive to this puzzle
        if (openedIndex[newHeadKey] !== undefined) {
          // the openedIndex is better, so discard it.
          if (openedIndex[newHeadKey] < newHead.distanceDone) {
            return
          }
          // the openedIndex is worse, remove it from opened
          if (openedIndex[newHeadKey] > newHead.distanceDone) {
            let index = opened.findIndex((p: Path) => getKeyWithDirection(p[p.length - 1]) === newHeadKey)
            if (index >= 0) {
              opened.splice(index, 1)
              delete openedIndex[newHeadKey]
            }
          }
        }
        // keep visitedIndexes with the same distance, they may produce alternative paths
        if (visitedIndex[newHeadKey] !== undefined && visitedIndex[newHeadKey] < newHead.distanceDone) {
          return
        }
        opened.push(newPath)
        openedIndex[newHeadKey] = newHead.distanceDone
      })
      opened.sort((a, b) => b[b.length - 1].distanceDone + b[b.length - 1].distanceLeft - a[a.length - 1].distanceDone - a[a.length - 1].distanceLeft)
    }
  }

  const solveFor = async (world: World<string>, start: PointObj, end: PointObj): Promise<Data> => {
    let data: Data = { end, path: [], shortestDistance: Number.MAX_SAFE_INTEGER, uniqueLocations: new Set<string>() }
    let iterations = 0
    let opened: Path[] = [
      [
        {
          ...start,
          direction: '>',
          distanceDone: 0,
          distanceLeft: getManhattanDistance(start, end)
        }
      ]
    ]
    let openedIndex: Record<string, number> = {}
    let visitedIndex: Record<string, number> = {}
    openedIndex['0,0,>'] = 0
    let iteration: number = 0
    while (opened.length > 0) {
      doAstar(world, opened, openedIndex, visitedIndex, data)
      if (params?.ui?.show && params?.ui.during) printWorld(world, opened[opened.length - 1], openedIndex, visitedIndex, data)
      if (params?.ui?.keypress) await waitForKey()
      iterations++
    }
    return data
  }

  let data = await solveFor(world, start!, end!)
  part1 = data.shortestDistance
  if (params?.ui?.show && params?.ui.end) printWorld(world, data.path!, {}, {}, data)
  part2 = data.uniqueLocations.size

  return { part1, part2 }
}
