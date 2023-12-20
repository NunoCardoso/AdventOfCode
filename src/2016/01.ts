export default {
  config: {
    year: '2016',
    day: '01',
    title: 'No Time for a Taxicab'
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 5
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 2
      }
    },
    {
      id: 'test3',
      answers: {
        part1: 12
      }
    },
    {
      id: 'test4',
      answers: {
        part2: 4
      }
    }
  ],
  prod: {
    answers: {
      part1: 279,
      part2: 163
    }
  }
}
