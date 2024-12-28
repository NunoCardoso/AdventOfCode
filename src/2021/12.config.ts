export default {
  config: {
    year: '2021',
    day: '12'
  },
  logLevel: 'info',
  ui: { show: false, during: true },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 10,
        part2: 36
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 19,
        part2: 103
      }
    },
    {
      id: 'test3',
      answers: {
        part1: 226,
        part2: 3509
      }
    }
  ],
  prod: {
    answers: {
      part1: 3713,
      part2: 91292
    }
  }
}
