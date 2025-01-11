export default {
  config: {
    year: '2024',
    day: '23',
    title: 'LAN Party',
    status: 'done',
    comment: 'The second part requires the Bron–Kerbosch algorithm so it is efficient under 1s',
    tags: ['Bron–Kerbosch'],
    difficulty: 5
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 7,
      part2: 'co,de,ka,ta'
    }
  },
  prod: {
    answers: {
      part1: 1075,
      part2: 'az,cg,ei,hz,jc,km,kt,mv,sv,sx,wc,wq,xy'
    }
  }
}