import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Unstable Diffusion',
    year: 2022,
    day: 23,
    result: 'unfinished',
    status: 'solved',
    speed: 'slow',
    code: 'clean',
    difficulty: 4
  },
  logLevel: 'info',
  ui: {
    show: false,
    during: true,
    end: true
  },
  params: {
    iterations: {
      part1: 10
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 110,
      part2: 20
    }
  },
  prod: {
    answers: {
      part1: 4249,
      part2: 980
    }
  }
}

export default config
