import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 3,
    title: 'Rucksack Reorganization',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Functional puzzle, using custom intersect to find common letters while parsing input'
  },
  test: {
    id: 'test',
    answers: {
      part1: 157,
      part2: 70
    }
  },
  prod: {
    answers: {
      part1: 7766,
      part2: 2415
    }
  }
}

export default config
