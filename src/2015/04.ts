export default {
  config: {
    year: '2015',
    day: '04',
    title: 'The Ideal Stocking Stuffer',
    comment: 'Nothing I can do to make it faster, running MD5 hashes until they meet criteria',
    status: 'done',
    tags: ['md5'],
    difficulty: 1
  },
  params: {
    firstCutoff: '00000',
    secondCutoff: '000000'
  },
  test: {
    id: 'test',
    params: {
      secretKey: 'abcdef'
    },
    answers: {
      part1: 609043
    }
  },
  prod: {
    params: {
      secretKey: 'ckczppom'
    },
    answers: {
      part1: 117946,
      part2: 3938038
    }
  }
}
