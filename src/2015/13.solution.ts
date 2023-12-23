import { Params } from 'aoc.d'
import { Permutation } from 'js-combinatorics'

type People = Set<string>
type Scores = Map<string, Map<string, number>>

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const scores: Scores = new Map()
  const people: People = new Set()

  for await (const line of lineReader) {
    const [, person1, operation, amount, person2] = line.match(
      /([A-Z][a-z]+).+(gain|lose) (\d+).+([A-Z][a-z]+)\./
    )
    if (!people.has(person1)) {
      people.add(person1)
      scores.set(person1, new Map())
    }
    scores.get(person1)!.set(person2, +amount * (operation === 'lose' ? -1 : 1))
  }

  const solveFor = (people: People, scores: Scores): number =>
    new Permutation(people).toArray().reduce((highScore, permute) => {
      const score = permute.reduce((acc, person1, i) => {
        const person2 = permute[i + 1 === permute.length ? 0 : i + 1]
        return acc + scores.get(person1)!.get(person2)! + scores.get(person2)!.get(person1)!
      }, 0)
      return score > highScore ? score : highScore
    }, 0)

  if (!params.skipPart1) {
    part1 = solveFor(people, scores)
  }

  if (!params.skipPart2) {
    people.add(params.name)
    scores.set(params.name, new Map())
    people.forEach((name: string) => {
      scores.get(name)!.set(params.name, 0)
      scores.get(params.name)!.set(name, 0)
    })
    part2 = solveFor(people, scores)
  }

  return { part1, part2 }
}
