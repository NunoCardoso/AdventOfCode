export default async (lineReader: any) => {
  let part1 = Number.MAX_SAFE_INTEGER
  let part2 = Number.MAX_SAFE_INTEGER

  let minPosition: number = Number.MAX_SAFE_INTEGER
  let maxPosition: number = Number.MIN_SAFE_INTEGER

  const positions: Map<number, number> = new Map()

  for await (const line of lineReader)
    line
      .split(',')
      .map(Number)
      .forEach((position: number) => {
        if (position < minPosition) minPosition = position
        if (position > maxPosition) maxPosition = position
        positions.set(position, (positions.get(position) ?? 0) + 1)
      })

  for (let referencePosition = minPosition; referencePosition <= maxPosition; referencePosition++) {
    let fuelSpentPart1: number = 0
    let fuelSpentPart2: number = 0
    ;[...positions.keys()].forEach((thisPosition) => {
      const distance = Math.abs(thisPosition - referencePosition)
      fuelSpentPart1 += distance * positions.get(thisPosition)!
      fuelSpentPart2 +=
        (distance + ((distance - 1) * (distance - 1) + (distance - 1)) / 2) * positions.get(thisPosition)!
    })

    if (fuelSpentPart1 < part1) part1 = fuelSpentPart1
    if (fuelSpentPart2 < part2) part2 = fuelSpentPart2
  }

  return { part1, part2 }
}
