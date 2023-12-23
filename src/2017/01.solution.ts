export default async (lineReader: any) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const values = line.split('').map(Number)
    for (let i = 0; i < values.length; i++) {
      const j = (i + 1) % values.length
      const k = (i + values.length / 2) % values.length
      if (values[i] === values[j]) part1 += values[i]
      if (values[i] === values[k]) part2 += values[i]
    }
  }

  return { part1, part2 }
}
