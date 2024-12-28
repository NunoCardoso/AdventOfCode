export default {
  config: {
    year: '2015',
    day: '24',
    title: 'It Hangs in the Balance',
    status: 'done',
    tags: ['combination'],
    comment: 'Runs in 6/7 seconds, not sure if I can do it better as it does a lot of combinations',
    difficulty: 5
  },
  params: {
    compartments: {
      part1: 3,
      part2: 4
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 99,
      part2: 44
    }
  },
  prod: {
    answers: {
      part1: 10439961859,
      part2: 72050269
    }
  }
}
