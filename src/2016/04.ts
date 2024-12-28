import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0
  const letterIndex = 'abcdefghijklmnopqrstuvwxyz'

  for await (const line of lineReader) {
    const [, values, sectionID, checksum] = line.match(/^(.+)-(\d+)\[(.+)]$/)

    // part 1
    const letters: Map<string, number> = new Map()
    values
      .replaceAll('-', '')
      .split('')
      .forEach((letter: string) => letters.set(letter, (letters.get(letter) ?? 0) + 1))

    const keys = Array.from(letters.keys()).sort((a, b) => (letters.get(b)! - letters.get(a)! !== 0 ? letters.get(b)! - letters.get(a)! : a.localeCompare(b)))

    const thisChecksum = keys.slice(0, 5).join('')
    log.debug(letters, sectionID, checksum, thisChecksum)

    if (thisChecksum === checksum) {
      part1 += +sectionID

      if (!params.skipPart2) {
        const newString = values
          .split('')
          .map((letter: string) => {
            if (letter === '-') return ' '
            const newIndex = (letterIndex.indexOf(letter) + +sectionID) % letterIndex.length
            return letterIndex[newIndex]
          })
          .join('')
        if (part2 === 0 && newString === params.needle) part2 = +sectionID
      }
    }
  }

  return { part1, part2 }
}
