export default {
  config: {
    year: '2023',
    day: '20'
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      skip: true,
      params: {
        iterations: 1000
      },
      answers: {
        part1: 32000000
      }
    },
    {
      id: 'test2',
      skip: true,
      params: {
        iterations: 1000
      },
      answers: {
        part1: 11687500
      }
    }
  ],
  prod: {
    params: {
      iterations: 1000
    },
    answers: {
      part1: 873301506,
      part2: 241823802412393
    }
  }
}
