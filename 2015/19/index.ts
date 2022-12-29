
import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Replacements = Record<string, Array<string>>

  let part1: number = 0; let part2: number = 0

  const replacements: Replacements = {}
  const reverseReplacement: Record<string, string> = {}
  let molecule: string = ''
  for await (const line of lineReader) {
    if (line.match('=>')) {
      const vals = line.split(' => ')
      if (!Object.prototype.hasOwnProperty.call(replacements, vals[0])) {
        replacements[vals[0]] = [vals[1]]
      } else {
        replacements[vals[0]].push(vals[1])
      }
      reverseReplacement[vals[1]] = vals[0]
    } else {
      if (line !== '') {
        molecule = line
      }
    }
  }

  const molecules: Record<string, any> = {}

  if (params.part1?.skip !== true) {
    for (let i = 0; i < molecule.length; i++) {
      const left = molecule.substring(0, i)
      const rest = molecule.substring(i, molecule.length)
      Object.keys(replacements).forEach(key => {
        if (rest.startsWith(key)) {
          const right = rest.substring(key.length, rest.length)
          replacements[key].forEach(trg => molecules[left + trg + right] = 1)
        }
      })
    }
    part1 = Object.keys(molecules).length
  }

  const sortedPatterns: Array<string> = Object.keys(reverseReplacement)
    .sort((a, b) => b.length - a.length)
  if (params.part1?.skip !== true) {
    let it = 0
    while (molecule !== 'e' && it < 10) {
      let newMolecule: string = ''
      console.log('molecule is now', molecule)
      for (let i = 0; i < molecule.length; i++) {
        const rest = molecule.substring(i, molecule.length)
        console.log(sortedPatterns)
        const replacement: string | undefined = _.find(sortedPatterns, (s: string) => rest.startsWith(s))
        if (replacement) {
          console.log('using replacement', replacement)
          i += reverseReplacement[replacement].length
          newMolecule += reverseReplacement[replacement]
        } else {
          if (i < molecule.length - 1) {
            newMolecule += rest.substring(i, i + 1)
          }
        }
      }
      console.log(molecule, 'became', newMolecule)
      molecule = newMolecule
      it++
    }
    part2 = it
  }

  return {
    part1,
    part2
  }
}
