import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'The Sum of Its Parts',
    year: 2018,
    day: 7,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 'CABDFE',
      part2: 15
    },
    params: {
      costPerStep: 0,
      workers: 2
    }
  },
  prod: {
    params: {
      costPerStep: 60,
      workers: 5
    },
    answers: {
      part1: 'BGJCNLQUYIFMOEZTADKSPVXRHW',
      part2: 1017
    }
  }
}

export default config
