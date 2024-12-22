export default {
  config: {
    year: '2024',
    day: '08',
    title: 'Resonant Collinearity',
    status: 'done',
    comment: 'Stumbled on part2 as the anchor should be the first point, not the second one. A little trick but easy to fix',
    difficulty: 2
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 14,
      part2: 34
    }
  },
  prod: {
    answers: {
      part1: 269,
      part2: 949
    }
  }
}
