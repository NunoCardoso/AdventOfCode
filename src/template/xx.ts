export default {
  config: {
    year: '{{year}}',
    day: '{{day}}'
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 0,
      part2: 0
    }
  },
  prod: {
    skip: true,
    answers: {
      part1: 0,
      part2: 0
    }
  }
}
