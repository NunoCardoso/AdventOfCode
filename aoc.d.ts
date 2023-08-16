export type Params = Record<string, any>

export type Part = {
  skip?: boolean
  params?: Params
  answer?: string | number
}

export type UI = {
  show?: boolean
  wait?: number
  during?: boolean
  end?: boolean
}

export type Prod = {
  skip?: boolean
  params?: Params
  part1?: Part
  part2?: Part
}

export type Test = Prod & {
  id: string
}

export type Config = {
  year: string
  day: string
  mode?: string
  params?: Params
  logLevel?: string
  ui?: UI
  time: boolean
  test?: Test | Array<Test>
  prod?: Prod
}
