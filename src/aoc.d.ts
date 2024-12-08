export type Params = Record<string, any>

export type Answers = {
  part1?: string | number
  part2?: string | number
}

export type UI = {
  show?: boolean
  wait?: number
  during?: boolean
  end?: boolean
}

export type Prod = {
  params?: Params
  answers: Answers
}

export type Test = Prod & {
  id: string
}

export type Status = 'inProgress' | 'done' | 'canBeImproved'

export type Config = {
  year: string
  day: string
  title?: string
  comment?: string
  tags?: string
  status?: Status
  difficulty: number
}

export type Puzzle = {
  config: Config
  mode?: string
  logLevel?: string
  ui?: UI
  test?: Test | Array<Test>
  prod?: Prod
  params?: Params
}

export type Result = {
  config: Config
  time: number
  mode: string
  part1: {
    skip?: boolean
    status: string
  }
  part2: {
    skip?: boolean
    status: string
  }
}
