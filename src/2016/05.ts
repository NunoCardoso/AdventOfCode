export default {
  config: {
    year: '2016',
    day: '05',
    title: 'How About a Nice Game of Chess?',
    comment: 'md5, 18s, nothing I can do to make it faster'
  },
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      secretKey: 'abc'
    },
    answers: {
      part1: '18f47a30',
      part2: '05ace8e3'
    }
  },
  prod: {
    params: {
      secretKey: 'ugkcyxxp'
    },
    answers: {
      part1: 'd4cd2ee1',
      part2: 'f2c730e5'
    }
  }
}
