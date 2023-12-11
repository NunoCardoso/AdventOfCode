import aoc from 'aoc'

aoc({
  year: '2015',
  day: '16',
  logLevel: 'info',
  params: {
    target: {
      children: 3,
      cats: 7,
      samoyeds: 2,
      pomeranians: 3,
      akitas: 0,
      vizslas: 0,
      goldfish: 5,
      trees: 3,
      cars: 2,
      perfumes: 1
    }
  },
  prod: {
    answers: {
      part1: 373,
      part2: 260
    }
  }
})
