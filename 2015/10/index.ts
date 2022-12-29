import { Params } from '../../aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0; let part2: number = 0

  let input = params.input
  for (let i = 1; i <= 50; i++) {
    const vals = input.split('')
    const seq = []
    let cur = ''
    vals.forEach((val: string) => {
      if (cur === '') {
        cur = val
      } else {
        if (val === cur[0]) {
          cur = cur + val
        } else {
          seq.push(cur)
          cur = val
        }
      }
    })
    if (cur !== '') {
      seq.push(cur)
    }
    let res = ''
    seq.forEach(s => {
      res = res + s.length + s[0]
    })

    if (i % params.part1.limit === 0) {
      part1 = res.length
    }
    if (i % params.part2.limit === 0) {
      part2 = res.length
    }
    input = res
  }

  return {
    part1, part2
  }
}
