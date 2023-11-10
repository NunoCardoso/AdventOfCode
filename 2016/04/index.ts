import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0
  const letterIndex = 'abcdefghijklmnopqrstuvwxyz'

  for await (const line of lineReader) {
    const val = line.match(/^(.+)-(\d+)\[(.+)\]$/)
    const values = val[1]
    const sectionID: number = parseInt(val[2])
    const checksum: string = val[3]
    // part 1
    const letters: Record<string, number> = {}
    values
      .replaceAll('-', '')
      .split('')
      .forEach((letter: string) => {
        letters[letter] === undefined ? (letters[letter] = 1) : letters[letter]++
      })
    const keys = Object.keys(letters).sort((a, b) =>
      letters[b] - letters[a] !== 0 ? letters[b] - letters[a] : a.localeCompare(b)
    )
    const thischecksum = keys.slice(0, 5).join('')
    log.debug(letters, sectionID, checksum, thischecksum)

    const good: boolean = thischecksum === checksum
    if (good) {
      part1 += sectionID

      // part 2
      if (part2 === 0) {
        let newString = ''
        val[1].split('').forEach((letter: string) => {
          if (letter === '-') {
            newString += ' '
          } else {
            const newIndex = (letterIndex.indexOf(letter) + sectionID) % letterIndex.length
            newString += letterIndex[newIndex]
          }
        })
        if (part2 === 0 && newString === params.needle) {
          part2 = sectionID
        }
      }
    }
  }

  return { part1, part2 }
}
