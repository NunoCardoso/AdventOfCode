import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Unstable Diffusion',
    year: 2022,
    day: 23,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    difficulty: 4
  },
  logLevel: 'info',
  ui: {
    show: true,
    during: false,
    end: true
  },
  params: {
    iterations: {
      part1: 10,
      part2: 10000000
    }
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 25
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 110,
        part2: 20
      }
    }
  ],
  prod: {
    answers: {
      part1: 4249,
      part2: 980
    }
  }
}

export default config
