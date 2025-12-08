import { Params } from 'aoc.d'
import { Dimension, World } from 'declarations'

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let world: World<string> = []

  let initialBeam: number = 0
  for await (const line of lineReader) {
    if (line.match('S')) {
      initialBeam = line.indexOf('S')
      line.replace('S', '.')
    }
    world.push(line.split(''))
  }

  const solveFor = (): number => {
    let beams: number[] = [initialBeam]
    let hits = 0

    world.forEach((row) => {
      let newBeams = new Set<number>()
      beams.forEach((beamIndex) => {
        if (row[beamIndex] === '^') {
          hits++
          if (beamIndex > 0) newBeams.add(beamIndex - 1)
          if (beamIndex < row.length - 1) newBeams.add(beamIndex + 1)
        } else {
          newBeams.add(beamIndex)
        }
      })
      beams = [...newBeams].sort((a, b) => a - b)
    })
    return hits
  }

  const recurse = (
    world: World<string>,
    worldIndex: number,
    beamIndex: number,
    cache: Record<string, number>
  ): number => {
    // the final one, beam left
    let key = worldIndex + '-' + beamIndex
    if (cache[key]) return cache[key]
    if (worldIndex >= world.length) {
      cache[key] = 1
      return 1
    }
    if (world[worldIndex][beamIndex] === '^') {
      if (beamIndex > 0 && beamIndex < world[worldIndex].length - 1) {
        cache[key] =
          recurse(world, worldIndex + 1, beamIndex - 1, cache) + recurse(world, worldIndex + 1, beamIndex + 1, cache)
      } else if (beamIndex === 0) {
        cache[key] = recurse(world, worldIndex + 1, beamIndex + 1, cache)
      } else if (beamIndex === world[worldIndex].length - 1) {
        cache[key] = recurse(world, worldIndex + 1, beamIndex - 1, cache)
      }
    } else {
      cache[key] = recurse(world, worldIndex + 1, beamIndex, cache)
    }
    return cache[key]
  }

  if (!params.skipPart1) part1 = solveFor()
  if (!params.skipPart2) part2 = recurse(world, 0, initialBeam, {})

  return { part1, part2 }
}
