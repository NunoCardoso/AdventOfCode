import * as path from 'path'
var cp = require('child_process')

if (process.argv[2]?.length !== 4 && !process.argv[2]?.startsWith('20')) {
  console.error("usage: ts-node makePuzzle {year} {day}")
  process.exit()
}

if (process.argv[3]?.length !== 2) {
  console.error("usage: ts-node makePuzzle {year} {day}")
  process.exit()
}

cp.fork(path.join(__dirname , '/src/', process.argv[2] + '/' + process.argv[3] ))
