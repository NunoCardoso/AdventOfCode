export default {
  config: {
    year: '2024',
    day: '20',
    title: 'Race Condition',
    status: 'done',
    comment:
      'Really nice one. Good to anlyse and see that a manhatan distance is the way to go. Just weird that ' +
      'paths that drill through the same walls are considered different only because they start on different points of ' +
      'the same track, but this was needed. Still, time is > 20s, needs optimization',
    difficulty: 3
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test',
      params: {
        threshold: 2,
        cheatLength: {
          part1: 2
        }
      },
      answers: {
        part1: 44
      }
    },
    {
      id: 'test',
      params: {
        //threshold: 76,
        threshold: 50,
        cheatLength: {
          part2: 20
        }
      },
      answers: {
        // 285 for 50 threshold
        // 3 for 76 threshold
        part2: 285
        //part2: 3
      }
    }
  ],
  prod: {
    params: {
      threshold: 100,
      cheatLength: {
        part1: 2,
        part2: 20
      }
    },
    answers: {
      part1: 1286,
      part2: 989316
    }
  }
}
