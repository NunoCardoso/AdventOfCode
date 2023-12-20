export default {
  config: {
    year: '2016',
    day: '08',
    title: 'Two-Factor Authentication'
  },
  logLevel: 'info',
  ui: { show: true, end: true },
  test: {
    id: 'test',
    params: {
      screenSize: {
        height: 3,
        width: 7
      }
    },
    answers: {
      part1: 6
    }
  },
  prod: {
    params: {
      screenSize: {
        height: 6,
        width: 50
      }
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
