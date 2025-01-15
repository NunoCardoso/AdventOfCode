export type Location = [row: number, col: number]

// deprecated
export type LocationPlus<T = number> = [row: number, col: number, T]

export type Direction = '<' | '>' | '^' | 'v'

export type Range = [from: number, to: number]

export type Dimension = [height: number, width: number]

export type BoundingBox = [topleft: Location, bottomright: Location]

export type World<T = number> = T[][]
// alias
export type Grid<T = number> = World<T>
