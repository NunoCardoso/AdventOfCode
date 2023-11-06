import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  type Replacements = Record<string, Array<string>>

  type Point = [string, number, number] // molecule, step, correctedness
  type Points = Array<Point>
  let part1: number = 0
  let part2: number = 0

  const replacements: Replacements = {}

  let molecule: string = ''
  let moleculeBits: Array<string> = []

  const molecules: Record<string, any> = {}

  const breakIntoAtoms = (mol: string): Array<string> =>
    mol === 'e' ? ['e'] : (mol.match(/[A-Z][a-z]*/g) as Array<string>)

  let biggestReplacementSize: number = 0
  for await (const line of lineReader) {
    if (line.match('=>')) {
      const vals = line.split(' => ')
      !Object.prototype.hasOwnProperty.call(replacements, vals[0])
        ? (replacements[vals[0]] = [vals[1]])
        : replacements[vals[0]].push(vals[1])
      if (vals[1].length > biggestReplacementSize) {
        biggestReplacementSize = vals[1].length
      }
    } else {
      if (line !== '') {
        molecule = line
        moleculeBits = line.split('')
      }
    }
  }

  const divergingIndex = (current: string): number => {
    const vals = current.split('')
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] !== moleculeBits[i]) {
        return i
      }
    }
    return current.length
  }

  /** approach:
   * Need to branch out on first 3 steps.
   * After that, just pick best n, according to common number of letters
   * pick candidates by filling out mistakes or, if current matches so far 100%, use endWith to find more candidates
   */

  const getThemMolecules = (start: string) => {
    let highScore: number = 1000
    const opened: Array<Point> = [[start, 0, 0]]
    const visited: Record<string, number> = {}

    const searchAlgorithm = (opened: Array<Point>, visited: Record<string, number>) => {
      const head: Point = opened.splice(-1)[0]

      visited[head[0]] = head[1]
      if (head[0] === molecule) {
        console.log('got it', head)
        if (head[1] < highScore) {
          highScore = head[1]
          // I purge opens with higher step count
          opened = _.reject(opened, (o: Point) => o[1] >= highScore)
        }
        return
      }

      // prevent overflows
      if (head[0].length > molecule.length) {
        return
      }

      const newMolecules: Points = []

      // in first 3 steps, perform breadth first
      if (head[1] < 3) {
        console.log('On BFS')
        opened.push(head)
        const allStrings: any = {}
        opened.forEach((o) => {
          doReact(o[0]).forEach((s: string) => {
            allStrings[s] = 1
          })
        })
        opened.splice(0, opened.length)
        newMolecules.push(
          ...Object.keys(allStrings).map((s: string) => [s, head[1] + 1, divergingIndex(s)] as Point)
        )
      } else {
        const ratioOfCorrectedness = divergingIndex(head[0])
        if (ratioOfCorrectedness === 100) {
          console.log('PERFECT 100')
          Object.keys(replacements).forEach((key) => {
            // a look-back from the last matching letters
            if (head[0].endsWith(key)) {
              const index = _.lastIndexOf(head[0], key)
              replacements[key].forEach((trg) => {
                const newCurrent = head[0].substring(0, index) + trg
                if (!Object.prototype.hasOwnProperty.call(visited, newCurrent) && head[1] + 1 < highScore) {
                  newMolecules.push([newCurrent, head[1] + 1, divergingIndex(newCurrent)])
                }
              })
            }
          })
        } else {
          const index = divergingIndex(head[0])
          const left = head[0].substring(0, index)
          const rest = head[0].substring(index, head[0].length)

          Object.keys(replacements).forEach((key) => {
            // basically a look-forward from the divergent letter
            if (rest.startsWith(key)) {
              const right = rest.substring(key.length, rest.length)
              replacements[key].forEach((trg) => {
                const newCurrent = left + trg + right
                const newIndex = divergingIndex(newCurrent)
                if (
                  !Object.prototype.hasOwnProperty.call(visited, newCurrent) &&
                  head[1] + 1 < highScore &&
                  // if I am not generating too much garbage
                  newIndex + biggestReplacementSize > newCurrent.length
                ) {
                  newMolecules.push([newCurrent, head[1] + 1, newIndex])
                }
              })
            }
          })
          console.log('head', head[0], 'generated', newMolecules)
        }
      }

      if (newMolecules.length !== 0) {
        opened.push(...newMolecules)

        // remove opened stuff that will not go anywhere as the divergeIndex is far away, one length of the
        // biggest replacement molecule
        /* if (head[1] > 20) {
          opened = _.reject(opened, (o: Point) => o[1] + biggestReplacementSize < head[1])
        } */

        opened.sort((a, b) => (a[2] - b[2] !== 0 ? a[2] - b[2] : b[0].length - a[0].length))
      }
    }

    while (opened.length > 0) {
      console.log('opened', opened.slice(-3))
      searchAlgorithm(opened, visited)
    }
    return highScore
  }

  const doReact = (molecule: string): Array<string> => {
    const molecules: any = {}
    const atoms: Array<string> = breakIntoAtoms(molecule)
    for (let i = 0; i < atoms.length; i++) {
      const reactions: Array<string> = replacements[atoms[i]]
      reactions?.forEach((reaction: string) => {
        molecules['' + atoms.slice(0, i).join('') + reaction + atoms.slice(i + 1, atoms.length).join('')] = 1
      })
    }
    return Object.keys(molecules)
  }

  if (params.part1?.skip !== true) {
    part1 = doReact(molecule).length
  }

  if (params.part2?.skip !== true) {
    part2 = getThemMolecules('e')
  }

  return {
    part1,
    part2
  }
}
