import { Point } from '../declaration.d'

export const lineIntersect = (a: [Point, Point], b: [Point, Point]): Point | undefined => {
  // Check if none of the lines are of length 0
  if ((a[0][0] === a[1][0] && a[0][1] === a[1][1]) || (b[0][0] === b[1][0] && b[0][1] === b[1][1])) {
    return undefined
  }
  const denominator = (b[1][1] - b[0][1]) * (a[1][0] - a[0][0]) - (b[1][0] - b[0][0]) * (a[1][1] - a[0][1])
  // Lines are parallel
  if (denominator === 0) return undefined
  const ua = ((b[1][0] - b[0][0]) * (a[0][1] - b[0][1]) - (b[1][1] - b[0][1]) * (a[0][0] - b[0][0])) / denominator
  const ub = ((a[1][0] - a[0][0]) * (a[0][1] - b[0][1]) - (a[1][1] - a[0][1]) * (a[0][0] - b[0][0])) / denominator
  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return undefined

  const x = a[0][0] + ua * (a[1][0] - a[0][0])
  const y = a[0][1] + ua * (a[1][1] - a[0][1])
  return [x, y]
}
