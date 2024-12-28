import * as console from 'console'
import { Params } from 'aoc.d'

export const keypadMoves: Record<string, Record<string, string>> = {
  A: { A: '', '0': '<', '1': '^<<', '2': '<^', '3': '^', '4': '^^<<', '5': '<^^', '6': '^^', '7': '^^^<<', '8': '<^^^', '9': '^^^' },
  '0': { A: '>', '0': '', '1': '^<', '2': '^', '3': '^>', '4': '^^<', '5': '^^', '6': '^^>', '7': '^^^<', '8': '^^^', '9': '^^^>' },
  '1': { A: '>>v', '0': '>v', '1': '', '2': '>', '3': '>>', '4': '^', '5': '^>', '6': '^>>', '7': '^^', '8': '^^>', '9': '^^>>' },
  '2': { A: 'v>', '0': 'v', '1': '<', '2': '', '3': '>', '4': '<^', '5': '^', '6': '^>', '7': '<^^', '8': '^^', '9': '^^>' },
  '3': { A: 'v', '0': '<v', '1': '<<', '2': '<', '3': '', '4': '<<^', '5': '<^', '6': '^', '7': '<<^^', '8': '<^^', '9': '^^' },
  '4': { A: '>>vv', '0': '>vv', '1': 'v', '2': 'v>', '3': 'v>>', '4': '', '5': '>', '6': '>>', '7': '^', '8': '^>', '9': '^>>' },
  '5': { A: 'vv>', '0': 'vv', '1': '<v', '2': 'v', '3': 'v>', '4': '<', '5': '', '6': '>', '7': '<^', '8': '^', '9': '^>' },
  '6': { A: 'vv', '0': '<vv', '1': '<<v', '2': '<v', '3': 'v', '4': '<<', '5': '<', '6': '', '7': '<<^', '8': '<^', '9': '^' },
  '7': { A: '>>vvv', '0': '>vvv', '1': 'vv', '2': 'vv>', '3': 'vv>>', '4': 'v', '5': 'v>', '6': 'v>>', '7': '', '8': '>', '9': '>>' },
  '8': { A: 'vvv>', '0': 'vvv', '1': '<vv', '2': 'vv', '3': 'vv>', '4': '<v', '5': 'v', '6': 'v>', '7': '<', '8': '', '9': '>' },
  '9': { A: 'vvv', '0': '<vvv', '1': '<<vv', '2': '<vv', '3': 'vv', '4': '<<v', '5': '<v', '6': 'v', '7': '<<', '8': '<', '9': '' }
}

export const keyboardMoves: Record<string, Record<string, string>> = {
  A: { A: '', '<': 'v<<', v: '<v', '>': 'v', '^': '<' },
  '<': { A: '>>^', '<': '', v: '>', '>': '>>', '^': '>^' },
  v: { A: '^>', '<': '<', v: '', '>': '>', '^': '^' },
  '>': { A: '^', '<': '<<', v: '<', '>': '', '^': '<^' },
  '^': { A: '>', '<': 'v<', v: 'v', '>': 'v>', '^': '' }
}

export const doKeypadMovesFor = (code: string): string[] => {
  let current: string = 'A'
  return code.split('').map((key) => {
    let moves = keypadMoves[current][key]
    current = key
    return moves + 'A'
  })
}

export const doKeyboardMovesFor = (code: string, deepness: number, cache: Record<string, number>): number => {
  let current: string = 'A'
  if (deepness === 0) return code.length
  if (cache[deepness + ',' + code]) return cache[deepness + ',' + code]
  let pieces = code.split('').reduce((acc, key) => {
    let moves = keyboardMoves[current][key]
    current = key
    return acc + doKeyboardMovesFor(moves + 'A', deepness - 1, cache)
  }, 0)
  cache[deepness + ',' + code] = pieces
  return pieces
}

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let codes: string[] = []
  for await (const line of lineReader) codes.push(line)

  const complexity = (keyboardCodeLength: number, keypadCode: string): number => keyboardCodeLength * Number(keypadCode.replaceAll('A', ''))

  const solveFor = (codes: string[], numberOfRobots: number): number =>
    codes.reduce((acc, code) => {
      let finalCodeSize: number = doKeypadMovesFor(code).reduce((acc, c) => acc + doKeyboardMovesFor(c, numberOfRobots, {}), 0)
      return acc + complexity(finalCodeSize, code)
    }, 0)

  if (!params.skipPart1) {
    part1 = solveFor(codes, params.robots.part1)
  }
  if (!params.skipPart2) {
    part2 = solveFor(codes, params.robots.part2)
  }

  return { part1, part2 }
}
