import { exec } from 'node:child_process'
import * as fs from 'fs'
import * as path from 'path'

if (
  process.argv[2]?.length !== 4 &&
  !process.argv[2]?.startsWith('20') &&
  !process.argv[3]?.match(/^\d+$/) &&
  !(process.argv[2]?.length > 0)
) {
  console.error('usage: ts-node makePuzzle {year} {day} {title}')
  process.exit()
}

let year = process.argv[2]
let day = process.argv[3]
let day2digit = process.argv[3].padStart(2, '0')
let title = process.argv[4]

// fix year dir
let newFileDirPath = path.join(__dirname, '/src/', year, '/')
if (!fs.existsSync(newFileDirPath)) fs.mkdirSync(newFileDirPath)

// fix input dir
let newInputDirPath = path.join(__dirname, '/input/', year, '/')
if (!fs.existsSync(newInputDirPath)) fs.mkdirSync(newInputDirPath)

// check if config exists
let newFileConfigPath = path.join(__dirname, '/src/', year, '/', day2digit + '.config.ts')
if (fs.existsSync(newFileConfigPath)) {
  console.error('Error: ' + newFileConfigPath + ' exists')
  process.exit()
}

// make input.txt
let newInputFilePath = path.join(__dirname, '/input/', year, '/', day2digit + '.input.txt')

// read cookie info
let session = fs.readFileSync(path.join(__dirname, '.aocrc'), 'utf8')

exec(`curl 'https://adventofcode.com/${year}/day/${day}/input' -H 'Cookie: session=${session}' > ${newInputFilePath}`)

// make test.txt
let newTextFilePath = path.join(__dirname, '/input/', year, '/', day2digit + '.test.txt')
let file = fs.openSync(newTextFilePath, 'a')
fs.closeSync(file)

// make puzzle file
let newFilePuzzlePath = path.join(__dirname, '/src/', year, '/', day2digit + '.ts')
fs.copyFileSync(path.join(__dirname, '/src/', 'template', '/', 'index.ts'), newFilePuzzlePath)

// make config file
let content = fs.readFileSync(__dirname + '/src/template/config.ts.template', 'utf8')
content = content
  .replace(/\{\{year}}/g, year)
  .replace(/\{\{day}}/g, day)
  .replace(/\{\{title}}/g, title)

file = fs.openSync(newFileConfigPath, 'a')
fs.writeSync(file, content)
fs.closeSync(file)

// make readme file
content = fs.readFileSync(__dirname + '/src/template/day.readme.md', 'utf8')
content = content.replace(/\{\{day}}/g, day).replace(/\{\{title}}/g, title)

file = fs.openSync(path.join(newFileDirPath, day2digit + '.readme.md'), 'w')
fs.writeSync(file, content)
fs.closeSync(file)
console.log('done')
