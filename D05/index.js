const fs = require('fs');
const logHeaderPrefix = 'AOC2023';
const challengeDayNo = '06';
const challengeTitle = 'Wait For It';

let rawInputData;

try {
  rawInputData = fs.readFileSync(`${__dirname}/D06/input.txt`, 'utf8');
  // rawInputData = fs.readFileSync(`${__dirname}/D06/demo.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`);
  console.error(e);
}

if (!rawInputData)  {
  console.error('No data found.')
  return;
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

const t1 = performance.now();

const [ raceTimes, recordDistances ] = rawInputData
  .split('\n')
  .map( rawData => Array.from(
    rawData.matchAll(/(?<numberData>(\d{1,}))/g),
    ({ groups: { numberData } }) => +numberData
  ))

console.log(raceTimes)
console.log(recordDistances)

const solveP1 = ( raceTimes, recordDistances ) => raceTimes
  .reduce( (recordExceedCount, raceTime, gameIndex) => {
      const recordDistance = recordDistances.at(gameIndex);
      let holdInterval = 1
      let winCount = 0

      while (true) {
        const remTime = raceTime - holdInterval;
        const distanceCovered = remTime * holdInterval;

        if (distanceCovered > recordDistance) winCount++

        if (++holdInterval === raceTime) break;
      }

      if (winCount) recordExceedCount *= winCount;

      return recordExceedCount
    }, 
    1 
  );

const solveP2 = ( raceTimes, recordDistances ) => {}

console.info(`P1 : ${solveP1( raceTimes, recordDistances )}`)    //  741000
// console.info(`P2 : ${solveP2(initSeedsData)}`)    //  

const t2 = performance.now()

console.info(`T : ${t2 - t1} ms`)