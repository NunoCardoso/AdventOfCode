import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Rock Paper Scissors',
    year: 2022,
    day: 2,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  test: {
    id: 'test',
    answers: {
      part1: 15,
      part2: 12
    }
  },
  prod: {
    answers: {
      part1: 11150,
      part2: 8295
    }
  }
}

export default config
