export default async (lineReader: any) => {
  let part1 = Number.MAX_SAFE_INTEGER
  let part2 = Number.MAX_SAFE_INTEGER

  let minCrab: number = Number.MAX_SAFE_INTEGER
  let maxCrab: number = Number.MIN_SAFE_INTEGER

  const crabs: Map<number, number> = new Map()

  for await (const line of lineReader) {
    line
      .split(',')
      .map(Number)
      .forEach((crab: number) => {
        if (crab < minCrab) minCrab = crab
        if (crab > maxCrab) maxCrab = crab
        crabs.set(crab, (crabs.get(crab) ?? 0) + 1)
      })
  }

  for (let crabIndex = minCrab; crabIndex <= maxCrab; crabIndex++) {
    let fuelSpentPart1: number = 0
    let fuelSpentPart2: number = 0

    Array.from(crabs.keys()).forEach((key) => {
      const distance = Math.abs(key - crabIndex)
      fuelSpentPart1 += distance * crabs.get(key)!
      fuelSpentPart2 += (distance + ((distance - 1) * (distance - 1) + (distance - 1)) / 2) * crabs.get(key)!
    })

    if (fuelSpentPart1 < part1) part1 = fuelSpentPart1
    if (fuelSpentPart2 < part2) part2 = fuelSpentPart2
  }

  return { part1, part2 }
}
