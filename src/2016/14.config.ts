export default {
  config: {
    year: '2016',
    day: '14',
    title: 'One-Time Pad',
    status: 'solved',
    comment: 'This will take some time around 30s, MD5 puzzle',
    tags: ['md5'],
    difficulty: 3
  },
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      salt: 'abc',
      cutoff: 64,
      viewAhead: 1000,
      repetition: 2016
    },
    answers: {
      part1: 22728,
      part2: 22551
    }
  },
  prod: {
    params: {
      salt: 'yjdafjpo',
      cutoff: 64,
      viewAhead: 1000,
      repetition: 2016
    },
    answers: {
      part1: 25427,
      part2: 22045
    }
  }
}
