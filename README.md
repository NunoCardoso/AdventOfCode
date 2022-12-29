## options: 

year: string, mandatory => chooses the year 
day: string, mandatory => chooses the day 
logLevel ?: string => sets log level
ui ?: boolean => turns on UI
time: boolean => console logs time to produce answers
test ?: Test | Array<Test> => runs tests
prod ?: Prod => runs final 

### Test

id: test id, tied to the test input file name
skip ?: boolean 
options: options for the test
part 1: test part 1  
part 2: test part 2 

### Prod

skip ?: boolean
part 1: test part 1  
part 2: test part 2 
