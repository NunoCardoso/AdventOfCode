import * as console from 'console'
import { Params } from 'aoc.d'

export const keypadCheat: Record<string, Record<string, string>> = {
  A: { A: '', '0': '<', '1': '<<^', '2': '<^', '3': '^', '4': '<<^^', '5': '<^^', '6': '^^', '7': '<<^^^', '8': '<^^^', '9': '^^^' },
  '0': { A: '>', '0': '', '1': '<^', '2': '^', '3': '^>', '4': '<^^', '5': '^^', '6': '^^>', '7': '<^^^', '8': '^^^', '9': '^^^>' },
  '1': { A: 'v>>', '0': 'v>', '1': '', '2': '>', '3': '>>', '4': '^', '5': '^>', '6': '^>>', '7': '^^', '8': '^^>', '9': '^^>>' },
  '2': { A: 'v>', '0': 'v', '1': '<', '2': '', '3': '>', '4': '<^', '5': '^', '6': '^>', '7': '<^^', '8': '^^', '9': '^^>' },
  '3': { A: 'v', '0': '<v', '1': '<<', '2': '<', '3': '', '4': '<<^', '5': '<^', '6': '^', '7': '<<^^', '8': '<^^', '9': '^^' },
  '4': { A: 'vv>>', '0': 'vv>', '1': 'v', '2': 'v>', '3': 'v>>', '4': '', '5': '>', '6': '>>', '7': '^', '8': '^>', '9': '^>>' },
  '5': { A: 'vv>', '0': 'vv', '1': '<v', '2': 'v', '3': 'v>', '4': '<', '5': '', '6': '>', '7': '<^', '8': '^', '9': '^>' },
  '6': { A: 'vv', '0': '<vv', '1': '<<v', '2': '<v', '3': 'v', '4': '<<', '5': '<', '6': '', '7': '<<^', '8': '<^', '9': '^' },
  '7': { A: 'vvv>>', '0': 'vvv>', '1': 'vv', '2': 'vv>', '3': 'vv>>', '4': 'v', '5': 'v>', '6': 'v>>', '7': '', '8': '>', '9': '>>' },
  '8': { A: 'vvv>', '0': 'vvv', '1': '<vv', '2': 'vv', '3': 'vv>', '4': '<v', '5': 'v', '6': 'v>', '7': '<', '8': '', '9': '>' },
  '9': { A: 'vvv', '0': '<vvv', '1': '<<vv', '2': '<vv', '3': 'vv', '4': '<<v', '5': '<v', '6': 'v', '7': '<<', '8': '<', '9': '' }
}

export const keyboardCheat: Record<string, Record<string, string>> = {
  A: { A: '', '<': 'v<<', v: 'v<', '>': 'v', '^': '<' },
  '<': { A: '>>^', '<': '', v: '>', '>': '>>', '^': '>^' },
  v: { A: '>^', '<': '<', v: '', '>': '>', '^': '^' },
  '>': { A: '^', '<': '<<', v: '<', '>': '', '^': '<^' },
  '^': { A: '>', '<': 'v<', v: 'v', '>': 'v>', '^': '' }
}

export const doKeypadMovesFor = (code: string): string => {
  let current: string = 'A'
  return code.split('').reduce((acc, key) => {
    let x = keypadCheat[current][key]
    current = key
    return acc + x + 'A'
  }, '')
}

export const doKeyboardMovesFor = (code: string): string => {
  let current: string = 'A'
  console.log(code)
  return code.split('').reduce((acc, key) => {
    let x = keyboardCheat[current][key]
    current = key
    return acc + x + 'A'
  }, '')
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let codes: string[] = []
  for await (const line of lineReader) codes.push(line)

  const complexity = (code3: string, code: string): number => {
    let codeNumber = Number(code.replaceAll('A', ''))
    console.log('complexity', code3, code, codeNumber, code3.length, code3.length * codeNumber)
    return code3.length * codeNumber
  }

  const optimizeCode = (code: string): string => code.replaceAll(/?v<A/g, '<vA').replaceAll('^<A', '<^A').replaceAll('>vA', 'v>A')

  const solveFor = (codes: string[]): number =>
    codes.reduce((acc, code) => {
      let code1 = doKeypadMovesFor(code)
      let code2 = doKeyboardMovesFor(code1)
      code2 = optimizeCode(code2)
      let code3 = doKeyboardMovesFor(code2)
      // code3 = optimizeCode(code3)
      console.log('code', code, 'code1', code1, 'code2', code2, 'code3', code3, 'complexity', complexity(code3, code))
      return acc + complexity(code3, code)
      // return 1
    }, 0)

  if (!params.skipPart1) {
    part1 = solveFor(codes)
  }
  if (!params.skipPart2) {
    part2 = solveFor(codes)
  }

  return { part1, part2 }
}
