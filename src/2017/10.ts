export default {
  config: {
    year: '2017',
    day: '10',
    title: 'Knot Hash',
    status: 'done',
    comment: 'hard to read part2, difficulty is starting',
    difficulty: 3
  },
  logLevel: 'debug',
  test: [{
    id: 'test1',
    skip: true,
    params: {
      size: 5
    },
    answers: {
      part1: 12
    }
  },{
    id: 'test2',
    params: {
      size: 256,
      suffix: [17,31,73,47,23]
    },
    answers: {
      part2: 'a2582a3a0e66e6e86e3812dcb672a272'
    }
  }, {
    id: 'test3',
    params: {
      size: 256,
      suffix: [17,31,73,47,23]
    },
    answers: {
      part2: '33efeb34ea91902bb2f59c9920caa6cd'
    }
  }, {
    id: 'test4',
    params: {
      size: 256,
      suffix: [17,31,73,47,23]
    },
    answers: {
      part2: '3efbe78a8d82f29979031a4aa0b16a9d'
    }
  }, {
    id: 'test5',
    params: {
      size: 256,
      suffix: [17,31,73,47,23]
    },
    answers: {
      part2: '63960835bcdc130f0b66d7ff4f6a5a8e'
    }
  }],
  prod: {
    params: {
      size: 256,
      suffix: [17,31,73,47,23]
    },
    answers: {
      part1: 38628,
      part2: 'e1462100a34221a7f0906da15c1c979a'
    }
  }
}
