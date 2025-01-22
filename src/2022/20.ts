import { Params } from 'aoc.d'
import { range } from 'util/range'

export const getNewIndex = (currentIndex: number, delta: number, listLength: number) => {
  if (delta === 0) return currentIndex
  const modifiedDelta = delta % (listLength - 1)
  let newIndex = currentIndex + modifiedDelta
  if (currentIndex + modifiedDelta <= 0) {
    while (newIndex <= 0) {
      newIndex += listLength
      if (newIndex < currentIndex + 2) newIndex -= 1
    }
  } else if (currentIndex + modifiedDelta >= listLength) {
    newIndex = currentIndex + modifiedDelta
    while (newIndex >= listLength) {
      newIndex -= listLength
      newIndex += 1
    }
    if (newIndex > currentIndex) newIndex += 1
  } else if (currentIndex + modifiedDelta > 0 && currentIndex + modifiedDelta < listLength) {
    if (newIndex > currentIndex) newIndex += 1
  }
  return newIndex
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const doMixIn = (coordinates: number[], coordinateIndex: number[]) => {
    for (let nextIndex of range(coordinates.length)) {
      const currentIndex = coordinateIndex.indexOf(nextIndex)
      const coordinate: number = coordinates[currentIndex]
      const newIndex = getNewIndex(currentIndex, coordinate, coordinates.length)
      let temp = coordinates[currentIndex]
      let tempIndex = coordinateIndex[currentIndex]

      if (newIndex > currentIndex) {
        coordinates.splice(newIndex, 0, temp)
        coordinates.splice(currentIndex, 1)
        coordinateIndex.splice(newIndex, 0, tempIndex)
        coordinateIndex.splice(currentIndex, 1)
      } else {
        coordinates.splice(currentIndex, 1)
        coordinates.splice(newIndex, 0, temp)
        coordinateIndex.splice(currentIndex, 1)
        coordinateIndex.splice(newIndex, 0, tempIndex)
      }
    }
    return coordinates
  }

  const getSolution = (coordinates: number[]) => {
    let zeroIndex = coordinates.indexOf(0)
    return (
      coordinates[(zeroIndex + 1000) % coordinates.length] +
      coordinates[(zeroIndex + 2000) % coordinates.length] +
      coordinates[(zeroIndex + 3000) % coordinates.length]
    )
  }

  const coordinates: number[] = []
  let coordinatesPart2: number[] = []
  for await (const line of lineReader) {
    coordinates.push(+line)
    coordinatesPart2.push(+line * params!.decriptionKey)
  }

  const coordinatesIndex = range(coordinates.length)
  const coordinatesIndexPart2: number[] = [...coordinatesIndex]

  doMixIn(coordinates, coordinatesIndex)
  part1 = getSolution(coordinates)

  for (let i of range(10)) doMixIn(coordinatesPart2, coordinatesIndexPart2)
  part2 = getSolution(coordinatesPart2)

  return { part1, part2 }
}
