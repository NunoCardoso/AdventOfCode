import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 10,
    title: 'Cathode-Ray Tube',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Ugly output but it works, functional puzzle where we do the sums while parsing input'
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
