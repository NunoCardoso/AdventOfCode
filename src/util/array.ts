export const intersect = <T extends any>(a: Array<T>, b: Array<T>) => {
  const setB = new Set(b)
  return [...new Set(a)].filter((x) => setB.has(x))
}
