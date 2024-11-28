export type Point = [number, number]

export type PointPlus<T = number> = [number, number, T?]

export type Range = [number, number]

export type Path = Array<Point>

export type Dimension = [number, number]

export type BoundingBox = [Point, Point]

export type World<T = number> = Array<Array<T>>
