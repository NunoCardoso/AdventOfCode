import * as fs from 'fs'
import * as path from 'path'

if (process.argv[2]?.length !== 4 && !process.argv[2]?.startsWith('20')) {
  console.error('usage: ts-node makePuzzle {year} {day}')
  process.exit()
}

if (process.argv[3]?.length !== 2) {
  console.error('usage: ts-node makePuzzle {year} {day}')
  process.exit()
}

let newFileDirPath = path.join(__dirname, '/src/', process.argv[2] + '/')
if (!fs.existsSync(newFileDirPath)) fs.mkdirSync(newFileDirPath)
let newFilePath = path.join(__dirname, '/src/', process.argv[2] + '/' + process.argv[3] + '.ts')
let newInputDirPath = path.join(__dirname, '/input/', process.argv[2], '/')
if (!fs.existsSync(newInputDirPath)) fs.mkdirSync(newInputDirPath)
if (fs.existsSync(newFilePath)) {
  console.error('Error: ' + newFilePath + ' exists')
  process.exit()
} else {
  // cp index.ts
  fs.copyFileSync(__dirname + '/src/template/index.ts', newFileDirPath + process.argv[3] + '.ts')
  // make input.txt
  let file = fs.openSync(newInputDirPath + process.argv[3] + '.input.txt', 'a')
  fs.closeSync(file)
  // make test.txt
  file = fs.openSync(newInputDirPath + process.argv[3] + '.test.txt', 'a')
  fs.closeSync(file)

  let content = fs.readFileSync(__dirname + '/src/template/xx.ts', 'utf8')
  content = content.replace(/\{\{year}}/g, process.argv[2])
  content = content.replace(/\{\{day}}/g, process.argv[3])

  file = fs.openSync(newFilePath, 'a')
  fs.writeSync(file, content)
  fs.closeSync(file)
  console.log('done')
}
