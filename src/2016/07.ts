export default {
  config: {
    year: '2016',
    day: '07',
    title: 'Internet Protocol Version 7',
    status: 'done',
    comment: 'Tricky match regex but just parse input and sums for certain conditions',
    difficulty: 2
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
