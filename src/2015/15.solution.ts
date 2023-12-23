import { Params } from 'aoc.d'

type Recipe = [number, number, number, number, number]
type Portions = Array<number>
type Result = Array<number>
type Data = {
  score: number
  calories?: number
}

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const recipes: Array<Recipe> = []

  for await (const line of lineReader) {
    const m = line.match(/^(.*): capacity (.*), durability (.*), flavor (.*), texture (.*), calories (.*)$/)
    recipes.push([+m[2], +m[3], +m[4], +m[5], +m[6]])
  }

  const calculateIngredient = (amount: number, pleasureness: number) => amount * pleasureness

  const calculateBalance = (
    portions: Portions,
    recipes: Array<Recipe>,
    calorieTarget: undefined | number
  ) => {
    const res: Result = [0, 0, 0, 0, 0]
    portions.forEach((portion: number, index: number) => {
      res[0] += calculateIngredient(portion, recipes[index][0])
      res[1] += calculateIngredient(portion, recipes[index][1])
      res[2] += calculateIngredient(portion, recipes[index][2])
      res[3] += calculateIngredient(portion, recipes[index][3])
      if (calorieTarget) {
        res[4] += calculateIngredient(portion, recipes[index][4])
      }
    })
    if (!!calorieTarget && res[4] !== calorieTarget) {
      res[3] = 0 // I will set one of them as 0, to make the total as 0
    }
    res.pop() // remove calories from final equation
    return res.reduce((acc: number, val: number) => acc * (val < 0 ? 0 : val), 1)
  }

  const generatePortions = (
    recipeSlots: Array<number>,
    remaining: number,
    portions: Array<number>,
    data: Data
  ) => {
    if (recipeSlots.length > 1) {
      for (let i = recipeSlots[0]; i <= remaining; i++) {
        generatePortions(recipeSlots.slice(1, recipeSlots.length), remaining - i, portions.concat(i), data)
      }
    } else {
      portions.push(100 - portions.reduce((a, b) => a + b))
      const balance = calculateBalance(portions, recipes, data.calories)
      if (balance > data.score) data.score = balance
    }
  }

  const solveFor = (calories: number) => {
    const recipeSlots: Array<number> = new Array(recipes.length).fill(0)
    const data: Data = { score: 0, calories }
    generatePortions(recipeSlots, 100, [], data)
    return data.score
  }

  if (!params.skipPart1) {
    part1 = solveFor(params.calories.part1)
  }
  if (!params.skipPart2) {
    part2 = solveFor(params.calories.part2)
  }

  return { part1, part2 }
}
