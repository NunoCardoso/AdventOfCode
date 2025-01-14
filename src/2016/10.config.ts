export default {
  config: {
    title: 'Balance Bots',
    year: 2016,
    day: 10,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  test: {
    id: 'test',
    params: {
      botValues: [2, 5]
    },
    answers: {
      part1: 2,
      part2: 5 * 3 * 2
    }
  },
  prod: {
    params: {
      botValues: [17, 61]
    },
    answers: {
      part1: 147,
      part2: 55637
    }
  }
}
