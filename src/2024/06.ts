export default {
  config: {
    year: '2024',
    day: '06',
    title: 'Guard Gallivant',
    status: 'done',
    comment:
      'Takes 10 seconds but it gets there. Needs some optimization, lucky that map was not that big. Optimizations are on readme',
    difficulty: 3
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 41,
      part2: 6
    }
  },
  prod: {
    answers: {
      part1: 5080,
      part2: 1919
    }
  }
}
