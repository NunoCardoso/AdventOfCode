export default {
  config: {
    year: '2018',
    day: '09',
    title: '',
    status: 'done',
    comment: 'Brute force taking hours on part2, definitely needs optimizing',
    difficulty: 5
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      skip: 'part2',
      answers: {
        part1: 32
      }
    },
    {
      id: 'test2',
      skip: 'part2',
      answers: {
        part1: 8317
      }
    },
    {
      id: 'test3',
      skip: 'part2',
      answers: {
        part1: 146373
      }
    },
    {
      id: 'test4',
      skip: 'part2',
      answers: {
        part1: 2764
      }
    },
    {
      id: 'test5',
      skip: 'part2',
      answers: {
        part1: 54718
      }
    },
    {
      id: 'test6',
      skip: 'part2',
      answers: {
        part1: 37305
      }
    }
  ],
  prod: {
    answers: {
      part1: 399645,
      part2: 3352507536
    }
  }
}
