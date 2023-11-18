import aoc from 'aoc'

aoc({
  year: '2022',
  day: '10',
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
})