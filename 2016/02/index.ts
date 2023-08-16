import { Params } from '../../aoc.d'

export default async (lineReader: any, params: Params) => {
  type Point = [number, number]

  let part1: string = '',
    part2: string = ''

  const codes: Array<string> = []
  for await (const line of lineReader) {
    codes.push(line)
  }

  const squareKeypad = (point: Point, instruction: string) => {
    switch (instruction) {
      case 'L':
        point[0] = point[0] === 0 ? 0 : point[0] - 1
        break
      case 'R':
        point[0] = point[0] === 2 ? 2 : point[0] + 1
        break
      case 'U':
        point[1] = point[1] === 0 ? 0 : point[1] - 1
        break
      case 'D':
        point[1] = point[1] === 2 ? 2 : point[1] + 1
        break
      default:
        break
    }
  }

  const losangeKeypad = (point: Point, instruction: string) => {
    const length = Math.abs(point[0]) + Math.abs(point[1])
    switch (instruction) {
      case 'L':
        point[0] = length === 2 && point[0] <= 0 ? point[0] : point[0] - 1
        break
      case 'R':
        point[0] = length === 2 && point[0] >= 0 ? point[0] : point[0] + 1
        break
      case 'U':
        point[1] = length === 2 && point[1] <= 0 ? point[1] : point[1] - 1
        break
      case 'D':
        point[1] = length === 2 && point[1] >= 0 ? point[1] : point[1] + 1
        break
      default:
        break
    }
  }

  const valueFromSquareKeypad = (point: Point): string => (point[0] + 1 + point[1] * 3).toString()

  const valueFromLosangeKeypad = (point: Point): string => {
    const values: Record<string, string> = {
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

    return values[point.map((x) => x.toString()).join(',')]
  }

  const runKeypad = (
    codes: Array<string>,
    pos: Point,
    keypad: (point: Point, instruction: string) => void,
    getvalue: (point: Point) => string
  ): string => {
    const finalCode: Array<string> = []
    const position: Point = pos
    codes.forEach((code: string) => {
      const instructions = code.split('')
      instructions.forEach((instruction: string) => keypad(position, instruction))
      finalCode.push(getvalue(position))
    })
    return finalCode.join('')
  }

  part1 = runKeypad(codes, [1, 1], squareKeypad, valueFromSquareKeypad)
  part2 = runKeypad(codes, [-2, 0], losangeKeypad, valueFromLosangeKeypad)

  return {
    part1,
    part2
  }
}
