export type Params = Record<string, any>
export type Result = 'unfinished' | 'finished'
export type Status = 'unsolved' | 'solved'
export type Status = 'slow' | 'medium' | 'fast' | 'md5' | 'unknown'
export type Code = 'clean' | 'dirty'
export type Tag = 'Dijkstra' | 'Recursion' | 'A*' | 'Permutation' | 'MD5' | 'Combination' | 'Breath-first' | 'Depth-first' | 'Path-finding' | 'Bron–Kerbosch'

export type Answer = string | number

export type Answers = {
  part1?: Answer
  part2?: Answer
}

export type UI = {
  show?: boolean
  wait?: number
  during?: boolean
  end?: boolean
  keypress?: boolean
}

export type Prod = {
  params?: Params
  answers: Answers
}

export type Test = Prod & {
  id: string
}

export type Config = {
  title: string
  summary: string
  year: number
  day: number
  tags?: Tag[]
  result: Result
  status: Status
  speed: Speed
  code: Code
  comment: string
  difficulty: number
}

export type PuzzleConfig = {
  config: Config
  mode?: string
  logLevel?: string
  ui?: UI
  test?: Test | Array<Test>
  prod?: Prod
  params?: Params
}

export type PuzzleOutput = {
  id: string
  config: Config
  time: number
  mode: string
  part1: {
    skip?: boolean
    answer?: Answer
    expected?: Answer
  }
  part2: {
    skip?: boolean
    answer?: Answer
    expected?: Answer
  }
}
