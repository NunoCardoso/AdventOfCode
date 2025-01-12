import { Params } from 'aoc.d'
import { range } from 'util/range'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: string = ''

  const instructions: string[] = []
  for await (const line of lineReader) instructions.push(line)

  const executeInstruction = (
    line: string,
    password: string[],
    reverse = false,
    indexShiftMap: Map<number, number>
  ) => {
    const words = line.split(/\s+/)
    if (words[0] === 'swap') {
      if (words[1] === 'letter') {
        const [source, target] = [words[2], words[5]]
        password = password.map((letter: string) => (letter === source ? target : letter === target ? source : letter))
      } else if (words[1] === 'position') {
        const [source, target] = [+words[2], +words[5]]
        const passwordTemp = password[source]
        password[source] = password[target]
        password[target] = passwordTemp
      }
    } else if (words[0] === 'move') {
      const [source, target] = [+words[2], +words[5]]
      if (!reverse) password.splice(target, 0, password.splice(source, 1)[0])
      else password.splice(source, 0, password.splice(target, 1)[0])
    } else if (words[0] === 'reverse') {
      const [source, target] = [+words[2], +words[4]]
      const slice = password.splice(source, target + 1 - source)
      password.splice(source, 0, ...slice.reverse())
    } else if (words[0] === 'rotate') {
      if (words[1] === 'based') {
        const index = password.findIndex((l: string) => l === words[6])
        const newIndex = indexShiftMap.get(index)!
        const diff = newIndex - index
        if (diff > 0) {
          for (let i in range(diff)) password.unshift(password.pop()!)
        } else {
          for (let i in range(Math.abs(diff))) password.push(password.shift()!)
        }
      } else if ((words[1] === 'right' && !reverse) || (words[1] === 'left' && reverse)) {
        for (let i in range(+words[2])) password.unshift(password.pop()!)
      } else if ((words[1] === 'left' && !reverse) || (words[1] === 'right' && reverse)) {
        for (let i in range(+words[2])) password.push(password.shift()!)
      }
    }
    log.debug('line', line, 'password: ', password.join(''))
    return password
  }

  const getIndexShiftMap = (passwordLength: number, reverse: boolean) => {
    const indexShiftMap: Map<number, number> = new Map()
    for (let i of range(passwordLength)) {
      const convertedI = (i + (i + 1) + (i >= 4 ? 1 : 0)) % passwordLength
      reverse ? indexShiftMap.set(convertedI, i) : indexShiftMap.set(i, convertedI)
    }
    return indexShiftMap
  }

  if (!params.skipPart1) {
    let password: string[] = params.password.part1.split('')
    let shiftMap = getIndexShiftMap(password.length, false)
    for (let instruction of instructions) password = executeInstruction(instruction, password, false, shiftMap)

    part1 = password.join('')
  }

  if (!params.skipPart2) {
    let password: string[] = params.password.part2.split('')
    let shiftMap = getIndexShiftMap(password.length, true)
    for (let instruction of instructions.reverse()) password = executeInstruction(instruction, password, true, shiftMap)
    part2 = password.join('')
  }

  return { part1, part2 }
}
