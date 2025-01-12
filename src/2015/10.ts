import { Params } from 'aoc.d'

export const sequenceHash = [
  { pattern: 'notused', to: [] },
  { pattern: '1112', to: [63] },
  { pattern: '1112133', to: [64, 62] },
  { pattern: '111213322112', to: [65] },
  { pattern: '111213322113', to: [66] },
  { pattern: '1113', to: [68] },
  { pattern: '11131', to: [69] },
  { pattern: '111311222112', to: [84, 55] },
  { pattern: '111312', to: [70] },
  { pattern: '11131221', to: [71] },
  { pattern: '1113122112', to: [76] },
  { pattern: '1113122113', to: [77] },
  { pattern: '11131221131112', to: [82] },
  { pattern: '111312211312', to: [78] },
  { pattern: '11131221131211', to: [79] },
  { pattern: '111312211312113211', to: [80] },
  { pattern: '111312211312113221133211322112211213322112', to: [81, 29, 91] },
  { pattern: '111312211312113221133211322112211213322113', to: [81, 29, 90] },
  { pattern: '11131221131211322113322112', to: [81, 30] },
  { pattern: '11131221133112', to: [75, 29, 92] },
  { pattern: '1113122113322113111221131221', to: [75, 32] },
  { pattern: '11131221222112', to: [72] },
  { pattern: '111312212221121123222112', to: [73] },
  { pattern: '111312212221121123222113', to: [74] },
  { pattern: '11132', to: [83] },
  { pattern: '1113222', to: [86] },
  { pattern: '1113222112', to: [87] },
  { pattern: '1113222113', to: [88] },
  { pattern: '11133112', to: [89, 92] },
  { pattern: '12', to: [1] },
  { pattern: '123222112', to: [3] },
  { pattern: '123222113', to: [4] },
  { pattern: '12322211331222113112211', to: [2, 61, 29, 85] },
  { pattern: '13', to: [5] },
  { pattern: '131112', to: [28] },
  { pattern: '13112221133211322112211213322112', to: [24, 33, 61, 29, 91] },
  { pattern: '13112221133211322112211213322113', to: [24, 33, 61, 29, 90] },
  { pattern: '13122112', to: [7] },
  { pattern: '132', to: [8] },
  { pattern: '13211', to: [9] },
  { pattern: '132112', to: [10] },
  { pattern: '1321122112', to: [21] },
  { pattern: '132112211213322112', to: [22] },
  { pattern: '132112211213322113', to: [23] },
  { pattern: '132113', to: [11] },
  { pattern: '1321131112', to: [19] },
  { pattern: '13211312', to: [12] },
  { pattern: '1321132', to: [13] },
  { pattern: '13211321', to: [14] },
  { pattern: '132113212221', to: [15] },
  { pattern: '13211321222113222112', to: [18] },
  { pattern: '1321132122211322212221121123222112', to: [16] },
  { pattern: '1321132122211322212221121123222113', to: [17] },
  { pattern: '13211322211312113211', to: [20] },
  { pattern: '1321133112', to: [6, 61, 29, 92] },
  { pattern: '1322112', to: [26] },
  { pattern: '1322113', to: [27] },
  { pattern: '13221133112', to: [25, 29, 92] },
  { pattern: '1322113312211', to: [25, 29, 67] },
  { pattern: '132211331222113112211', to: [25, 29, 85] },
  { pattern: '13221133122211332', to: [25, 29, 68, 61, 29, 89] },
  { pattern: '22', to: [61] },
  { pattern: '3', to: [33] },
  { pattern: '3112', to: [40] },
  { pattern: '3112112', to: [41] },
  { pattern: '31121123222112', to: [42] },
  { pattern: '31121123222113', to: [43] },
  { pattern: '3112221', to: [38, 39] },
  { pattern: '3113', to: [44] },
  { pattern: '311311', to: [48] },
  { pattern: '31131112', to: [54] },
  { pattern: '3113112211', to: [49] },
  { pattern: '3113112211322112', to: [50] },
  { pattern: '3113112211322112211213322112', to: [51] },
  { pattern: '3113112211322112211213322113', to: [52] },
  { pattern: '311311222', to: [47, 38] },
  { pattern: '311311222112', to: [47, 55] },
  { pattern: '311311222113', to: [47, 56] },
  { pattern: '3113112221131112', to: [47, 57] },
  { pattern: '311311222113111221', to: [47, 58] },
  { pattern: '311311222113111221131221', to: [47, 59] },
  { pattern: '31131122211311122113222', to: [47, 60] },
  { pattern: '3113112221133112', to: [47, 33, 61, 29, 92] },
  { pattern: '311312', to: [45] },
  { pattern: '31132', to: [46] },
  { pattern: '311322113212221', to: [53] },
  { pattern: '311332', to: [38, 29, 89] },
  { pattern: '3113322112', to: [38, 30] },
  { pattern: '3113322113', to: [38, 31] },
  { pattern: '312', to: [34] },
  { pattern: '312211322212221121123222113', to: [36] },
  { pattern: '312211322212221121123222112', to: [35] },
  { pattern: '32112', to: [37] }
]

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const limit = Math.max(params.limit.part1, params.limit.part2)

  const calculateLength = (patterns: number[]) =>
    patterns.reduce((acc, pattern) => acc + sequenceHash[pattern].pattern.length, 0)

  let iterations = 1
  let startIndex = sequenceHash.findIndex((s) => s.pattern === params.input)
  let patterns: number[] = [startIndex]
  while (iterations <= limit) {
    patterns = patterns.map((pattern) => sequenceHash[pattern].to).flat()
    if (iterations === params.limit.part1) part1 = calculateLength(patterns)
    if (iterations === params.limit.part2) part2 = calculateLength(patterns)
    iterations++
  }

  return { part1, part2 }
}
