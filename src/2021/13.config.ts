import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Transparent Origami',
    year: 2021,
    day: 13,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  logLevel: 'info',
  ui: { show: false, during: true },
  test: {
    id: 'test',
    answers: {
      part1: 17
    }
  },
  prod: {
    answers: {
      part1: 802,
      part2:
        '###..#..#.#..#.####.####..##..#..#.###..\n' +
        '#..#.#.#..#..#.#.......#.#..#.#..#.#..#.\n' +
        '#..#.##...####.###....#..#....#..#.###..\n' +
        '###..#.#..#..#.#.....#...#.##.#..#.#..#.\n' +
        '#.#..#.#..#..#.#....#....#..#.#..#.#..#.\n' +
        '#..#.#..#.#..#.#....####..###..##..###..\n'
    }
  }
}

export default config
