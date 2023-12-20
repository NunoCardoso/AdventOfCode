import { Params } from 'aoc.d'
import { Dimension, World } from 'declarations'

type PointAndDirection = [number, number, string]
type Beam = Array<PointAndDirection>
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const world: World<string> = []

  for await (const line of lineReader) {
    world.push(line.split(''))
  }
  const worldDimensions: Dimension = [world.length, world[0].length]

  const getKey = (pad: PointAndDirection) => pad[0] + ';' + pad[1] + ';' + pad[2]

  const outOfBounds = (pad: PointAndDirection): boolean =>
    pad[0] < 0 || pad[0] >= worldDimensions[0] || pad[1] < 0 || pad[1] >= worldDimensions[1]

  const notInTail = (beam: Beam, nextHead: PointAndDirection) =>
    beam.find((b) => b[0] === nextHead[0] && b[1] === nextHead[1] && b[2] === nextHead[2]) === undefined
  const getNextHead = (pad: PointAndDirection, direction: string): PointAndDirection => {
    if (direction === '>') return [pad[0], pad[1] + 1, direction]
    if (direction === '<') return [pad[0], pad[1] - 1, direction]
    if (direction === '^') return [pad[0] - 1, pad[1], direction]
    return [pad[0] + 1, pad[1], direction]
  }

  const getNextPads = (tail: Beam, head: PointAndDirection): Array<PointAndDirection> => {
    const nextHeads: Array<PointAndDirection> = []
    const mirror: string = world[head[0]][head[1]]
    let nextHead: PointAndDirection
    let newDirection: Record<string, string>
    // log.debug('getNextBeams: head',head)
    switch (mirror) {
      case '.':
        nextHead = getNextHead(head, head[2])
        if (!outOfBounds(nextHead) && notInTail(tail, nextHead)) nextHeads.push(nextHead)
        break
      case '/':
        newDirection = { '>': '^', '^': '>', v: '<', '<': 'v' }
        nextHead = getNextHead(head, newDirection[head[2]])
        if (!outOfBounds(nextHead) && notInTail(tail, nextHead)) nextHeads.push(nextHead)
        break
      case '\\':
        newDirection = { '>': 'v', v: '>', '^': '<', '<': '^' }
        nextHead = getNextHead(head, newDirection[head[2]])
        if (!outOfBounds(nextHead) && notInTail(tail, nextHead)) nextHeads.push(nextHead)
        break
      case '-':
        if (['>', '<'].includes(head[2])) {
          nextHead = getNextHead(head, head[2])
          if (!outOfBounds(nextHead) && notInTail(tail, nextHead)) nextHeads.push(nextHead)
        } else {
          nextHead = getNextHead(head, '<')
          if (!outOfBounds(nextHead) && notInTail(tail, nextHead)) nextHeads.push(nextHead)
          nextHead = getNextHead(head, '>')
          if (!outOfBounds(nextHead) && notInTail(tail, nextHead)) nextHeads.push(nextHead)
        }
        break
      case '|':
        if (['^', 'v'].includes(head[2])) {
          nextHead = getNextHead(head, head[2])
          if (!outOfBounds(nextHead) && notInTail(tail, nextHead)) nextHeads.push(nextHead)
        } else {
          nextHead = getNextHead(head, '^')
          if (!outOfBounds(nextHead) && notInTail(tail, nextHead)) nextHeads.push(nextHead)
          nextHead = getNextHead(head, 'v')
          if (!outOfBounds(nextHead) && notInTail(tail, nextHead)) nextHeads.push(nextHead)
        }
        break
    }
    // log.debug('getNextBeams: nextBeams',nextBeams)
    return nextHeads
  }
  const depthFirst = (subbeam: Beam, beam: Beam, visited: Map<string, Beam>): Beam => {
    const head: PointAndDirection = subbeam[subbeam.length - 1]
    log.debug('start', head, 'subbeam', subbeam, 'beam', beam)
    log.debug('= = = = =')

    const key = getKey(head)
    // cached: return the subbeam, continue search
    if (visited.has(key)) {
      const cachedBeam = visited.get(key)!
      log.debug('hit cache for key', key, 'returned', cachedBeam)
      return depthFirst([cachedBeam[cachedBeam.length - 1]], beam.concat(cachedBeam), visited)
    }

    // keep digging
    const nextHeads: Array<PointAndDirection> = getNextPads(beam, head)
    log.debug('next heads', nextHeads)
    if (nextHeads.length === 0) {
      // end of the line, cache it, mark it as ending one
      const key = getKey(subbeam[0])
      visited.set(key, subbeam)
      beam.push(head)
      log.debug('no nextHeads, caching key ', key, 'with subbeam', subbeam, 'and returning beam', beam)
      return beam
    } else if (nextHeads.length === 1) {
      log.debug('1 nextHeads, keep digging')
      return depthFirst(subbeam.concat([nextHeads[0]]), beam.concat([nextHeads[0]]), visited)
    } else {
      log.debug('2 next heads, caching with key', getKey(subbeam[0]), 'the subbeam', subbeam)
      visited.set(getKey(subbeam[0]), subbeam)

      log.debug('2 next heads: fetching left with', [nextHeads[0]])
      const _beam = depthFirst([nextHeads[0]], beam.concat([nextHeads[0]]), visited)
      log.debug('2 next heads: fetching right with', [nextHeads[1]])

      const _beam2 = depthFirst([nextHeads[1]], _beam.concat([nextHeads[1]]), visited)
      log.debug('2 next heads finished, wrapping', [nextHeads[1]], 'with', _beam2)

      return _beam2
    }
  }

  const scoreCache: Map<string, Beam> = new Map()

  if (!params.skipPart1) {
    const beam: Beam = depthFirst([[0, 0, '>']], [[0, 0, '>']], scoreCache)
    part1 = new Set(beam.map((pad) => pad[0] + ';' + pad[1])).size
  }

  // keep scoreCache, same world
  if (!params.skipPart2) {
    const opened: Array<Beam> = []
    for (let row = 0; row < worldDimensions[0]; row++) {
      opened.push([[row, 0, '>']])
      opened.push([[row, worldDimensions[1] - 1, '<']])
    }
    for (let column = 0; column < worldDimensions[1]; column++) {
      opened.push([[0, column, 'v']])
      opened.push([[worldDimensions[0] - 1, column, '^']])
    }

    while (opened.length > 0) {
      let beam = opened.splice(-1)[0]
      beam = depthFirst(beam, beam.slice(), new Map())
      const partSum2 = new Set(beam.map((pad) => pad[0] + ';' + pad[1])).size
      if (partSum2 > part2) part2 = partSum2
    }
  }

  return { part1, part2 }
}
