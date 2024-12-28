import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Point, World } from 'declarations'
import _ from 'lodash'

// x, y, distance, cost
type Step = [number, number, number, number]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world1: World = []
  const world2: World = []

  for await (const line of lineReader) {
    world1.push(line.split('').map(Number))
  }

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      for (let a = 0; a < world1.length; a++) {
        for (let b = 0; b < world1[a].length; b++) {
          let newVal = (world1[a][b] + i + j) % 9
          if (newVal === 0) newVal = 9
          const newI = a + world1.length * i
          const newJ = b + world1[0].length * j
          if (!world2[newI]) {
            world2[newI] = []
          }
          world2[newI][newJ] = newVal
        }
      }
    }
  }

  log.info('World 1 size', [world1.length, world1[0].length])
  log.info('World 2 size', [world2.length, world2[0].length])
  const getKey = (s: Step | Point): string => '[' + s[0] + ',' + s[1] + ']'

  const readKey = (s: string): Point => [...s.matchAll(/\d+/g)].map((x: any) => parseInt(x[0])) as Point
  const isSame = (s: Step | Point, s2: Step | Point): boolean => s[0] === s2[0] && s[1] === s2[1]

  const outOfBounds = (newStep: Step | Point, end: Point) =>
    newStep[0] < 0 || newStep[1] < 0 || newStep[0] > end[0] || newStep[1] > end[1]

  const getDistanceToFinish = (x: number, y: number, end: Point): number => end[0] - x + (end[1] - y)

  const printWorld = (
    world: World<string | number>,
    opened: Array<Step>,
    visited: Record<string, number>,
    finished: Record<string, number>
  ) => {
    const _world = _.cloneDeep(world)
    Object.keys(visited).forEach((s: string) => {
      const p: Point = readKey(s)
      _world[p[0]][p[1]] = clc.red('V')
    })
    opened.forEach((s: Step) => {
      _world[s[0]][s[1]] = clc.cyan('O')
    })
    _world.forEach((w) => {
      console.log(w.join(''))
    })
    console.log('lowest cost', finished.lowestCost)
  }

  const searchAlgorithm = async (
    world: World,
    opened: Array<Step>,
    visited: Record<string, number>,
    finished: Record<string, any>
  ) => {
    const head: Step = opened.splice(-1)[0]
    const key: string = getKey(head)
    log.debug('=== Starting ===')
    log.debug('path', head, 'opened', opened.length)

    if (isSame(head, finished.end)) {
      if (finished.lowestCost > head[3]) {
        finished.lowestCost = head[3]
      }
      return
    }

    if (!Object.prototype.hasOwnProperty.call(visited, key)) {
      visited[key] = head[3]
    } else {
      if (visited[key] > head[3]) {
        visited[key] = head[3]
      }
    }

    const newSteps: Array<Step> = _.reject(
      [
        [
          head[0] - 1,
          head[1],
          getDistanceToFinish(head[0] - 1, head[1], finished.end),
          head[3] + (outOfBounds([head[0] - 1, head[1]], finished.end) ? 0 : (world[head[0] - 1][head[1]] as number))
        ],
        [
          head[0] + 1,
          head[1],
          getDistanceToFinish(head[0] + 1, head[1], finished.end),
          head[3] + (outOfBounds([head[0] + 1, head[1]], finished.end) ? 0 : (world[head[0] + 1][head[1]] as number))
        ],
        [
          head[0],
          head[1] - 1,
          getDistanceToFinish(head[0], head[1] - 1, finished.end),
          head[3] + (outOfBounds([head[0], head[1] - 1], finished.end) ? 0 : (world[head[0]][head[1] - 1] as number))
        ],
        [
          head[0],
          head[1] + 1,
          getDistanceToFinish(head[0], head[1] + 1, finished.end),
          head[3] + (outOfBounds([head[0], head[1] + 1], finished.end) ? 0 : (world[head[0]][head[1] + 1] as number))
        ]
      ],
      (newStep: Step) => {
        if (outOfBounds(newStep, finished.end)) {
          return true
        }

        const newKey = getKey(newStep)
        // reject if it's in the visited list, and it has a worst cost; otherwise, keep it
        if (Object.prototype.hasOwnProperty.call(visited, newKey) && visited[newKey] <= newStep[3]) {
          return true
        }

        const matchOpenedPathIndex = _.findIndex(opened, (s: Step) => isSame(s, newStep))
        if (matchOpenedPathIndex >= 0) {
          // worse cost
          if (opened[matchOpenedPathIndex][3] <= newStep[3]) {
            return true
          } else {
            opened.splice(matchOpenedPathIndex, 1)
          }
        }

        return false
      }
    )

    if (newSteps.length !== 0) {
      opened.push(...newSteps)
      opened.sort((a, b) => {
        // lowest cost first.
        // for same cost, lowest distance first
        return b[3] - a[3] > 0 ? 1 : b[3] - a[3] < 0 ? -1 : b[2] - a[2]
      })
    }
  }

  const getThemPath = async (
    world: World,
    opened: Array<Step>,
    visited: Record<string, number>,
    finished: Record<string, any>
  ) => {
    while (opened.length > 0) {
      await searchAlgorithm(world, opened, visited, finished)

      if (params.ui?.show && params.ui?.during) {
        printWorld(world, opened, visited, finished)
        if (_.isNumber(params.ui?.wait)) {
          await new Promise((resolve) => setTimeout(resolve, params.ui!.wait ?? 100))
        }
      }
    }
    return finished.lowestCost
  }

  if (params.part1?.skip !== true) {
    part1 = await getThemPath(
      world1,
      [[0, 0, world1.length + world1[0].length, 0]],
      {},
      {
        end: [world1.length - 1, world1[0].length - 1],
        lowestCost: 10000
      }
    )
  }

  if (params.part2?.skip !== true) {
    part2 = await getThemPath(
      world2,
      [[0, 0, world2.length + world2[0].length, 0]],
      {},
      {
        end: [world2.length - 1, world2[0].length - 1],
        lowestCost: 10000
      }
    )
  }

  return { part1, part2 }
}
