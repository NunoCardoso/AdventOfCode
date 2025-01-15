import { Params } from 'aoc.d'

type Puzzle = {
  left: string[]
  right: string[]
}
// to represent the coordinates of figital number segments
type Coordinate = 'N' | 'NW' | 'NE' | 'C' | 'SW' | 'SE' | 'S'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const solvePuzzle = (piece: string, code: Record<string, Coordinate[]>): string => {
    if (piece.length === 2) return '1'
    if (piece.length === 3) return '7'
    if (piece.length === 4) return '4'
    if (piece.length === 6) {
      let missingLetter = 'abcdefg'.split('').find((l) => piece.indexOf(l) < 0)!
      if (code[missingLetter].length > 1) console.error('Code is still not unique')
      if (code[missingLetter].length === 1 && code[missingLetter][0] === 'C') return '0'
      if (code[missingLetter].length === 1 && code[missingLetter][0] === 'SW') return '9'
      //if (code[missingLetter].length === 1 && code[missingLetter][0] === 'NE')
      return '6'
    }
    if (piece.length === 5) {
      let missingCoordinates = 'abcdefg'
        .split('')
        .filter((l) => piece.indexOf(l) < 0)
        .map((letter) => code[letter])
        .flat()
        .sort()
      if (missingCoordinates[0] === 'NE' && missingCoordinates[1] === 'SW') return '5'
      if (missingCoordinates[0] === 'NW' && missingCoordinates[1] === 'SE') return '2'
      return '3'
    }
    //if (piece.length === 7)
    return '8'
  }

  const solveFor = (puzzle: Puzzle): string[] => {
    // I will filter as soon as I get more info
    let code: Record<string, Coordinate[]> = {
      a: ['N', 'NW', 'NE', 'C', 'SW', 'SE', 'S'],
      b: ['N', 'NW', 'NE', 'C', 'SW', 'SE', 'S'],
      c: ['N', 'NW', 'NE', 'C', 'SW', 'SE', 'S'],
      d: ['N', 'NW', 'NE', 'C', 'SW', 'SE', 'S'],
      e: ['N', 'NW', 'NE', 'C', 'SW', 'SE', 'S'],
      f: ['N', 'NW', 'NE', 'C', 'SW', 'SE', 'S'],
      g: ['N', 'NW', 'NE', 'C', 'SW', 'SE', 'S'],
      h: ['N', 'NW', 'NE', 'C', 'SW', 'SE', 'S']
    }

    // fit pieces into slots by size
    let pieceByLength: string[][] = new Array(8).fill(null).map(() => [])
    puzzle.left.forEach((piece) => pieceByLength[piece.length].push(piece))

    // Use '1' to filter invalid coordinates
    if (pieceByLength[2]) {
      let letters = pieceByLength[2][0].split('')
      Object.keys(code).forEach((key) => {
        code[key] = code[key].filter((c) =>
          letters.includes(key) ? c === 'NE' || c === 'SE' : !(c === 'NE' || c === 'SE')
        )
      })
    }

    // use '7' to filter invalid coordinates
    if (pieceByLength[3]) {
      let letters = pieceByLength[3][0].split('')
      Object.keys(code).forEach((key) => {
        code[key] = code[key].filter((c) =>
          letters.includes(key) ? c === 'NE' || c === 'SE' || c === 'N' : !(c === 'NE' || c === 'SE' || c === 'N')
        )
      })
    }

    // use '4' to filter invalid coordinates
    if (pieceByLength[4]) {
      let letters = pieceByLength[4][0].split('')
      Object.keys(code).forEach((key) => {
        code[key] = code[key].filter((c) =>
          letters.includes(key)
            ? c === 'NE' || c === 'SE' || c === 'C' || c === 'NW'
            : !(c === 'NE' || c === 'SE' || c === 'C' || c === 'NW')
        )
      })
    }

    // now, for numbers with 6 coordinates, it is easier to see where coordinate is off
    // for number 6, NE must be off.
    // for number 0, C must be off
    // for number 9, SW must be off

    // if number is for example edbfga, where c is missing, and c is ["NW","C"],
    // then NW cannot be assigned to 'c'. 'c' can only be one of these: [NE, C, SW]

    if (pieceByLength[6]) {
      // since we have different numbers with 6 coordinates, we will walk them
      for (let pieceletter of pieceByLength[6]) {
        let letterMissing = 'abcdefg'.split('').find((l) => pieceletter.indexOf(l) < 0)!

        if (code[letterMissing].length > 1) {
          let invalidCoordinates = code[letterMissing].filter((c) => !['NE', 'C', 'SW'].includes(c))
          code[letterMissing] = code[letterMissing].filter((c) => !invalidCoordinates.includes(c))
        }
        // if we managed to narrow missing letter as one coordinate,
        // then remove that coordinate from other options
        if (code[letterMissing].length === 1) {
          let foundCoordinate: Coordinate = code[letterMissing][0]
          Object.keys(code).forEach((key) => {
            if (key !== letterMissing) code[key] = code[key].filter((c) => c !== foundCoordinate)
          })
        }
      }
    }

    Object.values(code).forEach((v) => {
      if (v.length !== 1) console.error('Code is not ready', code)
    })

    log.debug('Puzzle', JSON.stringify(puzzle), 'code', JSON.stringify(code))

    return puzzle.right.map((s: string) => solvePuzzle(s, code))
  }

  const puzzles: Puzzle[] = []

  for await (const line of lineReader) {
    const m = line.trim().split(/\s+/)
    puzzles.push({
      left: m.slice(0, 10),
      right: m.slice(-4)
    })
  }

  const solutionsPart1: number[] = []
  const solutionsPart2: number[] = []

  puzzles.forEach((puzzle: Puzzle) => {
    const rightCode: string[] = solveFor(puzzle)
    solutionsPart1.push(rightCode.filter((x) => ['1', '4', '7', '8'].includes(x)).length)
    solutionsPart2.push(Number(rightCode.join('')))
  })

  const part1 = solutionsPart1.reduce((x, y) => x + y, 0)
  const part2 = solutionsPart2.reduce((x, y) => x + y, 0)

  return { part1, part2 }
}
