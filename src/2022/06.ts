export default {
  config: {
    year: '2022',
    day: '06'
  },
  params: {
    size: {
      part1: 4,
      part2: 14
    }
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 7,
        part2: 19
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 5,
        part2: 23
      }
    },
    {
      id: 'test3',
      answers: {
        part1: 6,
        part2: 23
      }
    },
    {
      id: 'test4',
      answers: {
        part1: 10,
        part2: 29
      }
    },
    {
      id: 'test5',
      answers: {
        part1: 11,
        part2: 26
      }
    }
  ],
  prod: {
    answers: {
      part1: 1953,
      part2: 2301
    }
  }
}
