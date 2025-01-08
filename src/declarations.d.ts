// deprecated
export type Location = [number, number]

export type Location = [row: number, col: number]

// deprecated
export type PointPlus<T = number> = [number, number, T?]

export type Range = [from: number, to: number]

export type Dimension = [height: number, width: number]

export type BoundingBox = [topleft: Location, bottomright: Location]

export type World<T = number> = T[][]

// alias
export type Grid<T = number> = T[][]
