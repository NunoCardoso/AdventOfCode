import { Params } from 'aoc.d'
import { BoundingBox } from '../declarations'

type Star = [number, number, number, number]

type Step = [Star[], [BoundingBox, number], number]
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: number = 0

  const getBoundingBoxArea = (boundingBox: BoundingBox): number =>
    (boundingBox[1][0] - boundingBox[0][0]) * (boundingBox[1][1] - boundingBox[0][1])

  const getBoundingBox = (stars: Star[]): [BoundingBox, number] => {
    let lowestX: number = Number.MAX_SAFE_INTEGER
    let lowestY: number = Number.MAX_SAFE_INTEGER
    let highestX: number = Number.MIN_SAFE_INTEGER
    let highestY: number = Number.MIN_SAFE_INTEGER
    stars.forEach((star) => {
      if (star[0] < lowestX) lowestX = star[0]
      if (star[0] > highestX) highestX = star[0]
      if (star[1] < lowestY) lowestY = star[1]
      if (star[1] > highestY) highestY = star[1]
    })
    let boundingBox: BoundingBox = [
      [lowestX, lowestY],
      [highestX, highestY]
    ]
    return [boundingBox, getBoundingBoxArea(boundingBox)]
  }

  const runStars = (step: Step): Step => {
    let newStep: Partial<Step> = []
    newStep[0] = step[0].map((star) => [star[0] + star[2], star[1] + star[3], star[2], star[3]])
    newStep[1] = getBoundingBox(newStep[0]!)
    newStep[2] = step[2] + 1
    return newStep as Step
  }

  const render = (step: Step): string => {
    let [stars, [boundingBox]] = step
    let result: string = ''
    for (let y = boundingBox[0][1]; y <= boundingBox[1][1]; y++) {
      for (let x = boundingBox[0][0]; x <= boundingBox[1][0]; x++) {
        if (stars.some((star) => star[0] === x && star[1] === y)) {
          result += '#'
        } else {
          result += '.'
        }
      }
      result += '\n'
    }
    return result
  }

  const solveFor = (initialStars: Star[]): Step => {
    let currentStep: Step = [[...initialStars], getBoundingBox(initialStars), 0]
    let previousStep: Step | null = null
    while (previousStep === null || previousStep[1][1] > currentStep[1][1]) {
      previousStep = currentStep
      currentStep = runStars(previousStep)
    }
    if (params.ui?.show) log.info(render(currentStep))
    return previousStep!
  }

  let stars: Star[] = []

  for await (const line of lineReader) {
    const [, pX, pY, vX, vY] = line
      .match(/position=<\s*([^\s]+),\s*([^\s]+)> velocity=<\s*([^\s]+),\s*([^\s]+)>/)
      .map(Number)
    stars.push([pX, pY, vX, vY])
  }

  const resultStep = solveFor(stars)
  part1 = render(resultStep)
  part2 = resultStep[2]

  return { part1, part2 }
}
