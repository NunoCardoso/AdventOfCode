import { Params } from 'aoc.d'
import { get, set } from 'lodash'

type Tree = {
  children: Tree[]
  metadata: number[]
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let values: number[] = []

  let tree: Tree

  const parseValues = (values: number[]): Tree => {
    let i = 0
    let expectedMetadata: Record<string, number> = {}
    let currentCursor: string[] = []
    let tree: Tree = { children: [], metadata: [] }

    while (i < values.length) {
      let cursor = currentCursor?.join('.') ?? ''

      if (typeof expectedMetadata[cursor] === 'number') {
        // collect metadata
        set(tree, currentCursor.concat('metadata').join('.'), values.slice(i, i + expectedMetadata[cursor]))
        i += expectedMetadata[cursor]

        // move the cursor
        if (currentCursor.length > 1) {
          let childIndex = currentCursor.pop()!
          // see the array size to see if we are in the last child
          // if we are, collect metadata and go up again
          if (get(tree, currentCursor.join('.')).length === +childIndex + 1) {
            currentCursor.pop()
          } else {
            // if not, move to sibling
            currentCursor.push((+childIndex + 1).toString())
          }
        }
        continue
      }

      let childCount = values[i]
      expectedMetadata[cursor] = values[i + 1]
      i += 2
      // allocate children, set cursor to first children
      if (childCount !== 0) {
        currentCursor.push('children')
        set(tree, currentCursor.join('.'), new Array(childCount).fill(null))
        currentCursor.push('0')
      }
    }
    return tree
  }

  for await (const line of lineReader) {
    values = line.split(/\s+/).map(Number)
    tree = parseValues(values)
  }

  log.debug(JSON.stringify(tree!))

  const sumMetadata = (tree: Tree): number =>
    (tree.metadata?.reduce((a, b) => a + b, 0) ?? 0) + (tree.children?.reduce((a, b) => a + sumMetadata(b), 0) ?? 0)

  const sumIndexes = (tree: Tree): number => {
    if (!tree.children) {
      return tree.metadata.reduce((a, b) => a + b, 0)
    }
    return tree.metadata.reduce((a, b) => {
      let index = b - 1
      if (!!tree.children && index < tree.children?.length) {
        return a + sumIndexes(tree.children[index])
      }
      return a
    }, 0)
  }

  if (!params.skipPart1) {
    part1 = sumMetadata(tree!)
  }
  if (!params.skipPart2) {
    part2 = sumIndexes(tree!)
  }

  return { part1, part2 }
}
