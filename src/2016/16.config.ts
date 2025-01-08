export default {
  config: {
    year: '2016',
    day: '16',
    title: 'Dragon Checksum',
    status: 'solved',
    comment: 'md5, 3s, nothing I can do to make it faster',
    tags: ['md5'],
    difficulty: 1
  },
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      input: '10000',
      size: {
        part1: 20
      }
    },
    answers: {
      part1: '01100'
    }
  },
  prod: {
    params: {
      input: '10111011111001111',
      size: {
        part1: 272,
        part2: 35651584
      }
    },
    answers: {
      part1: '11101010111100010',
      part2: '01001101001000101'
    }
  }
}
