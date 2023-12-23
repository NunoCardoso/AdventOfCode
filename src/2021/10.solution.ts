import { Params } from 'aoc.d'

type Result = {
  corrupt: boolean
  chars: string
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const lines: Array<string> = []
  let part1 = 0
  let part2 = 0

  const corruptScore: Record<string, number> = { ')': 3, ']': 57, '}': 1197, '>': 25137 }
  const correctScore: Record<string, number> = { ')': 1, ']': 2, '}': 3, '>': 4 }

  for await (const line of lineReader) {
    lines.push(line)
  }

  const checkCorrupt = (line: string): Result => {
    const opens: Array<string> = []
    let pop
    const chars = line.split('')
    for (let i = 0; i < chars.length; i++) {
      if (['{', '<', '(', '['].indexOf(chars[i]) >= 0) {
        opens.push(chars[i])
        continue
      }
      pop = opens.pop()
      if (chars[i] === '}' && pop !== '{') {
        return { corrupt: true, chars: chars[i] }
      }
      if (chars[i] === '>' && pop !== '<') {
        return { corrupt: true, chars: chars[i] }
      }
      if (chars[i] === ')' && pop !== '(') {
        return { corrupt: true, chars: chars[i] }
      }
      if (chars[i] === ']' && pop !== '[') {
        return { corrupt: true, chars: chars[i] }
      }
    }
    return {
      corrupt: false,
      chars: opens
        .reverse()
        .map((x) => {
          if (x === '{') return '}'
          if (x === '(') return ')'
          if (x === '<') return '>'
          if (x === '[') return ']'
          return ''
        })
        .join('')
    }
  }

  let part2lines: Array<number> = []
  lines.forEach((line) => {
    const val = checkCorrupt(line)
    log.debug('line', line, 'val', val)
    if (val.corrupt) {
      part1 += corruptScore[val.chars]
    } else {
      part2lines.push(
        val.chars.split('').reduce((x, y) => {
          return x * 5 + correctScore[y]
        }, 0)
      )
    }
  })

  part2lines = part2lines.sort((a, b) => (a > b ? 1 : -1))
  part2 = part2lines[Math.floor(part2lines.length / 2)]

  return { part1, part2 }
}
