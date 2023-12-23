export default {
  config: {
    year: '2022',
    day: '19',
    comment:
      'Look at index.fastest.ts and index.notsofastest.ts.\n' +
      '\n' +
      'Just adding an object to group resources and robots, makes the code 10x slower.\n' +
      '\n' +
      'it is the same algorithm.'
  },
  mode: 'fastest',
  params: {
    limit: {
      part1: 24,
      part2: 32
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 33,
      part2: 3472
    }
  },
  prod: {
    answers: {
      part1: 1624,
      part2: 12628
    }
  }
}
