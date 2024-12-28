export default {
  config: {
    year: '2015',
    day: '19',
    title: 'Medicine for Rudolph',
    status: 'done',
    comment:
      'Check the readme for the reason of the formula used, it is quite clever puzzle to avoid path finding',
    difficulty: 4
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 4,
        part2: 3
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 7,
        part2: 6
      }
    }
  ],
  prod: {
    answers: {
      part1: 576,
      part2: 207
    }
  }
}
