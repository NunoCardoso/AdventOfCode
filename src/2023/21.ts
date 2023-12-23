export default {
  config: {
    year: '2023',
    day: '21',
    title: 'Step Counter'
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    skip: true,
    params: {
      steps: {
        part1: 6,
        part2: 10
      }
    },
    answers: {
      part1: 16,
      part2: 50
    }
  },
  prod: {
    params: {
      steps: {
        part1: 64,
        part2: 26501365
      }
    },
    answers: {
      part1: 3729,
      part2: 621289922886149
    }
  }
}
