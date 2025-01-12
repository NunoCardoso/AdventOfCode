import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Corruption Checksum',
    year: 2017,
    day: 2,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 18
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 9
      }
    }
  ],
  prod: {
    answers: {
      part1: 47136,
      part2: 250
    }
  }
}

export default config
