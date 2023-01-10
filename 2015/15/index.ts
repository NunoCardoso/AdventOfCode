import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  type Recipe = [number, number, number, number, number]
  type Portions = Array<number>
  type Recipes = Array<Recipe>
  type Result = Array<number>
  let part1: number = 0; let part2: number = 0

  const recipes: Recipes = []
  for await (const line of lineReader) {
    const m = line.match(/^(.*): capacity (.*), durability (.*), flavor (.*), texture (.*), calories (.*)$/)
    recipes.push([parseInt(m[2]), parseInt(m[3]), parseInt(m[4]), parseInt(m[5]), parseInt(m[6])])
  }

  const calculateIngredient = (amount: number, pleasureness: number) => {
    return amount * pleasureness
  }

  const calculateBalance = (portions: Portions, recipes: Recipes, calorieTarget: undefined | number) => {
    const res: Result = [0, 0, 0, 0, 0]
    portions.forEach((portion: number, index: number) => {
      res[0] += calculateIngredient(portion, recipes[index][0])
      res[1] += calculateIngredient(portion, recipes[index][1])
      res[2] += calculateIngredient(portion, recipes[index][2])
      res[3] += calculateIngredient(portion, recipes[index][3])
      if (calorieTarget !== undefined) {
        res[4] += calculateIngredient(portion, recipes[index][4])
      }
    })

    if (calorieTarget !== undefined) {
      if (res[4] !== calorieTarget) {
        res[3] = 0 // I will set one of them as 0, to make the total as 0
      }
    }
    res.pop() // remove calories from final equation
    return _.reduce(res, (memo: number, val: number) => (
      memo * (val < 0 ? 0 : val)
    ), 1)
  }

  const getThemRecipes = (calories: any) => {
    const iterators: Array<number> = new Array(recipes.length).fill(0)
    let res = 0

    const doIterations = (iterators: Array<number>, remaining: number, portions: Array<number>, calorieTarget: undefined | number) => {
      if (iterators.length > 1) {
        for (let i = iterators[0]; i <= remaining; i++) {
          doIterations(iterators.slice(1, iterators.length), remaining - i, portions.concat(i), calorieTarget)
        }
      } else {
        portions.push(100 - _.sum(portions))
        const val = calculateBalance(portions, recipes, calorieTarget)
        if (val > res) {
          res = val
        }
      }
    }

    doIterations(iterators, 100, [], calories)
    return res
  }

  part1 = getThemRecipes(params.part1.calories)
  part2 = getThemRecipes(params.part2.calories)

  return { part1, part2 }
}
