import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Disk Defragmentation',
    year: 2017,
    day: 14,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  test: {
    id: 'test',
    params: {
      size: 128
    },
    answers: {
      part1: 8108,
      part2: 1242
    }
  },
  prod: {
    params: {
      size: 128
    },
    answers: {
      part1: 8222,
      part2: 1086
    }
  }
}

export default config
