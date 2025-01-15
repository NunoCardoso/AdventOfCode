import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 8,
    title: 'Treetop Tree House',
    comment: 'Very simple solution iterating on all 4 directions while computing partial scores',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  test: {
    id: 'test',
    answers: {
      part1: 21,
      part2: 8
    }
  },
  prod: {
    answers: {
      part1: 1807,
      part2: 480000
    }
  }
}

export default config
