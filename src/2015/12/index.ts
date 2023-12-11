import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let map: Record<string, any> = {}
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    map = JSON.parse(line)
  }

  const solveFor = (el: number | Array<number> | Record<string, any>, mode: string) => {
    let score: number = 0
    if (typeof el === 'number') {
      score = el as number
    }
    if (Array.isArray(el)) {
      score = (el as Array<any>).reduce((acc: number, el: any) => acc + solveFor(el, mode), 0)
    }
    if (typeof el === 'object' && !(el instanceof Array)) {
      if (mode === 'part2' && Object.values(el).find((v: string) => v === 'red')) {
        return 0
      }
      score = Object.keys(el).reduce((acc: number, _el: any) => acc + solveFor(el[_el], mode), 0)
    }
    return score
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = solveFor(map, 'part1')
  }
  if (params.skip !== true && params.skip !== 'part1') {
    part2 = solveFor(map, 'part2')
  }

  return { part1, part2 }
}
