import { Range } from 'declarations'

// merge ranges, as in [[1,10],[5,15],[20,30],[31,40]] => [[1,15],[20,40]]
export const mergeRange = (ranges: Array<Range>, doAdjacents: boolean = true) => {
  const result: Array<Range> = []
  let last: Range
  ranges.forEach((range) => {
    if (!last || range[0] - last[1] > (doAdjacents ? 1 : 0)) result.push((last = range))
    else if (range[1] > last[1]) last[1] = range[1]
  })
  return result
}

export const range = (size: number, startAt: number = 0): number[] =>
  Array(size)
    .fill(0)
    .map((_, i) => i + startAt)

export const rangeFromToInclusive = (from: number, to: number): number[] =>
  Array(to - from + 1)
    .fill(0)
    .map((_, i) => i + from)
