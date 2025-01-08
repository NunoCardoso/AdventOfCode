export default {
  config: {
    year: '2016',
    day: '13',
    title: 'A Maze of Twisty Little Cubicles',
    status: 'solved',
    comment: 'Simple Dijkstra, just disable the end check for part2 to keep visiting',
    difficulty: 2,
    tags: ['dijkstra']
  },
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      designerNumber: 10,
      target: [7, 4]
    },
    answers: {
      part1: 11
    }
  },
  prod: {
    params: {
      designerNumber: 1350,
      target: [31, 39],
      cutoff: 50
    },
    answers: {
      part1: 92,
      part2: 124
    }
  }
}
