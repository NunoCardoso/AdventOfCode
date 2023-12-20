import * as fs from 'fs'
import * as path from 'path'

if (process.argv[2]?.length !== 4 && !process.argv[2]?.startsWith('20')) {
  console.error("usage: ts-node makePuzzle {year} {day}")
  process.exit()
}

if (process.argv[3]?.length !== 2) {
  console.error("usage: ts-node makePuzzle {year} {day}")
  process.exit()
}

let newFilePath = path.join(__dirname , '/src/', process.argv[2] + '/' + process.argv[3] + '.ts')
let newDirPath = path.join(__dirname , '/src/', process.argv[2], '/', process.argv[3])
if (fs.existsSync(newDirPath)) {
  console.error("Error: " + newDirPath + " exists")
  process.exit()
} else {
  // mkdir dir
  fs.mkdirSync(newDirPath)
  // cp index.ts
  fs.copyFileSync(__dirname  + '/src/template/index.ts', newDirPath + '/index.ts')
  // make input.txt
  let file = fs.openSync(newDirPath + '/input.txt', 'a')
  fs.closeSync(file)
  // make test.txt
  file = fs.openSync(newDirPath + '/test.txt', 'a')
  fs.closeSync(file)

  let content = fs.readFileSync(__dirname  + '/src/template/xx.ts','utf8')
  content = content.replace(/\{\{year}}/g, process.argv[2])
  content = content.replace(/\{\{day}}/g, process.argv[3])

  file = fs.openSync(newFilePath, 'a')
  fs.writeSync(file, content)
  fs.closeSync(file)
  console.log('done')
}

