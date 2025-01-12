import { Params } from 'aoc.d'

type Recipe = [capacity: number, durability: number, flavor: number, texture: number, calories: number]
type Portions = number[]
type Balance = Recipe
type Data = {
  scorePart1: number
  scorePart2: number
  calories: {
    part2: number
  }
}

export default async (lineReader: any, params: Params) => {
  let part1: number = 0
  let part2: number = 0

  const recipes: Recipe[] = []
  for await (const line of lineReader) {
    const m = line.match(/^(.*): capacity (.*), durability (.*), flavor (.*), texture (.*), calories (.*)$/)
    recipes.push([+m[2], +m[3], +m[4], +m[5], +m[6]])
  }

  const calculateIngredient = (amount: number, pleasureness: number) => amount * pleasureness

  const calculateBalance = (portions: Portions, recipes: Recipe[], data: Data) => {
    let balancePart1: Balance = [0, 0, 0, 0, 0],
      balancePart2: Balance = [0, 0, 0, 0, 0]
    portions.forEach((portion: number, index: number) => {
      balancePart1[0] += calculateIngredient(portion, recipes[index][0])
      balancePart2[0] += calculateIngredient(portion, recipes[index][0])
      balancePart1[1] += calculateIngredient(portion, recipes[index][1])
      balancePart2[1] += calculateIngredient(portion, recipes[index][1])
      balancePart1[2] += calculateIngredient(portion, recipes[index][2])
      balancePart2[2] += calculateIngredient(portion, recipes[index][2])
      balancePart1[3] += calculateIngredient(portion, recipes[index][3])
      balancePart2[3] += calculateIngredient(portion, recipes[index][3])
      balancePart2[4] += calculateIngredient(portion, recipes[index][4])
    })
    if (balancePart2[4] !== data.calories.part2) balancePart2 = [0, 0, 0, 0, 0]
    balancePart1.pop()
    balancePart2.pop()
    let bPart1 = balancePart1.reduce((acc: number, val: number) => acc * (val < 0 ? 0 : val), 1)
    let bPart2 = balancePart2.reduce((acc: number, val: number) => acc * (val < 0 ? 0 : val), 1)
    if (data.scorePart1 < bPart1) data.scorePart1 = bPart1
    if (data.scorePart2 < bPart2) data.scorePart2 = bPart2
  }

  const generatePortions = (recipeSlots: number[], remaining: number, portions: number[], data: Data) => {
    if (recipeSlots.length > 1) {
      for (let i = recipeSlots[0]; i <= remaining; i++)
        generatePortions(recipeSlots.slice(1, recipeSlots.length), remaining - i, portions.concat(i), data)
    } else {
      portions.push(100 - portions.reduce((a, b) => a + b))
      calculateBalance(portions, recipes, data)
    }
  }

  const recipeSlots: number[] = new Array(recipes.length).fill(0)
  const data: Data = { scorePart1: 0, scorePart2: 0, calories: params.calories }
  generatePortions(recipeSlots, 100, [], data)
  part1 = data.scorePart1
  part2 = data.scorePart2

  return { part1, part2 }
}
