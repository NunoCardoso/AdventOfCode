import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Cathode-Ray Tube',
    year: 2022,
    day: 10,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  params: {
    limit: 240,
    lineWidth: 40
  },
  test: {
    id: 'test',
    answers: {
      part1: 13140,
      part2:
        '\n##..##..##..##..##..##..##..##..##..##..\n' +
        '###...###...###...###...###...###...###.\n' +
        '####....####....####....####....####....\n' +
        '#####.....#####.....#####.....#####.....\n' +
        '######......######......######......####\n' +
        '#######.......#######.......#######.....\n'
    }
  },
  prod: {
    answers: {
      part1: 14820,
      part2:
        '\n###..####.####.#..#.####.####.#..#..##..\n' +
        '#..#....#.#....#.#..#....#....#..#.#..#.\n' +
        '#..#...#..###..##...###..###..####.#..#.\n' +
        '###...#...#....#.#..#....#....#..#.####.\n' +
        '#.#..#....#....#.#..#....#....#..#.#..#.\n' +
        '#..#.####.####.#..#.####.#....#..#.#..#.\n'
    }
  }
}

export default config
