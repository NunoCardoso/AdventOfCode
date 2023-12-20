export default {
  config: {
    year: '2023',
    day: '20'
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 32000000
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 11687500
      }
    }
  ],
  prod: {
    skip: true,
    answers: {
      part1: 0,
      part2: 0
    }
  }
}
