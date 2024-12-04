export default {
  config: {
    year: '2018',
    day: '12',
    title: 'Subterranean Sustainability',
    status: 'done',
    comment: 'Clever way of making the puzzle to get the pattern and extrapolate to 50 billion',
    difficulty: 4
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    skip: true,
    answers: {
      part1: 325
    }
  },
  params: {
    generations: {
      part1: 20,
      part2: 50000000000
    }
  },
  prod: {
    skip: 'part1',
    answers: {
      part1: 4386,
      part2: 5450000001166
    }
  }
}
