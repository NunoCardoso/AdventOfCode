import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 7,
    title: 'No Space Left On Device',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Properly optimized script with no need for recursion, to compute directory sizes'
  },
  params: {
    cutoffDirSize: 100000,
    totalDiskSize: 70000000,
    minSpaceFree: 30000000
  },
  test: {
    id: 'test',
    answers: {
      part1: 95437,
      part2: 24933642
    }
  },
  prod: {
    answers: {
      part1: 1555642,
      part2: 5974547
    }
  }
}

export default config
