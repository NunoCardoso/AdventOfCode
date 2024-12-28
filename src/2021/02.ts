// action, amount
type Coord = [string, number]

export default async (lineReader: any) => {
  const data: Array<Coord> = []

  for await (const line of lineReader) {
    const [left, right] = line.split(' ')
    data.push([left, +right])
  }

  const solveFor = (mode: string) => {
    let distance: number = 0
    let depth: number = 0
    let aim: number = 0
    data.forEach((coord) => {
      if (coord[0] === 'forward') {
        distance += coord[1]
        if (mode === 'part2') depth += coord[1] * aim
      } else if (coord[0] === 'up') {
        if (mode === 'part2') aim += -1 * coord[1]
        else depth += -1 * coord[1]
      } else {
        if (mode === 'part2') aim += coord[1]
        else depth += coord[1]
      }
    })
    return depth * distance
  }

  return {
    part1: solveFor('part1'),
    part2: solveFor('part2')
  }
}
