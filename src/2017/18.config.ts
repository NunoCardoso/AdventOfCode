import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Duet',
    year: 2017,
    day: 18,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 4
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 3
      }
    }
  ],
  prod: {
    answers: {
      part1: 8600,
      part2: 7239
    }
  }
}

export default config
