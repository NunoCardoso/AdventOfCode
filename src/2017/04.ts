export default {
  config: {
    year: '2017',
    day: '04',
    title: 'High-Entropy Passphrases',
    status: 'Simple rearranging words for list size comparison',
    difficulty: 1
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      skip: 'part2',
      answers: {
        part1: 2
      }
    },
    {
      id: 'test2',
      skip: 'part1',
      answers: {
        part2: 3
      }
    }
  ],
  prod: {
    answers: {
      part1: 466,
      part2: 251
    }
  }
}
