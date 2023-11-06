import { Params } from '../../aoc.d'

type Digit = {
  source: string
  answer?: Array<number>
}

type Puzzle = {
  left: Array<Digit>
  right: Array<Digit>
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const data: Array<Puzzle> = []

  for await (const line of lineReader) {
    const m = line.trim().split(/\s+/)
    data.push({
      left: m.slice(0, 10).map((s: string) => ({ source: s })),
      right: m.slice(-4).map((s: string) => ({ source: s }))
    })
  }

  const coordEquals = (a: Array<string>, b: Array<string>) => a.sort().join('.') === b.sort().join('.')

  const makeNumber = (source: Array<string>, permutation: Array<string>): number | undefined => {
    // source is like ['b', 'e'], I can convert to ['NW', 'NE']
    // positions are permutated, indexes for segment letters are from 0 to 7
    const coords = source.map((s) => permutation['abcdefg'.indexOf(s)]).sort()
    if (coords.length === 2) {
      if (coordEquals(coords, ['NE', 'SE'])) {
        return 1
      } else {
        // not possible
        return undefined
      }
    }
    if (coords.length === 3) {
      if (coordEquals(coords, ['N', 'NE', 'SE'])) {
        return 7
      } else {
        // not possible
        return undefined
      }
    }

    if (coords.length === 4) {
      if (coordEquals(coords, ['C', 'NE', 'NW', 'SE'])) {
        return 4
      } else {
        // not possible
        return undefined
      }
    }
    if (coords.length === 5) {
      if (coordEquals(coords, ['C', 'N', 'NE', 'S', 'SW'])) {
        return 2
      }
      if (coordEquals(coords, ['C', 'N', 'NE', 'S', 'SE'])) {
        return 3
      }
      if (coordEquals(coords, ['C', 'N', 'NW', 'S', 'SE'])) {
        return 5
      }
      return undefined
    }
    if (coords.length === 6) {
      if (coordEquals(coords, ['C', 'N', 'NW', 'S', 'SE', 'SW'])) {
        return 6
      }
      if (coordEquals(coords, ['N', 'NE', 'NW', 'S', 'SE', 'SW'])) {
        return 0
      }
      if (coordEquals(coords, ['C', 'N', 'NE', 'NW', 'S', 'SE'])) {
        return 9
      }
      return undefined
    }
    if (coords.length === 7) {
      return 8
    }
    return undefined
  }

  const permutation = <T>(array: Array<T>): Array<Array<T>> => {
    const p = (array: Array<T>, temp: Array<T>) => {
      let i, x
      if (!array.length) {
        result.push(temp)
      }
      for (i = 0; i < array.length; i++) {
        x = array.splice(i, 1)[0]
        p(array, temp.concat(x))
        array.splice(i, 0, x)
      }
    }
    const result: Array<Array<T>> = []
    p(array, [])
    return result
  }

  const solutions: Array<string> = []

  data.forEach((line: Puzzle) => {
    let validPermutation: Array<string> | undefined
    let leftCode: Array<number> | undefined
    const permutations: Array<Array<string>> = permutation<string>(['N', 'NW', 'NE', 'C', 'SW', 'SE', 'S'])

    permutations: for (let x = 0; x < permutations.length; x++) {
      leftCode = []
      for (let i = 0; i < line.left.length; i++) {
        const possibleNumber: number | undefined = makeNumber(line.left[i].source.split(''), permutations[x])

        if (possibleNumber === undefined) {
          continue permutations
        }
        leftCode.push(possibleNumber)
      }
      if (leftCode.length === line.left.length) {
        validPermutation = permutations[x]
        break
      }
    }

    if (!validPermutation) {
      console.error('no valid permutation')
      return
    }

    const rightCode: Array<number> = []
    for (i = 0; i < line.right.length; i++) {
      const possibleNumber: number | undefined = makeNumber(line.right[i].source.split(''), validPermutation)
      if (possibleNumber !== undefined) {
        rightCode.push(possibleNumber)
      }
    }

    solutions.push(rightCode.join(''))
    log.debug(
      'valid permutation',
      validPermutation.join(','),
      'left code',
      leftCode?.join(''),
      'right code',
      rightCode.join('')
    )
  })

  const part1 = solutions.reduce((x, y) => {
    return x + y.split('').filter((x) => ['1', '4', '7', '8'].includes(x)).length
  }, 0)

  const part2 = solutions.reduce((x, y) => {
    return x + parseInt(y)
  }, 0)

  return {
    part1,
    part2
  }
}
