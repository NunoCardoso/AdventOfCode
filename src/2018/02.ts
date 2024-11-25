export default {
  config: {
    year: '2018',
    day: '02',
    title: 'Inventory Management System',
    status: 'done',
    comment: 'A little harder to get the regex for part1, rest was ok',
    difficulty: 2
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test',
      answers: {
        part1: 12
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 'fgij'
      }
    }
  ],
  prod: {
    skip: false,
    answers: {
      part1: 6175,
      part2: 'asgwjcmzredihqoutcylvzinx'
    }
  }
}
