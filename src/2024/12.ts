import { Params } from 'aoc.d'
import { Point, PointPlus, World } from 'declarations'

type Gardens = Record<string, Point[]>
type Farm = World<string>
export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  let farm: Farm = []
  let gardenPlots: Set<string> = new Set() // set is easier to delete entries
  let rowCount = 0
  for await (const line of lineReader) {
    let farmLine = line.split('')
    farmLine.forEach((val: string, colIndex: number) => gardenPlots.add(rowCount + ',' + colIndex))
    farm.push(farmLine)
    rowCount++
  }

  const isSame = (p: Point, p2: Point) => p[0] === p2[0] && p[1] === p2[1]

  const getMorePlots = (plant: string, headPlot: Point, visitedPlots: Point[]): Point[] => {
    return (
      [
        [headPlot[0] - 1, headPlot[1]],
        [headPlot[0] + 1, headPlot[1]],
        [headPlot[0], headPlot[1] + 1],
        [headPlot[0], headPlot[1] - 1]
      ] as Point[]
    ).filter(
      (point) =>
        point[0] >= 0 &&
        point[0] < farm.length &&
        point[1] >= 0 &&
        point[1] < farm[0].length &&
        farm[point[0]][point[1]] === plant &&
        !visitedPlots.find((p) => isSame(p, point))
    )
  }

  const findGarden = (
    plant: string,
    openedPlots: Point[],
    visitedPlots: Point[],
    gardenPlots: Set<string>
  ) => {
    let headPlot = openedPlots.splice(-1)[0]
    visitedPlots.push(headPlot)
    gardenPlots.delete(headPlot[0] + ',' + headPlot[1])
    let newPlots: Point[] = getMorePlots(plant, headPlot, visitedPlots)
    newPlots.forEach((plot) => {
      if (!openedPlots.find((p) => isSame(p, plot))) openedPlots.push(plot)
    })
  }

  const getNeighborsAndNonWorld = (point: Point, plant: string, farm: Farm): PointPlus<string>[] =>
    (
      [
        [point[0] - 1, point[1], '^'],
        [point[0] + 1, point[1], 'v'],
        [point[0], point[1] + 1, '>'],
        [point[0], point[1] - 1, '<']
      ] as PointPlus<string>[]
    ).filter(
      (point) =>
        point[0] < 0 ||
        point[0] >= farm.length ||
        point[1] < 0 ||
        point[1] >= farm[0].length ||
        farm[point[0]][point[1]] !== plant
    )

  const calculateAreaAndPerimeter = (gardens: Gardens, farm: Farm) =>
    Object.keys(gardens).reduce((acc, gardenKey) => {
      let plant = gardenKey.split(':')[0]
      let gardenPlots = gardens[gardenKey]
      let gardenArea = gardenPlots.length
      let gardenPerimeter = gardenPlots.reduce(
        (acc, point) => acc + getNeighborsAndNonWorld(point, plant, farm).length,
        0
      )
      return acc + gardenArea * gardenPerimeter
    }, 0)

  const getGardenSides = (plant: string, gardenPlots: Point[], farm: Farm): number => {
    let fences: PointPlus<string>[][] = []
    gardenPlots.forEach((plot: Point) => {
      getNeighborsAndNonWorld(plot, plant, farm).forEach((neighborPlot) => {
        let index = fences.findIndex((fence: PointPlus<string>[]) =>
          fence.find(
            (_plot: PointPlus<string>) =>
              ((Math.abs(_plot[0] - neighborPlot[0]) === 1 && _plot[1] - neighborPlot[1] === 0) ||
                (Math.abs(_plot[1] - neighborPlot[1]) === 1 && _plot[0] - neighborPlot[0] === 0)) &&
              _plot[2] === neighborPlot[2]
          )
        )
        index < 0 ? fences.push([neighborPlot]) : fences[index].push(neighborPlot)
      })
    })
    return fences.length
  }

  const calculateAreaAndPrice = (gardens: Gardens, farm: Farm) =>
    Object.keys(gardens).reduce((acc, gardenKey) => {
      let plant = gardenKey.split(':')[0]
      // sort is important so I can calculate manhattan distances on adjacent points
      let gardenPlots = gardens[gardenKey].sort((a, b) =>
        a[0] - b[0] < 0 ? -1 : a[0] - b[0] > 0 ? 1 : a[1] - b[1]
      )
      let gardenArea = gardenPlots.length
      let gardenSides = getGardenSides(plant, gardenPlots, farm)
      return acc + gardenArea * gardenSides
    }, 0)

  let gardens: Gardens = {}
  while (gardenPlots.size > 0) {
    let plot = [...gardenPlots].shift()!
    let plotLocation: Point = plot.split(',').map(Number) as Point
    let plant = farm[plotLocation[0]][plotLocation[1]]
    let openedPlots: Point[] = [plotLocation]
    let visitedPlots: Point[] = []
    while (openedPlots.length > 0) findGarden(plant, openedPlots, visitedPlots, gardenPlots)
    gardens[plant + ':' + plot] = visitedPlots
  }

  if (!params.skipPart1) part1 = calculateAreaAndPerimeter(gardens, farm)

  if (!params.skipPart2) part2 = calculateAreaAndPrice(gardens, farm)

  return { part1, part2 }
}
