export default {
  config: {
    year: '2024',
    day: '24',
    title: 'Crossed Wires',
    status: 'solved',
    comment: 'This was the hardest. Solved by hand (see readme), no program yet',
    difficulty: 5
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 4
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 2024
      }
    },
    {
      id: 'test3',
      params: {
        swap: 2
      },
      answers: {
        part2: 'z00,z01,z02,z05'
      }
    }
  ],
  prod: {
    params: {
      swap: 4
    },
    answers: {
      part1: 43942008931358,
      part2: 'dvb,fhg,fsq,tnc,vcf,z10,z17,z39'
    }
  }
}
