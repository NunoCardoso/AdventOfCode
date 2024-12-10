// to use for debug with the UI
//
export const waitForKey = async () => {
  return new Promise<void>((resolve) => {
    console.log('Press enter to continue')
    process.stdin.resume()
    process.stdin.on('data', function (chunk) {
      if (chunk.toString() === '\n') {
        resolve()
        process.stdin.pause()
      }
    })
  })
}

export const waitSeconds = async (amount: number) =>
  await new Promise((resolve) => setTimeout(resolve, amount ?? 100))
