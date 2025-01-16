import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1 = 0
  let part2 = 0

  const corruptScore: Record<string, number> = { ')': 3, ']': 57, '}': 1197, '>': 25137 }
  const correctScore: Record<string, number> = { ')': 1, ']': 2, '}': 3, '>': 4 }

  // if corrupt, return string is just one char
  const processLine = (line: string): string => {
    const opens: string[] = []
    let pop
    for (let char of line) {
      if (['{', '<', '(', '['].indexOf(char) >= 0) {
        opens.push(char)
        continue
      }
      pop = opens.pop()
      if (char === '}' && pop !== '{') return char
      if (char === '>' && pop !== '<') return char
      if (char === ')' && pop !== '(') return char
      if (char === ']' && pop !== '[') return char
    }
    return opens
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

  const lines: string[] = []
  for await (const line of lineReader) lines.push(line)

  let part2lines: number[] = []

  lines.forEach((line) => {
    const val = processLine(line)
    if (val.length === 1) part1 += corruptScore[val]
    else part2lines.push(val.split('').reduce((acc, char) => acc * 5 + correctScore[char], 0))
  })

  part2 = part2lines.sort((a, b) => a - b)[Math.floor(part2lines.length / 2)]

  return { part1, part2 }
}
