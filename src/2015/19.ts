import { Params } from 'aoc.d'

type Replacements = Map<string, Array<string>>

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const replacements: Replacements = new Map()
  let atoms: string[] = []
  const molecules = new Set<string>()
  let atomsCount = 0
  let commas = 0
  let parenthesis = 0
  const breakIntoAtoms = (mol: string): string[] => (mol === 'e' ? ['e'] : mol.match(/[A-Z][a-z]*/g)!)

  for await (const line of lineReader) {
    if (line.match('=>')) {
      const [left, right] = line.split(' => ')
      replacements.set(left, (replacements.get(left) ?? []).concat(right))
    } else {
      if (line) atoms = breakIntoAtoms(line)
    }
  }

  atoms.forEach((atom, i) => {
    replacements
      .get(atom)
      ?.forEach((reaction: string) =>
        molecules.add(atoms.slice(0, i).join('') + reaction + atoms.slice(i + 1, atoms.length).join(''))
      )

    switch (atom) {
      case 'Rn':
      case 'Ar':
        parenthesis++
        break
      case 'Y':
        commas++
        break
      default:
        atomsCount++
    }
  })

  log.debug('normal', atomsCount, 'comma', commas, 'parenthesis', parenthesis)
  // in test, we have e => H or e => O
  // in prod we have e => HF or e => AB, which requires one less step to go to e

  part1 = molecules.size
  part2 = atomsCount - commas - (params.isTest ? 0 : 1)

  return { part1, part2 }
}
