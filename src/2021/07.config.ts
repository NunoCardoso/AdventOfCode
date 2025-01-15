import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2021,
    day: 7,
    title: 'The Treachery of Whale',
    comment: 'Brute force works ok, calculating distances for each position',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    difficulty: 2
  },
  test: {
    id: 'test',
    answers: {
      part1: 37,
      part2: 168
    }
  },
  prod: {
    answers: {
      part1: 352997,
      part2: 101571302
    }
  }
}

export default config
