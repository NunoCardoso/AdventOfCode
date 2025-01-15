// action, amount
type Command = [string, number]

export default async (lineReader: any) => {
  const commands: Command[] = []

  for await (const line of lineReader) {
    const [left, right] = line.split(' ')
    commands.push([left, +right])
  }

  let distance: number = 0
  let depthPart1: number = 0
  let depthPart2: number = 0
  let aim: number = 0

  for (let command of commands) {
    if (command[0] === 'forward') {
      distance += command[1]
      depthPart2 += command[1] * aim
    }
    if (command[0] === 'up') {
      aim += -1 * command[1]
      depthPart1 += -1 * command[1]
    }
    if (command[0] === 'down') {
      aim += command[1]
      depthPart1 += command[1]
    }
  }

  return {
    part1: depthPart1 * distance,
    part2: depthPart2 * distance
  }
}
