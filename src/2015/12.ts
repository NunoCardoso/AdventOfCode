import { Params } from 'aoc.d'

// one type and one interface prevents circular reference errors
type Node = number | string | number[] | Node[] | RecordNode
interface RecordNode {
  [k: string]: Node
} //extends Record<string, Node> {}

export default async (lineReader: any, params: Params) => {
  let map: RecordNode = {}
  let part1: number = 0
  let part2: number = 0

  const solveFor = (node: Node, ignoreRed: boolean): number => {
    if (typeof node === 'number') return node
    if (typeof node === 'string') return 0
    if (Array.isArray(node))
      return (node as Node[]).reduce((acc: number, _node: Node) => acc + solveFor(_node, ignoreRed), 0)
    // object
    if (ignoreRed && Object.values(node).find((_node) => _node === 'red')) return 0
    return Object.keys(node).reduce((acc: number, _el: string) => acc + solveFor(node[_el], ignoreRed), 0)
  }

  for await (const line of lineReader) map = JSON.parse(line)

  part1 = solveFor(map, false)
  part2 = solveFor(map, true)

  return { part1, part2 }
}
