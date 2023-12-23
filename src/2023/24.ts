export default {
  config: {
    year: '2023',
    day: '24'
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    skip: 'part1',
    params: {
      from: 7,
      to: 27
    },
    answers: {
      part1: 2,
      part2: 47
    }
  },
  prod: {
    skip: true,
    params: {
      from: 200000000000000,
      to: 400000000000000
    },
    answers: {
      part1: 16050,
      part2: 0
    }
  }
}
