import { Params } from 'aoc.d'

type Replacements = Record<string, Array<string>>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const replacements: Replacements = {}
  const reverseReplacements: Replacements = {}

  let molecule: string = ''
  let moleculeBits: Array<string> = []

  const breakIntoAtoms = (mol: string): Array<string> =>
    mol === 'e' ? ['e'] : (mol.match(/[A-Z][a-z]*/g) as Array<string>)

  for await (const line of lineReader) {
    if (line.match('=>')) {
      const vals = line.split(' => ')
      !Object.prototype.hasOwnProperty.call(replacements, vals[0])
        ? (replacements[vals[0]] = [vals[1]])
        : replacements[vals[0]].push(vals[1])
      !Object.prototype.hasOwnProperty.call(reverseReplacements, vals[1])
        ? (reverseReplacements[vals[1]] = [vals[0]])
        : reverseReplacements[vals[1]].push(vals[0])
    } else {
      if (line !== '') {
        molecule = line
        moleculeBits = breakIntoAtoms(molecule)
      }
    }
  }

  const solveFor = (molecule: string) => {
    let normalMolecules = 0
    let commaMolecules = 0
    let parenthesisMolecules = 0
    breakIntoAtoms(molecule).forEach((m) => {
      switch (m) {
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
    return normalMolecules - commaMolecules - (params.isTest ? 0 : 1)
  }

  const doReact = (moleculeBits: Array<string>): number => {
    const molecules = new Set<string>()
    moleculeBits.forEach((molecule, i) => {
      replacements[molecule]?.forEach((reaction: string) =>
        molecules.add(
          moleculeBits.slice(0, i).join('') +
            reaction +
            moleculeBits.slice(i + 1, moleculeBits.length).join('')
        )
      )
    })
    return molecules.size
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = doReact(moleculeBits)
  }

  if (params.skip !== true && params.skip !== 'part2') {
    part2 = solveFor(molecule)
  }

  return { part1, part2 }
}
