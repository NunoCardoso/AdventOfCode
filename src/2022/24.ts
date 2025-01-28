import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Dimension, Location, LocationPlus } from 'declarations'
import { leastCommonMultiple } from 'util/commons'
import { getKey, isSame } from 'util/location'
import { range } from 'util/range'

type Blizzard = LocationPlus<string>

type Data = {
  start: Location
  end: Location
  numberOfSnapshots: number
  worldDimension: Dimension
  lowestScore: number | undefined
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const printWorld = (
    worldSnapshot: Set<string>,
    worldDimension: Dimension,
    queue: Location[],
    iteration: number,
    stage: number
  ) => {
    log.info(
      '      ' +
        range(worldDimension[1])
          .map((i: number) => Math.floor(i / 100).toString())
          .join('')
    )
    log.info(
      's ' +
        stage.toString().padStart(2, '0') +
        ' ' +
        range(worldDimension[1])
          .map((i: number) => Math.floor((i % 100) / 10).toString())
          .join('')
    )
    log.info(
      'i ' +
        iteration.toString().padStart(2, '0') +
        ' ' +
        range(worldDimension[1])
          .map((i: number) => (i % 10).toString())
          .join('')
    )
    let start = '.'
    let end = '.'

    let queueLocations: Set<string> = new Set<string>()
    queue.forEach((l) => queueLocations.add(getKey(l)))

    log.info('    ' + clc.green('#') + start + clc.green('#'.repeat(worldDimension[1])))
    for (let row of range(worldDimension[0])) {
      log.info(
        ' ' +
          row.toString().padStart(2, '0') +
          ' ' +
          clc.green('#') +
          range(worldDimension[1])
            .map((column) => {
              let key = getKey([row, column])
              if (queueLocations.has(key)) return clc.blue('O')
              if (worldSnapshot.has(key)) return clc.red('░')
              return '.'
            })
            .join('') +
          clc.green('#')
      )
    }
    log.info('    ' + clc.green('#'.repeat(worldDimension[1])) + end + clc.green('#'))
  }

  // I want to write over the blizzard positions, so I can reuse on next iteration
  const generateMove = (blizzards: Blizzard[], worldDimension: Dimension): Set<string> => {
    let snapshot: Set<string> = new Set()
    for (let blizzard of blizzards) {
      if (blizzard[2] === 'v') blizzard[0] = (blizzard[0] + 1) % worldDimension[0]
      if (blizzard[2] === '^') blizzard[0] = (blizzard[0] - 1 + worldDimension[0]) % worldDimension[0]
      if (blizzard[2] === '<') blizzard[1] = (blizzard[1] - 1 + worldDimension[1]) % worldDimension[1]
      if (blizzard[2] === '>') blizzard[1] = (blizzard[1] + 1) % worldDimension[1]
      snapshot.add(getKey(blizzard))
    }
    return snapshot
  }

  const getNewLocations = (worldSnapshot: Set<string>, data: Data, location: Location): Location[] =>
    (
      [
        [location[0] + 1, location[1]],
        [location[0] - 1, location[1]],
        [location[0], location[1] + 1],
        [location[0], location[1] - 1],
        [location[0], location[1]]
      ] as Location[]
    ).filter((l) => {
      if (l[0] < 0 || l[1] < 0 || l[0] >= data.worldDimension[0] || l[1] >= data.worldDimension[1]) {
        if (!isSame(data.end, l) && !isSame(data.start, l)) return false
      }
      let key = getKey(l)
      // check if there is a blizzard, return true if it does not have
      return !worldSnapshot.has(key)
    })

  const breadthFirst = (
    worldSnapshots: Set<string>[],
    queue: Location[],
    data: Data,
    iteration: number,
    stage: number
  ): Location[] => {
    //log.debug('=== Starting === Stage', stage, 'queue', queue.length, 'iteration', iteration)
    let newQueue: Record<string, Location> = {}
    let nextSnapshot = iteration % data.numberOfSnapshots

    for (let location of queue) {
      //log.debug( 'world snapshots', worldSnapshots.length, 'nextSnapshot', nextSnapshot)
      const newLocations = getNewLocations(worldSnapshots[nextSnapshot], data, location)

      for (let newLocation of newLocations) {
        if (isSame(newLocation, data.end)) {
          log.debug('Found end')
          data.lowestScore = iteration
          return []
        }
        let key: string = getKey(newLocation)
        if (!newQueue[key]) newQueue[key] = newLocation
      }
    }

    if (params.ui?.show && params.ui?.during)
      printWorld(worldSnapshots[nextSnapshot], data.worldDimension, Object.values(newQueue), iteration, stage)

    return Object.values(newQueue)
  }

  ///////////////

  const blizzards: Blizzard[] = []
  let rowNumber = 0
  const start: Location = [-1, 0]
  const worldDimension: Dimension = [0, 0]
  let worldSnapshots: Set<string>[] = []
  let worldSnapshot: Set<string> = new Set<string>()

  for await (const line of lineReader) {
    if (worldDimension[1] === 0) worldDimension[1] = line.length - 2
    line.split('').forEach((blizzard: string, colNumber: number) => {
      if (blizzard !== '#' && blizzard !== '.') {
        blizzards.push([rowNumber - 1, colNumber - 1, blizzard])
        worldSnapshot.add(getKey([rowNumber - 1, colNumber - 1]))
      }
    })
    rowNumber++
  }

  worldSnapshots.push(worldSnapshot)
  worldDimension[0] = rowNumber - 2
  const end: Location = [worldDimension[0], worldDimension[1] - 1]
  const numberOfSnapshots = leastCommonMultiple(worldDimension[0], worldDimension[1])

  log.debug('World ', worldDimension, 'generating', numberOfSnapshots, 'moves')
  // we already did the world snapshot at time 0.
  for (let iteration of range(numberOfSnapshots - 1, 1)) worldSnapshots.push(generateMove(blizzards, worldDimension))

  log.debug('Done creating moves')

  let iteration: number = 1
  let data: Data = { start, end, numberOfSnapshots, worldDimension, lowestScore: undefined }
  let queue: Location[] = [[...data.start]]

  while (true) {
    queue = breadthFirst(worldSnapshots, queue, data, iteration, 1)
    if (data.lowestScore) {
      part1 = iteration++
      break
    } else iteration++
  }

  data = { start: end, end: start, numberOfSnapshots, worldDimension, lowestScore: undefined }
  queue = [[...data.start]]

  while (true) {
    queue = breadthFirst(worldSnapshots, queue, data, iteration, 2)
    iteration++
    if (data.lowestScore) break
  }

  data = { start, end, numberOfSnapshots, worldDimension, lowestScore: undefined }
  queue = [[...data.start]]

  while (queue.length > 0) {
    queue = breadthFirst(worldSnapshots, queue, data, iteration, 3)
    if (data.lowestScore) {
      part2 = iteration
      break
    } else iteration++
  }

  return { part1, part2 }
}
