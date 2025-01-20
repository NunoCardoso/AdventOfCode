import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Proboscidea Volcanium',
    year: 2022,
    day: 16,
    result: 'unfinished',
    status: 'solved',
    speed: 'fast',
    code: 'dirty',
    difficulty: 4
  },
  logLevel: 'info',
  params: {
    limit: {
      part1: 30,
      part2: 26
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 1651
      //part2: 1707
    }
  },
  prod: {
    answers: {
      part1: 2124
      //  part2: 2775
    }
  }
}

export default config
