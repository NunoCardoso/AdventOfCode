export default {
  config: {
    year: '2024',
    day: '16',
    title: 'Reindeer Maze',
    status: 'inprogress',
    comment: '',
    difficulty: 0
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 7036
        //part2: 45
      }
    },
    {
      id: 'test2',
      answers: {
        //part1: 11048,
        //part2: 64
      }
    }
  ],
  prod: {
    answers: {
      // part1: 83432,
      //  part2: 0
      // 433 too low
    }
  }
}
