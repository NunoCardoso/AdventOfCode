import aoc from '../aoc'

aoc({
  year: '2022',
  day: '10',
  test: {
    id: 'test',
    part1: {
      answer: 13140
    },
    part2: {
      answer: '\n##..##..##..##..##..##..##..##..##..##..\n' +
        '###...###...###...###...###...###...###.\n' +
        '####....####....####....####....####....\n' +
        '#####.....#####.....#####.....#####.....\n' +
        '######......######......######......####\n' +
        '#######.......#######.......#######.....\n'
    }
  },
  prod: {
    part1: {
      answer: 14820
    },
    part2: {
      answer: '\n###..####.####.#..#.####.####.#..#..##..\n' +
        '#..#....#.#....#.#..#....#....#..#.#..#.\n' +
        '#..#...#..###..##...###..###..####.#..#.\n' +
        '###...#...#....#.#..#....#....#..#.####.\n' +
        '#.#..#....#....#.#..#....#....#..#.#..#.\n' +
        '#..#.####.####.#..#.####.#....#..#.#..#.\n'
    }
  }
})
