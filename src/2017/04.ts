export default {
  config: {
    year: '2017',
    day: '04',
    title: 'High-Entropy Passphrases',
    status: 'inprogress'
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    skip: 'part2',
    answers: {
      part1: 0,
      part2: 0
    }
  },
  prod: {
    skip: true,
    answers: {
      part1: 0,
      part2: 0
    }
  }
}
