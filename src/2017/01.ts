export default async (lineReader: any) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const values: number[] = line.split('').map(Number)
    values.forEach((val, i) => {
      const nextIndex = (i + 1) % values.length
      const nextHalfIndex = (i + values.length / 2) % values.length
      if (val === values[nextIndex]) part1 += val
      if (val === values[nextHalfIndex]) part2 += val
    })
  }

  return { part1, part2 }
}
