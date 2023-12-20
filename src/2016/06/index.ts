export default async (lineReader: any) => {
  let part1: string = ''
  let part2: string = ''

  let data: Array<Record<string, number>> = []

  for await (const line of lineReader) {
    if (data.length === 0) data = new Array(line.length).fill(null).map(() => ({}))
    line.split('').forEach((v: string, i: number) => {
      !data[i][v] ? (data[i][v] = 1) : data[i][v]++
    })
  }

  data.forEach((col) => {
    const sorted = Object.keys(col).sort((a, b) => col[b] - col[a])
    part1 += sorted[0]
    part2 += sorted[sorted.length - 1]
  })

  return { part1, part2 }
}
