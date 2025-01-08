export default async (lineReader: any) => {
  let part1: string = ''
  let part2: string = ''

  let data: Record<string, number>[] = []

  for await (const line of lineReader) {
    if (data.length === 0) data = new Array(line.length).fill(null).map(() => ({}))
    line.split('').forEach((char: string, i: number) => (data[i][char] = (data[i][char] ?? 0) + 1))
  }

  data.forEach((col) => {
    const sorted = Object.keys(col).sort((a, b) => col[b] - col[a])
    part1 += sorted[0]
    part2 += sorted[sorted.length - 1]
  })

  return { part1, part2 }
}
