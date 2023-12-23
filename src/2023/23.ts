export default {
  config: {
    year: '2023',
    day: '23'
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    skip: true,
    answers: {
      part1: 94,
      part2: 154
    }
  },
  prod: {
    skip: 'part1',
    answers: {
      part1: 2050,
      part2: 0
    }
  }
}
