import { Range } from 'declarations'

// merge ranges, as in [[1,10],[5,15],[20,30],[31,40]] => [[1,15],[20,40]]
export const mergeRange = (ranges: Range[], doAdjacents: boolean = true) => {
  if (!ranges.length) return []
  const sorted = [...ranges].sort((a, b) => a[0] - b[0])

  const merged: Range[] = []
  let [currentStart, currentEnd] = sorted[0]

  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i]

    if (start <= currentEnd + (doAdjacents ? 1 : 0)) {
      currentEnd = Math.max(currentEnd, end)
    } else {
      merged.push([currentStart, currentEnd])
      currentStart = start
      currentEnd = end
    }
  }

  merged.push([currentStart, currentEnd])
  return merged
}

export const range = (size: number, startAt: number = 0): number[] =>
  Array(size)
    .fill(0)
    .map((_, i) => i + startAt)

export const rangeFromToInclusive = (from: number, to: number): number[] =>
  Array(to - from + 1)
    .fill(0)
    .map((_, i) => i + from)
