import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2016,
    day: 8,
    title: 'Two-Factor Authentication',
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  logLevel: 'warn',
  ui: { show: true, end: true },
  test: {
    id: 'test',
    params: {
      screenSize: [3, 7]
    },
    answers: {
      part1: 6
    }
  },
  prod: {
    params: {
      screenSize: [6, 50]
    },
    answers: {
      part1: 119,
      part2:
        '\n' +
        '####.####.#..#.####..###.####..##...##..###...##..\n' +
        '...#.#....#..#.#....#....#....#..#.#..#.#..#.#..#.\n' +
        '..#..###..####.###..#....###..#..#.#....#..#.#..#.\n' +
        '.#...#....#..#.#.....##..#....#..#.#.##.###..#..#.\n' +
        '#....#....#..#.#.......#.#....#..#.#..#.#....#..#.\n' +
        '####.#....#..#.#....###..#.....##...###.#.....##..\n'
    }
  }
}

export default config
