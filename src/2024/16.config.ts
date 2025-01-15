import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 16,
    title: 'Reindeer Maze',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment:
      'This one took me a while to figure out the trick, which is to let opened paths that have same distance, ' +
      'and visited indexes with same distance, to keep going, not prune them.',
    difficulty: 4
  },
  logLevel: 'info',
  ui: {
    show: false,
    during: false,
    end: true,
    keypress: false
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 7036,
        part2: 45
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 11048,
        part2: 64
      }
    }
  ],
  prod: {
    answers: {
      part1: 83432,
      part2: 467
    }
  }
}

export default config
