import { Params } from '../../aoc.d'
import _ from 'lodash'
import clc from 'cli-color'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Point = {
    x: number
    y: number
    cost: number
    distance : number
  }
  type Points = Array<Point>
  type Paths = Array<Points>
  type World = Array<Array<string>>

  const world: World = []
  let start: Point; const starts: Points = []; let end: Point

  const getHeight = (level: string): number => 'abcdefghijklmnopqrstuvwxyz'.indexOf(level)

  const getDistanceToFinish = (path: Partial<Point>, end: Point): number =>
    Math.sqrt((path.x! - end.x) * (path.x! - end.x) +
      (path.y! - end.y) * (path.y! - end.y))

  const printPoint = (p: Point) : string => '[' + p.x + ',' + p.y + '-' + p.cost + ']'

  const isSame = (p: Point, p2: Point) : boolean => p.x === p2.x && p.y === p2.y

  const printData = (world: World, path: Points, opened: Paths, newPoints: Points, visited: Points, finished: Points | undefined): Array<string> => {
    console.log('   ' + _.range(0, world[0].length).map((i: number) =>
      i === path[path.length - 1].y ? clc.red(Math.floor(i / 10)) : Math.floor(i / 10)
    ).join(''))
    console.log('   ' + _.range(0, world[0].length).map((i: number) =>
      i === path[path.length - 1].y ? clc.red(i % 10) : (i % 10)
    ).join(''))

    const _world: World = _.cloneDeep(world)

    finished?.forEach((point: Point) => {
      _world[point.x][point.y] = clc.blue('F')
    })

    visited.forEach((o: Point) => {
      _world[o.x][o.y] = clc.red('V')
    })

    opened.forEach((o: Points) => {
      _world[o[o.length - 1].x][o[o.length - 1].y] = clc.cyan('O')
    })

    newPoints.forEach((o: Point) => {
      _world[o.x][o.y] = clc.cyanBright('@')
    })

    path.forEach((point: Point) => {
      _world[point.x][point.y] = clc.green('#')
    })

    _world[path[path.length - 1].x][path[path.length - 1].y] = clc.greenBright('@')
    _world[end.x][end.y] = clc.yellow('E')
    return _world.map((m, i) =>
      (i === path[path.length - 1].x ? clc.red(i.toString().padStart(2, '0')) : i.toString().padStart(2, '0')) +
      ' ' + m.join('')
    )
  }

  const makeNewPaths = (path: Points, opened: Paths, visited: Points, finished: Points | undefined) => {
    const head: Point = path[path.length - 1]
    let newPoints: Points = [
      { x: head.x - 1, y: head.y, cost: head.cost + 1, distance: getDistanceToFinish({ x: head.x - 1, y: head.y }, end) },
      { x: head.x + 1, y: head.y, cost: head.cost + 1, distance: getDistanceToFinish({ x: head.x + 1, y: head.y }, end) },
      { x: head.x, y: head.y - 1, cost: head.cost + 1, distance: getDistanceToFinish({ x: head.x, y: head.y - 1 }, end) },
      { x: head.x, y: head.y + 1, cost: head.cost + 1, distance: getDistanceToFinish({ x: head.x, y: head.y + 1 }, end) }
    ]
    newPoints = _.reject(newPoints, (newPoint: Point) => {
      if (newPoint.x < 0 || newPoint.y < 0 || newPoint.x >= world.length || newPoint.y >= world[0].length) {
        // log.debug('rejecting new path', printPoint(newPath.head), 'out of bounds')
        return true
      }

      const levelDifference: number = getHeight(world[newPoint.x][newPoint.y]) - getHeight(world[head.x][head.y])

      if (levelDifference > 1) {
        log.debug('rejecting new path', printPoint(newPoint), 'unclimbable', levelDifference)
        return true
      }

      // reject if it's in the open list, and it has a worst cost; otherwise, just remove that path from the open list
      const matchOpenedPathIndex = _.findIndex(opened, (p: Points) => isSame(p[p.length - 1], newPoint))
      if (matchOpenedPathIndex >= 0) {
        if (opened[matchOpenedPathIndex][opened[matchOpenedPathIndex].length - 1].cost <= newPoint.cost) {
          log.debug('rejecting new path', printPoint(newPoint), 'on my open list already with better cost')
          return true
        } else {
          log.debug('new path', printPoint(newPoint), 'is better than an opened path, deleting that with head',
            printPoint(opened[matchOpenedPathIndex][opened[matchOpenedPathIndex].length - 1]))
          opened.splice(matchOpenedPathIndex, 1)
        }
      }

      // reject if it's in the visited list, and it has a worst cost; otherwise, keep it
      const matchVisitedPathIndex = _.findIndex(visited, (p: Point) => isSame(p, newPoint))
      if (matchVisitedPathIndex >= 0) {
        if (visited[matchVisitedPathIndex].cost <= newPoint.cost) {
          log.debug('rejecting new path', printPoint(newPoint), 'on my visited list already with better cost')
          return true
        } else {
          log.debug('new path', printPoint(newPoint), 'is better than a visited path, let\'s see where it goes')
        }
      }

      // if it matches somewhere in a finished tail, and this new path has a batter cost than the matched finished tail,
      // then replace that part of the finished tail, and recalculate costs.
      // if new path is worse than the matched finished tail, it can still improve fill out other info

      // this shaves some time off the final solution
      if (finished) {
        const matchFinishedPathIndex: number = _.findLastIndex(finished,
          (p: Point) => isSame(p, newPoint))
        if (matchFinishedPathIndex >= 0 && newPoint.cost < finished[matchFinishedPathIndex].cost) {
          const oldFinishedCost = finished[finished.length - 1].cost
          log.debug('new path', printPoint(newPoint), 'has better tail than finished: than an opened path, deleting that with head')
          finished = path.concat(
            finished.slice(matchFinishedPathIndex, finished.length))
          for (let j = 0; j < finished.length; j++) {
            finished[j].cost = j
          }
          const newFinishedCost = finished[finished.length - 1].cost
          log.debug('Shaving off finished cost from', oldFinishedCost, 'to', newFinishedCost)
          return true
        }
      }
      return false
    })

    return newPoints
  }

  const searchAlgorithm = async (opened: Paths, visited: Points, finished: Points | undefined) => {
    const path: Points = opened.splice(-1)[0]
    const head: Point = path[path.length - 1]
    log.debug('=== Starting ===', head)
    log.debug('path', head, 'opened', opened.length, 'finished', finished ? finished[finished.length - 1].cost : '-')

    if (isSame(head, end)) {
      log.info('Found end', head)
      if (!finished || finished[finished.length - 1].cost > head.cost) {
        log.info('Found better finish', printPoint(head))
        return path
      }
    }

    // adding visited
    const visitedIndex = _.findIndex(visited, (p: Point) => isSame(p, head))
    if (visitedIndex < 0) {
      log.debug('Adding', printPoint(head), 'to visited array, unseen, now visited.length is', visited.length)
      visited.push(head)
    } else {
      if (visited[visitedIndex].cost > head.cost) {
        visited[visitedIndex] = _.cloneDeep(head)
        log.debug(printPoint(head), 'was in visited array, but this one has better cost')
      } else {
        log.debug(printPoint(head), 'was in visited array, dumped as I have worst cost')
      }
    }

    const newPoints: Points = makeNewPaths(path, opened, visited, finished)

    if (newPoints.length !== 0) {
      opened.push(...newPoints.map((newPoint: Point) => path.concat(newPoint)))
      opened.sort((a, b) =>
      // orders from lowest to highest
        (b[b.length - 1].distance - a[a.length - 1].distance)
      )

      log.debug('Point', JSON.stringify(head), 'produced', newPoints.length, 'new paths',
        newPoints.map(p => printPoint(p)))
    }
    log.debug('opened most promising', opened.slice(-3).map(p => JSON.stringify(p[p.length - 1])))
    if (params.ui?.show && params.ui?.during) {
      printData(world, path, opened, newPoints, visited, finished).forEach((line) => console.log(line))
      if (_.isNumber(params.ui?.wait)) {
        await new Promise((resolve) => setTimeout(resolve, params.ui!.wait ?? 100))
      }
    }
  }

  for await (const line of lineReader) {
    const vals = line.split('')
    vals.forEach((val: string, i: number) => {
      if (val === 'S') {
        start = {
          x: world.length,
          y: i,
          distance: 1000,
          cost: 0
        }
      }
      if (val === 'a') {
        starts.push({
          x: world.length,
          y: i,
          distance: 1000,
          cost: 0
        })
      }
      if (val === 'E') {
        end = {
          x: world.length,
          y: i,
          distance: 0,
          cost: 0
        }
      }
    })
    world.push(line.replaceAll('E', 'z').split(''))
  }

  log.info('world dimensions', world.length, world[0].length)
  let part1: number = 0; let part2: number = 0

  let finished: Points | undefined
  let visited: Points
  let opened: Paths

  if (params.part1?.skip !== true) {
    finished = undefined
    visited = []
    opened = [[start!]]

    while (!_.isEmpty(opened)) {
      const _finished: Points | undefined = await searchAlgorithm(opened, visited, finished)
      if (_finished) {
        finished = _finished
      }
    }
    part1 = finished?.[finished?.length - 1]?.cost ?? 0
    if (params.ui?.show && params.ui?.end) {
      printData(world, finished!, [], [], [], undefined).forEach(
        (line) => console.log(line))
    }
  }

  if (params.part2?.skip !== true) {
    finished = undefined
    visited = []
    opened = starts!.map(s => [s!])
    while (!_.isEmpty(opened)) {
      const _finished: Points | undefined = await searchAlgorithm(opened, visited, finished)
      if (_finished) {
        finished = _finished
      }
    }
    part2 = finished?.[finished?.length - 1]?.cost ?? 0
    if (params.ui?.show && params.ui?.end) {
      printData(world, finished!, [], [], [], undefined).forEach(
        (line) => console.log(line))
    }
  }

  return {
    part1,
    part2
  }
}
