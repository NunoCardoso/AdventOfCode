import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let problemsPart1: number[][] = []
  let problemsPart2: number[][] = []
  let transposePart2: string[] = []
  let operators: string[] = []
  let index: number = 0

  for await (const line of lineReader) {
    let values: string[] = line.match(/\S+\s*/g)
    if (index === 0) {
      values.forEach((v) => problemsPart1.push([+v]))
      transposePart2 = line.split('')
    } else if (line.match(/\d/)) {
      values.forEach((v, i) => problemsPart1[i].push(+v))
      line
        .split('')
        .forEach((l: string, i: number) => (transposePart2[i] ? (transposePart2[i] += l) : (transposePart2[i] = l)))
    } else {
      values?.forEach((v, i) => operators.push(v.trim()))
      let temp: number[] = []
      transposePart2.forEach((t) => {
        if (t.trim().length > 0) temp.push(+t)
        else {
          problemsPart2.push(temp)
          temp = []
        }
      })
      problemsPart2.push(temp)
    }
    index++
  }

  const solveFor = (problems: number[][], operators: string[]): number =>
    problems.reduce(
      (acc, val, i) =>
        acc + val.reduce((acc2, val2, j) => (j === 0 ? val2 : operators[i] === '+' ? acc2 + val2 : acc2 * val2), 0),
      0
    )

  if (!params.skipPart1) part1 = solveFor(problemsPart1, operators)
  if (!params.skipPart2) part2 = solveFor(problemsPart2, operators)

  return { part1, part2 }
}
