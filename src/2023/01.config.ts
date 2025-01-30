import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Trebuchet?!',
    year: 2023,
    day: 1,
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
        part1: 142
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 281
      }
    }
  ],
  prod: {
    answers: {
      part1: 54951,
      part2: 55218
    }
  }
}

export default config
