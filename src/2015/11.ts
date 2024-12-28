import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: string = ''
  let part2: string = ''

  const letters = 'abcdefghijklmnopqrstuvwxyz'
  let password = params.password

  const writePass = (values: Array<number>): string => values.map((value) => letters[value]).join('')

  const readPass = (password: string): Array<number> =>
    password.split('').map((s: string) => letters.indexOf(s))

  while (part1 === '' || part2 === '') {
    const values = readPass(password)
    values[values.length - 1]++
    for (let i = values.length - 1; i > 0; i--) {
      if (values[i] === letters.length) {
        values[i] = 0
        values[i - 1]++
      }
    }
    password = writePass(values)

    let threeLettersFound = false
    for (let i = 0; i < values.length - 2; i++) {
      if (values[i] + 1 === values[i + 1] && values[i] + 2 === values[i + 2]) {
        threeLettersFound = true
      }
    }
    const forbiddenLetters = !!password.match(/[lio]/)
    const doubled = !!password.match(/(.)\1.*(.)\2/g)

    if (threeLettersFound && !forbiddenLetters && doubled) {
      if (part1 === '') part1 = password
      else if (part2 === '') part2 = password
    }
  }

  return { part1, part2 }
}
