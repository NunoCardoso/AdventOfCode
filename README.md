# How to run

    cd {year}
    ts-node {day}

that will look into `{year}/{day}.ts` as the config file.

## options: 

* year: string, mandatory => chooses the year 
* day: string, mandatory => chooses the day 
* logLevel ?: string => sets log level (info, debug, etc) default: info
* mode => if there is another solution (fastest, easiest, etc) default: normal 
* ui ?: boolean => turns on UI. default: { show: false }
* time: boolean => console logs time to produce answers. default: true
* test ?: Test | Array<Test> => runs tests
* prod ?: Prod => runs final.  
* params: generic

### Test

id: test id, tied to the test input file name
skip ?: boolean 
options: options for the test
part 1: test part 1  
part 2: test part 2 

### Prod

skip ?: boolean
part 1: Prod => prod part 1  
part 2: Prod => prod part 2 
ß