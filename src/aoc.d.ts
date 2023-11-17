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
  skip?: boolean | string
  params?: Params
  answers?: Answers
}

export type Test = Prod & {
  id: string
}

export type Config = {
  year: string
  day: string
  mode?: string
  logLevel?: string
  ui?: UI
  time: boolean
  test?: Test | Array<Test>
  prod?: Prod
  params?: Params
}
