export default {
  config: {
    year: '2024',
    day: '10',
    title: '',
    status: 'inprogress',
    comment: '',
    difficulty: 0
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 36
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 81
      }
    }
  ],
  prod: {
    answers: {
      part1: 733,
      part2: 1514
    }
  }
}
