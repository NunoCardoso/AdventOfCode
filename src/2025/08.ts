import { Params } from 'aoc.d'
import { intersect } from 'util/array'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  type JunctionBox = [number, number, number, number]
  type Distance = { id: string; distance: number }
  let junctionBoxes: JunctionBox[] = []
  let distances: Distance[] = []
  let index = 0
  for await (const line of lineReader) {
    junctionBoxes.push([index, ...line.split(',').map(Number)] as JunctionBox)
    index++
  }
  //console.log(junctionBoxes)

  const getDistance = (a: JunctionBox, b: JunctionBox) =>
    Math.sqrt((a[1] - b[1]) * (a[1] - b[1]) + (a[2] - b[2]) * (a[2] - b[2]) + (a[3] - b[3]) * (a[3] - b[3]))

  for (let i = 0; i < junctionBoxes.length - 1; i++) {
    for (let j = i + 1; j < junctionBoxes.length; j++) {
      let id = junctionBoxes[i][0] + '-' + junctionBoxes[j][0]
      distances.push({ id, distance: getDistance(junctionBoxes[i], junctionBoxes[j]) })
    }
  }

  distances.sort((a, b) => a.distance - b.distance)

  //console.log(distances)

  const getJunctions = (closestJunctionIds: string[]) => {
    let ids = closestJunctionIds.map(Number)
    //console.log(ids)
    let junctions = junctionBoxes.filter((j) => ids.includes(j[0]))
    //console.log(junctions)
    return junctions
  }

  let iterations = params.iterations
  let circuitMap: Record<string, string[]> = {} // iteration id , list of junctions
  let closestJunctionIds: string[]
  //console.log(iterations)
  do {
    iterations--
    if (!circuitMap['' + iterations]) circuitMap['' + iterations] = []
    let closestJunction = distances.shift() as Distance
    closestJunctionIds = closestJunction.id.split('-')
    // all iterations that have once of the junctionIds
    Object.keys(circuitMap)
      .filter((iterationId) => intersect(closestJunctionIds, circuitMap[iterationId]).length > 0)
      .forEach((iterationId) => {
        circuitMap[iterationId].forEach((id) => {
          if (!circuitMap['' + iterations].includes(id)) circuitMap['' + iterations].push(id)
        })
        delete circuitMap[iterationId]
      })
    // console.log('closestJunctionIds', closestJunctionIds)
    closestJunctionIds?.forEach((id) => {
      if (!circuitMap['' + iterations].includes(id)) circuitMap['' + iterations].push(id)
    })

    if (iterations === 0) {
      let sorted = Object.values(circuitMap).sort((a, b) => b.length - a.length)
      //console.log(sorted)
      part1 = sorted.slice(0, 3).reduce((acc, val) => acc * val.length, 1)
    }
    //console.log('circuitMap', circuitMap ,'it', iterations, 'junction', getJunctions(closestJunctionIds) )
  } while (
    iterations > 0 ||
    Object.keys(circuitMap).length > 1 ||
    Object.values(circuitMap)[0].length !== junctionBoxes.length
  )
  //console.log(closestJunctionIds)

  let junctions = getJunctions(closestJunctionIds)
  part2 = junctions[0][1] * junctions[1][1]

  return { part1, part2 }
}
