export type Params = Record<string, any>
export type Result = 'unfinished' | 'finished'
export type Status = 'unsolved' | 'solved'
export type Speed = 'slow' | 'medium' | 'fast' | 'md5' | 'unknown'
export type Code = 'clean' | 'dirty'
export type Tag =
  | 'Regex'
  | 'Dijkstra'
  | 'Recursion'
  | 'A*'
  | 'Permutation'
  | 'MD5'
  | 'Combination'
  | 'Breadth-first'
  | 'Depth-first'
  | 'Path-finding'
  | 'Bron–Kerbosch'

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
  year: number
  day: number
  tags?: Tag[]
  result: Result
  status: Status
  speed: Speed
  code: Code
  difficulty: number // 1 - very easy, 2: easy, 3: ok, 4: hard, 5: very hard
}

export type PuzzleConfig = {
  config: Config
  mode?: string
  logLevel?: string
  ui?: UI
  test?: Test | Array<Test>
  prod: Prod
  params?: Params
}

export type PuzzleOutputAnswer = {
  skip?: boolean
  answer?: Answer
  expected?: Answer
}

export type PuzzleOutput = {
  id: string
  config: Config
  time: number
  mode: string
  skipped: boolean
  part1: PuzzleOutputAnswer
  part2: PuzzleOutputAnswer
}
