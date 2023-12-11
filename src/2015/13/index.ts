import { Params } from 'aoc.d'
import { Permutation } from 'js-combinatorics'

type People = Array<string>
type Scores = Record<string, any>

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const scores: Scores = {}
  const people: People = []

  for await (const line of lineReader) {
    const vals = line.split(' ')
    const person1: string = vals[0]
    const operation: string = vals[2]
    const amount: number = parseInt(vals[3])
    const person2: string = vals[vals.length - 1].replaceAll(/\./g, '')

    if (people.indexOf(person1) < 0) {
      people.push(person1)
      scores[person1] = {}
    }
    scores[person1][person2] = amount * (operation === 'lose' ? -1 : 1)
  }

  const solveFor = (people: People, scores: Scores): number => {
    let highScore = 0
    const permutes = new Permutation(people).toArray()
    permutes.forEach((permute) => {
      let score = 0
      for (let i = 0; i < permute.length; i++) {
        const pers1 = i
        const pers2 = i + 1 === permute.length ? 0 : i + 1
        score += scores[permute[pers1]][permute[pers2]] + scores[permute[pers2]][permute[pers1]]
      }
      if (score > highScore) {
        highScore = score
      }
    })
    return highScore
  }

  if (params.part1?.skip !== true) {
    part1 = solveFor(people, scores)
  }

  if (params.part2?.skip !== true) {
    people.push(params.name)
    scores[params.name] = {}
    people.forEach((name: string) => {
      scores[name][params.name] = 0
      scores[params.name][name] = 0
    })
    part2 = solveFor(people, scores)
  }

  return { part1, part2 }
}
