import { Params } from 'aoc.d'

type Node = number | string | Array<number> | Record<string, any>
type RecordNode = Record<string, Node>

export default async (lineReader: any, params: Params) => {
  let map: RecordNode = {}
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    map = JSON.parse(line)
  }

  const solveFor = (node: Node, ignoreRed: boolean): number => {
    if (typeof node === 'number') {
      return node
    }
    if (Array.isArray(node)) {
      return (node as Array<Node>).reduce((acc: number, _node: Node) => acc + solveFor(_node, ignoreRed), 0)
    }
    if (typeof node === 'object' && !(node instanceof Array)) {
      if (ignoreRed && Object.values(node).find((v: Node) => v === 'red')) {
        return 0
      }
      return Object.keys(node).reduce((acc: number, _el: any) => acc + solveFor(node[_el], ignoreRed), 0)
    }
    return 0
  }

  if (!params.skipPart1) {
    part1 = solveFor(map, false)
  }
  if (!params.skipPart2) {
    part2 = solveFor(map, true)
  }

  return { part1, part2 }
}
