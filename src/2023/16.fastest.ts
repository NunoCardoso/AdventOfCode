import { Params } from 'aoc.d'
import { LocationPlus, World } from 'declarations'
import { range } from 'util/range'

type Beam = LocationPlus<string>[]
// serialized version
type SerialBeam = string[]
type Cache = Map<string, string[]>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getKeyWithDirection = (location: LocationPlus<string>): string =>
    location[0] + ',' + location[1] + ',' + location[2]

  const fromKeyWithDirection = (serialLocation: string): LocationPlus<string> =>
    serialLocation.split(',').map((item, index) => (index === 2 ? item : +item)) as LocationPlus<string>

  const getJustDirection = (serializedLocation: string): string => serializedLocation.split(',').slice(0, 2).join(',')

  const outOfBounds = (location: LocationPlus<string>, cavern: World<string>): boolean =>
    location[0] < 0 || location[0] >= cavern.length || location[1] < 0 || location[1] >= cavern[0].length

  const getUniquePath = (serialBeam: string[]): Set<string> => new Set<string>(serialBeam.map(getJustDirection))

  const getNextHead = (head: LocationPlus<string>): LocationPlus<string> => {
    if (head[2] === '>') return [head[0], head[1] + 1, head[2]]
    if (head[2] === '<') return [head[0], head[1] - 1, head[2]]
    if (head[2] === '^') return [head[0] - 1, head[1], head[2]]
    return [head[0] + 1, head[1], head[2]]
  }

  // returns a full tail, optional split heads if path continues
  const getNewBeams = (cavern: World<string>, head: LocationPlus<string>): [string[], LocationPlus<string>[]] => {
    let heads: LocationPlus<string>[] = []
    const tail: string[] = [head.join(',')]
    // log.debug('getNewBeams for', head)
    let newHead: LocationPlus<string> = getNextHead(head)
    while (true) {
      if (outOfBounds(newHead, cavern)) break
      tail.push(newHead.join(','))
      let mirror = cavern[newHead[0]][newHead[1]]
      if (mirror === '-' && ['^', 'v'].includes(newHead[2])) {
        heads = [
          [newHead[0], newHead[1], '<'],
          [newHead[0], newHead[1], '>']
        ]
        break
      }
      if (mirror === '|' && ['<', '>'].includes(newHead[2])) {
        heads = [
          [newHead[0], newHead[1], '^'],
          [newHead[0], newHead[1], 'v']
        ]
        break
      }
      if (mirror === '/') {
        let newDirection: Record<string, string> = { '>': '^', '^': '>', v: '<', '<': 'v' }
        newHead[2] = newDirection[newHead[2]]
      }
      if (mirror === '\\') {
        let newDirection: Record<string, string> = { '>': 'v', v: '>', '^': '<', '<': '^' }
        newHead[2] = newDirection[newHead[2]]
      }
      newHead = getNextHead(newHead)
    }
    return [tail, heads]
  }

  const depthFirst = (cavern: World<string>, head: LocationPlus<string>, tail: string[], cache: Cache): string[] => {
    log.debug('depthFirst: start, head', head, 'tail', JSON.stringify(tail))

    let headKey: string = getKeyWithDirection(head)

    // first, check if we are not in a tail
    if (tail.includes(headKey)) {
      log.debug('depthFirst: Got hit on tail for', headKey, 'returning empty', [])
      return []
    }

    // second, check if we already know this path
    if (cache.has(headKey)) {
      log.debug('depthFirst: Got cache hit on', headKey, 'returning ', cache.get(headKey))
      return cache.get(headKey)!
    }

    // keep digging until we find:
    //  - the end or the tail (1 entry)
    //  - one split (2 entries)
    const [newTail, newHeads] = getNewBeams(cavern, head)
    log.debug(
      'depthFirst: new beams for',
      head,
      'new tail',
      JSON.stringify(newTail),
      'new heads',
      JSON.stringify(newHeads)
    )

    if (newHeads.length === 0) {
      log.debug('depthFirst: 1: returning newTail', JSON.stringify(newTail))
      return newTail
    }

    tail = tail.concat(newTail)

    let beams: string[][] = newHeads.map((head) => {
      log.debug('depthFirst: 2: going deep for head', head)
      let beam = depthFirst(cavern, head, tail, cache)
      let key = getKeyWithDirection(head)

      if (cache.has(key)) {
        log.debug('depthFirst: 2: key already in cache', head.join(','), 'skipping')
      } else {
        if (beam.length === 0) {
          beam = tail.slice(tail.indexOf(key), tail.length)
          log.debug('depthFirst: 2: suspecting tail, adding to cache the loop part', JSON.stringify(beam))
        }
        log.debug('depthFirst: 2: adding beam to cache', head.join(','), JSON.stringify(beam))
        cache.set(key, beam)
      }
      return beam
    })

    let partBeam = [...new Set(beams[0].concat(beams[1]))]
    log.debug('depthFirst: 2: adding fork to cache', headKey, JSON.stringify(partBeam))
    cache.set(headKey, partBeam)

    let beam = [...new Set(partBeam.concat(tail))]
    log.debug('depthFirst: 2: returning beam', JSON.stringify(beam))
    return beam
  }

  const cavern: World<string> = []
  for await (const line of lineReader) cavern.push(line.split(''))

  const cache: Cache = new Map()

  // do the | edges | of the world.
  let start: LocationPlus<string>
  let serialBeam: string[]
  let path: Set<string>

  for (let row of range(cavern.length)) {
    start = [row, 0, '>']
    serialBeam = depthFirst(cavern, start, [], cache)
    if (row === 0) {
      path = getUniquePath(serialBeam)
      part1 = path.size
      part2 = path.size
    }
    start = [row, cavern[0].length - 1, '<']
    log.info('doing', start, part1, part2)
    serialBeam = depthFirst(cavern, start, [], cache)
    path = getUniquePath(serialBeam)
    if (path.size > part2) {
      log.debug('Got better path.size', path.size, 'at', start, [...path])
      part2 = path.size
    }
  }
  for (let col of range(cavern[0].length)) {
    start = [0, col, 'v']
    log.info('doing', start, part1, part2)
    serialBeam = depthFirst(cavern, start, [], cache)
    path = getUniquePath(serialBeam)
    if (path.size > part2) {
      log.debug('Got better path.size', path.size, 'at', start, [...path])
      part2 = path.size
    }

    start = [cavern.length - 1, col, '^']
    log.info('doing', start, part1, part2)

    serialBeam = depthFirst(cavern, start, [], cache)
    path = getUniquePath(serialBeam)
    if (path.size > part2) {
      log.debug('Got better path.size', path.size, 'at', start, [...path])
      part2 = path.size
    }
  }

  return { part1, part2 }
}
