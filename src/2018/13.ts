export default {
  config: {
    year: '2018',
    day: '13',
    title: '',
    status: 'inprogress',
    comment: '',
    difficulty: 0
  },
  logLevel: 'info',
  test: [
    {
      id: 'test',
      skip: 'part2',
      answers: {
        part1: '7,3'
      }
    },
    {
      id: 'test2',
      skip: 'part1',
      answers: {
        part2: '6,4'
      }
    }
  ],
  prod: {
    answers: {
      part1: '111,13',
      part2: 0
      // not 24,59
      // not 31,81
      // not 61,58
      // not 61,59
    }
  }
}
