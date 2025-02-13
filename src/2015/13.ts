import { Params } from 'aoc.d'
import { permutation } from 'util/permutation'

type People = Set<string>
type Scores = Map<string, Map<string, number>>

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const scores: Scores = new Map()
  const people: People = new Set()

  const solveFor = (people: People, scores: Scores): number =>
    permutation([...people]).reduce((highScore, permute) => {
      const score = permute.reduce((acc, person1, i) => {
        const person2 = permute[(i + 1) % permute.length]
        return acc + scores.get(person1)!.get(person2)! + scores.get(person2)!.get(person1)!
      }, 0)
      return score > highScore ? score : highScore
    }, 0)

  for await (const line of lineReader) {
    const [, person1, operation, amount, person2] = line.match(/([A-Z][a-z]+).+(gain|lose) (\d+).+([A-Z][a-z]+)\./)
    if (!people.has(person1)) {
      people.add(person1)
      scores.set(person1, new Map())
    }
    scores.get(person1)!.set(person2, +amount * (operation === 'lose' ? -1 : 1))
  }

  part1 = solveFor(people, scores)
  people.add(params.name)
  scores.set(params.name, new Map())
  people.forEach((name: string) => {
    scores.get(name)!.set(params.name, 0)
    scores.get(params.name)!.set(name, 0)
  })
  part2 = solveFor(people, scores)

  return { part1, part2 }
}
