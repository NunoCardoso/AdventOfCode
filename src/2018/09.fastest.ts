import { Params } from 'aoc.d'

type ID = number
type Node = { e: number; p: ID | null; n: ID | null }

export class MapBasedLinkedList<T> {
  cursor: ID | null
  map: Record<ID, Node>

  constructor() {
    this.map = {}
    this.cursor = null
  }

  addAtCursor(element: number) {
    if (this.cursor == null) {
      this.map[element] = { e: element, p: element, n: element }
    } else {
      let leftNodeCursor = this.cursor
      let leftnode = this.map[leftNodeCursor!]!
      let rightNodeCursor = leftnode.n
      let rightnode = this.map[rightNodeCursor!]!
      this.map[element] = { e: element, p: rightnode.p, n: leftnode.n }
      this.map[leftNodeCursor!].n = element
      this.map[rightNodeCursor!].p = element
    }
    this.cursor = element
  }

  getAtCursor() {
    return this.map[this.cursor!]!.e
  }

  // removed at the current cursor
  removeAtCursor() {
    let nodeToRemove = this.map[this.cursor!]!
    let leftNodeCursor = nodeToRemove.p
    let rightNodeCursor = nodeToRemove.n
    delete this.map[this.cursor!]
    this.map[leftNodeCursor!].n = rightNodeCursor
    this.map[rightNodeCursor!].p = leftNodeCursor
    this.cursor = rightNodeCursor
    return nodeToRemove.e
  }

  moveCursorRight(steps: number) {
    for (let i = 0; i < steps; i++) {
      this.cursor = this.map[this.cursor!].n
    }
  }

  moveCursorLeft(steps: number) {
    for (let i = 0; i < steps; i++) {
      this.cursor = this.map[this.cursor!].p
    }
  }

  toArray() {
    let thisCursor = this.cursor!
    let arr: number[] = []
    do {
      let node = this.map[thisCursor]!
      arr.push(node.e)
      thisCursor = node.n!
    } while (thisCursor !== this.cursor!)
    return arr
  }
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let players: number = 0
  let points: number = 0

  for await (const line of lineReader) {
    ;[, players, points] = line.match(/(\d+) players; last marble is worth (\d+) points/).map(Number)
  }

  const solveFor = (players: number, points: number): number => {
    let scores: Record<number, number> = {}
    let marbles = new MapBasedLinkedList()
    marbles.addAtCursor(0)
    let currentPlayer = 1

    let marble = 1
    while (marble <= points) {
      if (marble % 23 === 0) {
        scores[currentPlayer] = (scores[currentPlayer] ?? 0) + marble
        marbles.moveCursorLeft(7)
        scores[currentPlayer] += marbles.removeAtCursor()!
      } else {
        marbles.moveCursorRight(1)
        marbles.addAtCursor(marble)
      }
      currentPlayer = (currentPlayer + 1) % players
      marble++
    }
    return Object.values(scores).sort((a, b) => b - a)[0]
  }

  if (!params.skipPart1) {
    part1 = solveFor(players, points)
  }
  if (!params.skipPart2) {
    part2 = solveFor(players, points * 100)
  }

  return { part1, part2 }
}
