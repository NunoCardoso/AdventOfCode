import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Program Alarm',
    year: 2019,
    day: 2,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 0
  },
  test: {
    id: 'test',
    answers: {
      part1: 3500
    }
  },
  params: {
    target: 19690720
  },
  prod: {
    answers: {
      part1: 6730673,
      part2: 3749
    }
  }
}

export default config
