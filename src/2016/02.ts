import { Params } from 'aoc.d'
import { Location } from 'declarations'

export default async (lineReader: any, params: Params) => {
  let part1: string = ''
  let part2: string = ''

  const squareKeypad = (point: Location, instruction: string) => {
    if (instruction === 'L') point[0] = point[0] === 0 ? 0 : point[0] - 1
    else if (instruction === 'R') point[0] = point[0] === 2 ? 2 : point[0] + 1
    else if (instruction === 'U') point[1] = point[1] === 0 ? 0 : point[1] - 1
    else point[1] = point[1] === 2 ? 2 : point[1] + 1
  }

  const losangeKeypad = (point: Location, instruction: string) => {
    const length = Math.abs(point[0]) + Math.abs(point[1])
    if (instruction === 'L') point[0] = length === 2 && point[0] <= 0 ? point[0] : point[0] - 1
    else if (instruction === 'R') point[0] = length === 2 && point[0] >= 0 ? point[0] : point[0] + 1
    else if (instruction === 'U') point[1] = length === 2 && point[1] <= 0 ? point[1] : point[1] - 1
    else point[1] = length === 2 && point[1] >= 0 ? point[1] : point[1] + 1
  }

  const valueFromSquareKeypad = (point: Location): string => (point[0] + 1 + point[1] * 3).toString()

  const losangeKeyboard: Record<string, string> = {
    '0,-2': '1',
    '-1,-1': '2',
    '0,-1': '3',
    '1,-1': '4',
    '-2,0': '5',
    '-1,0': '6',
    '0,0': '7',
    '1,0': '8',
    '2,0': '9',
    '-1,1': 'A',
    '0,1': 'B',
    '1,1': 'C',
    '0,2': 'D'
  }

  const valueFromLosangeKeypad = (point: Location): string => losangeKeyboard[point.map(String).join(',')]

  const solveFor = (
    codes: string[],
    position: Location,
    keypad: (point: Location, instruction: string) => void,
    getValue: (point: Location) => string
  ): string =>
    codes
      .map((code: string) => {
        code.split('').forEach((instruction: string) => keypad(position, instruction))
        return getValue(position)
      })
      .join('')

  const codes: string[] = []
  for await (const line of lineReader) codes.push(line)

  part1 = solveFor(codes, [1, 1], squareKeypad, valueFromSquareKeypad)
  part2 = solveFor(codes, [-2, 0], losangeKeypad, valueFromLosangeKeypad)

  return { part1, part2 }
}
