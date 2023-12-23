export default async (lineReader: any) => {
  let rawCount = 0
  let processedCount1 = 0
  let processedCount2 = 0

  for await (const line of lineReader) {
    const processedLine = line
      .replaceAll(/\\x[0-9a-f][0-9a-f]/g, '_')
      .replaceAll(/\\"/g, '"')
      .replaceAll(/\\\\/g, '\\')
      .match(/^"(.*)"$/)[1]
    rawCount += line.length
    processedCount1 += processedLine.length
    processedCount2 += JSON.stringify(line).length
  }

  return {
    part1: rawCount - processedCount1,
    part2: processedCount2 - rawCount
  }
}
