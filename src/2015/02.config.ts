import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'I Was Told There Would Be No Math',
    year: 2015,
    day: 2,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 58,
        part2: 34
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 43,
        part2: 14
      }
    }
  ],
  prod: {
    answers: {
      part1: 1586300,
      part2: 3737498
    }
  }
}

export default config
