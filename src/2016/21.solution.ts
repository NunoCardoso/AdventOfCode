import { Params } from 'aoc'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: string = ''

  const instructions: Array<string> = []
  for await (const line of lineReader) instructions.push(line)

  const executeInstruction = (
    line: string,
    password: Array<string>,
    reverse = false,
    indexShiftMap: Map<number, number>
  ) => {
    const words = line.split(/\s+/)
    if (words[0] === 'swap') {
      if (words[1] === 'letter') {
        const [source, target] = [words[2], words[5]]
        password = password.map((letter: string) =>
          letter === source ? target : letter === target ? source : letter
        )
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
          for (let i = 0; i < diff; i++) {
            password.splice(0, 0, password.splice(-1)[0])
          }
        } else {
          for (let i = 0; i < Math.abs(diff); i++) {
            password.push(password.splice(0, 1)[0])
          }
        }
      } else if ((words[1] === 'right' && !reverse) || (words[1] === 'left' && reverse)) {
        for (let i = 0; i < +words[2]; i++) {
          password.splice(0, 0, password.splice(-1)[0])
        }
      } else if ((words[1] === 'left' && !reverse) || (words[1] === 'right' && reverse)) {
        for (let i = 0; i < +words[2]; i++) {
          password.push(password.splice(0, 1)[0])
        }
      }
    }
    log.debug('line', line, 'password: ', password.join(''))
    return password
  }

  const getIndexShiftMap = (password: Array<string>, reverse: boolean) => {
    const indexShiftMap: Map<number, number> = new Map()
    for (let i = 0; i < password.length; i++) {
      const convertedI = (i + (i + 1) + (i >= 4 ? 1 : 0)) % password.length
      reverse ? indexShiftMap.set(convertedI, i) : indexShiftMap.set(i, convertedI)
    }
    return indexShiftMap
  }

  if (!params.skipPart1) {
    let password: Array<string> = params.password.part1.split('')
    instructions.forEach((i) => {
      password = executeInstruction(i, password, false, getIndexShiftMap(password, false))
    })
    part1 = password.join('')
  }

  if (!params.skipPart2) {
    let password: Array<string> = params.password.part2.split('')
    instructions.reverse().forEach((i) => {
      password = executeInstruction(i, password, true, getIndexShiftMap(password, true))
    })
    part2 = password.join('')
  }

  return { part1, part2 }
}
