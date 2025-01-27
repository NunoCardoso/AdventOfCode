import { Params } from 'aoc.d'

type Monkeys = Record<string, number | string[]>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const resolve = (monkeys: Monkeys, monkey: string): number => {
    if (typeof monkeys[monkey] === 'number') return monkeys[monkey]
    const src1 = resolve(monkeys, monkeys[monkey][1])
    const src2 = resolve(monkeys, monkeys[monkey][2])
    if ((monkeys[monkey] as string[])[0] === '/') monkeys[monkey] = src1 / src2
    if ((monkeys[monkey] as string[])[0] === '*') monkeys[monkey] = src1 * src2
    if ((monkeys[monkey] as string[])[0] === '+') monkeys[monkey] = src1 + src2
    if ((monkeys[monkey] as string[])[0] === '-') monkeys[monkey] = src1 - src2
    return monkeys[monkey] as number
  }

  const findPathToHuman = (monkey: string, monkeys: Monkeys): string[] | undefined => {
    let opened: string[][] = [[monkey]]
    let path: string[] | undefined = undefined
    while (opened.length > 0 && path === undefined) {
      let _path: string[] = opened.pop()!
      let _head = _path[_path.length - 1]
      let res = monkeys[_head]
      if (typeof res !== 'number') {
        if (res[1] === 'humn') path = _path
        if (res[2] === 'humn') path = _path
        opened.push([..._path, res[1]])
        opened.push([..._path, res[2]])
      }
    }
    return path
  }

  const reverseResolveFor = (monkeys: Monkeys, targetValue: number, path: string[]): number => {
    let currentValue = targetValue

    if (path.length === 1) {
      let [op, monkey1, monkey2] = monkeys[path.shift()!] as string[]
      if (monkey1 === 'humn') {
        // targetValue: {humn} + monkey2 => {humn}: monkey2 - targetValue
        if (op === '+') return resolve(monkeys, monkey2) - currentValue
        // targetValue: {humn} - monkey2 => {humn}: monkey2 + targetValue
        if (op === '-') return resolve(monkeys, monkey2) + currentValue
        // targetValue: {humn} * monkey2 => {humn}: targetValue / monkey2
        if (op === '*') return currentValue / resolve(monkeys, monkey2)
        // targetValue: {humn} / monkey2 => {humn}: targetValue * monkey2
        if (op === '/') return currentValue * resolve(monkeys, monkey2)
      }
      if (monkey2 === 'humn') {
        // targetValue: monkey1 + {humn} => humn: targetValue - monkey1
        if (op === '+') return currentValue - resolve(monkeys, monkey1)
        // targetValue: monkey1 - {humn} => {humn}: monkey1 - targetValue
        if (op === '-') return resolve(monkeys, monkey1) - currentValue
        // targetValue: monkey1 * {humn} => humn: targetValue / monkey1
        if (op === '*') return currentValue / resolve(monkeys, monkey1)
        // targetValue: monkey1 / {humn} => humn: targetValue * monkey1
        if (op === '/') return currentValue * resolve(monkeys, monkey1)
      }
    }

    let [op, monkey1, monkey2] = monkeys[path.shift()!] as string[]
    // if monkey is in path, it is unsolvable (we do not want to use the humn value there)
    // so, solve the other one.

    if (path.includes(monkey1)) {
      // targetValue: {monkey1} + monkey2 => {monkey1}: targetValue - monkey2
      if (op === '+') currentValue = currentValue - resolve(monkeys, monkey2)
      // targetValue: {monkey1} - monkey2 => {monkey1}: targetValue + monkey2
      if (op === '-') currentValue = currentValue + resolve(monkeys, monkey2)
      // targetValue: {monkey1} * monkey2 => {monkey1}: targetValue / monkey2
      if (op === '*') currentValue = currentValue / resolve(monkeys, monkey2)
      // targetValue: {monkey1} / monkey2 => {monkey1}: targetValue * monkey2
      if (op === '/') currentValue = currentValue * resolve(monkeys, monkey2)

      return reverseResolveFor(monkeys, currentValue, path)
    } else {
      // targetValue: monkey1 + {monkey2} => monkey2: targetValue - monkey1
      if (op === '+') currentValue = currentValue - resolve(monkeys, monkey1)
      // targetValue: monkey1 - {monkey2} => {monkey2}: monkey1 - targetValue
      if (op === '-') currentValue = resolve(monkeys, monkey1) - currentValue
      // targetValue: monkey1 * {monkey2} => monkey2: targetValue / monkey1
      if (op === '*') currentValue = currentValue / resolve(monkeys, monkey1)
      // targetValue: monkey1 / {monkey2} => monkey2: targetValue * monkey1
      if (op === '/') currentValue = currentValue * resolve(monkeys, monkey1)
      return reverseResolveFor(monkeys, currentValue, path)
    }
  }

  const monkeys1: Monkeys = {}
  const monkeys2: Monkeys = {}

  let firstmonkey: string = ''
  let secondmonkey: string = ''

  for await (const line of lineReader) {
    const values = line.split(' ')
    if (values.length === 2) {
      monkeys1[values[0].replaceAll(':', '')] = +values[1]
      monkeys2[values[0].replaceAll(':', '')] = +values[1]
    } else {
      let monkey = values[0].replaceAll(':', '')
      let op = values[2]
      let monkey1 = values[1]
      let monkey2 = values[3]
      if (monkey === 'root') {
        firstmonkey = monkey1
        secondmonkey = monkey2
      }
      monkeys1[monkey] = [op, monkey1, monkey2]
      monkeys2[monkey] = [op, monkey1, monkey2]
    }
  }

  if (!params.skipPart1) part1 = resolve(monkeys1, 'root')

  if (!params.skipPart2) {
    // first, we need to know which monkey is tied with humn

    let path: string[] | undefined = undefined
    let targetMonkey = firstmonkey
    let solvableMonkey = secondmonkey
    path = findPathToHuman(targetMonkey, monkeys2)
    if (!path) {
      targetMonkey = secondmonkey
      solvableMonkey = firstmonkey
      path = findPathToHuman(targetMonkey, monkeys2)
    }

    // the monkey without human, can be solved and get the value that the other one should match
    let value = resolve(monkeys2, solvableMonkey)
    part2 = reverseResolveFor(monkeys2, value, path!)
  }

  return { part1, part2 }
}
