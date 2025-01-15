import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 2,
    title: 'Rock Paper Scissors',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Functional puzzle, summing answers while parsing input. Rules are hardcoded.'
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
