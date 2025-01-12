import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const threshold = params.threshold

  const presents1: number[] = []
  const presents2: number[] = []

  // fill out number lists for all presents from i to threshold.
  for (let i = 1; i < threshold / 10; i++) {
    let visits = 0
    for (let j = i; j < threshold / 10; j = j + i) {
      if (!presents1[j]) presents1[j] = 10
      presents1[j] = presents1[j] + i * 10
      if (visits++ < 50) {
        if (!presents2[j]) presents2[j] = 11
        presents2[j] = presents2[j] + i * 11
      }
    }
  }
  part1 = presents1.findIndex((min: number) => min >= threshold)
  part2 = presents2.findIndex((min: number) => min >= threshold)

  return { part1, part2 }
}
