export default async (lineReader: any) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const dimensions: number[] = line
      .match(/\d+/g)
      .map(Number)
      .sort((a: number, b: number) => a - b)
    const width: number = dimensions[0] * dimensions[1]
    const height: number = dimensions[0] * dimensions[2]
    const depth: number = dimensions[1] * dimensions[2]
    part1 += 2 * width + 2 * height + 2 * depth + Math.min(width, height, depth)
    part2 += 2 * dimensions[0] + 2 * dimensions[1] + dimensions[0] * dimensions[1] * dimensions[2]
  }

  return { part1, part2 }
}
