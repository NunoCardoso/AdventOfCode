export default {
  config: {
    year: '2016',
    day: '07'
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 2
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 3
      }
    }
  ],
  prod: {
    answers: {
      part1: 105,
      part2: 258
    }
  }
}
