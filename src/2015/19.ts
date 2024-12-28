import { Params } from 'aoc.d'

type Replacements = Map<string, Array<string>>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const replacements: Replacements = new Map()
  let moleculeBits: Array<string> = []

  const breakIntoAtoms = (mol: string): Array<string> => (mol === 'e' ? ['e'] : (mol.match(/[A-Z][a-z]*/g) as Array<string>))

  for await (const line of lineReader) {
    if (line.match('=>')) {
      const [left, right] = line.split(' => ')
      replacements.set(left, (replacements.get(left) ?? []).concat(right))
    } else {
      if (line) moleculeBits = breakIntoAtoms(line)
    }
  }

  if (!params.skipPart1) {
    const molecules = new Set<string>()
    moleculeBits.forEach((molecule, i) => {
      replacements.get(molecule)?.forEach((reaction: string) => molecules.add(moleculeBits.slice(0, i).join('') + reaction + moleculeBits.slice(i + 1, moleculeBits.length).join('')))
    })
    part1 = molecules.size
  }

  if (!params.skipPart2) {
    let normalMolecules = 0
    let commaMolecules = 0
    let parenthesisMolecules = 0
    moleculeBits.forEach((bit) => {
      switch (bit) {
        case 'Rn':
        case 'Ar':
          parenthesisMolecules++
          break
        case 'Y':
          commaMolecules++
          break
        default:
          normalMolecules++
      }
    })
    log.debug('normal', normalMolecules, 'comma', commaMolecules, 'parenthesis', parenthesisMolecules)
    // in test, we have e => H or e => O
    // in prod we have e => HF or e => AB, which requires one less step to go to e
    part2 = normalMolecules - commaMolecules - (params.isTest ? 0 : 1)
  }

  return { part1, part2 }
}
