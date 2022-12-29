import { Params } from '../../aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: string = ''; let part2: string = ''
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  let password = params.password

  const writePass = (vals: Array<number>) => vals.map(x => letters[x]).join('')

  while (part1 === '' || part2 === '') {
    const vals = password.split('').map((s: string) => letters.indexOf(s))
    vals[vals.length - 1]++
    for (let i = vals.length - 1; i > 0; i--) {
      if (vals[i] === 26) {
        vals[i] = 0
        vals[i - 1]++
      }
    }
    password = writePass(vals)

    let threeLettersFound = false
    for (let i = 0; i < vals.length - 2; i++) {
      if (vals[i] + 1 === vals[i + 1] && vals[i] + 2 === vals[i + 2]) {
        threeLettersFound = true
      }
    }

    let forbiddenLetters = false
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] === letters.indexOf('l') || vals[i] === letters.indexOf('i') || vals[i] === letters.indexOf('o')) {
        forbiddenLetters = true
      }
    }

    let doubled = false

    if (password.match(/(.)\1.*(.)\2/g)) {
      doubled = true
    }

    if (threeLettersFound && !forbiddenLetters && doubled) {
      if (part1 === '') {
        part1 = password
      } else {
        if (part2 === '') {
          part2 = password
        }
      }
    }
  }

  return { part1, part2 }
}
