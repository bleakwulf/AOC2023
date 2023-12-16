const fs = require('fs');
const logHeaderPrefix = 'AOC2023';
const challengeDayNo = '06';
const challengeTitle = 'Wait For It';

let rawInputData;

try {
  rawInputData = fs.readFileSync(`${__dirname}/D06/input.txt`, 'utf8');
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
  ));

const solveP1 = ( raceTimes, recordDistances ) => raceTimes
  .reduce( (recordExceedCount, raceTime, gameIndex) => {
      const recordDistance = recordDistances.at(gameIndex);
      let holdInterval = 1
      let winCount = 0

      while (true) {
        const remTime = raceTime - holdInterval;
        const distanceCovered = remTime * holdInterval;

        winCount += (distanceCovered > recordDistance)

        if (++holdInterval === raceTime) break;
      }

      return winCount 
        ? (recordExceedCount ?? 1) * winCount 
        : recordExceedCount
    }, null );

const solveP2 = ( raceTimes, recordDistances ) => {
  const [ raceTime, recordDistance ] = [ raceTimes, recordDistances ]
    .map( data => +data.join('') )

  let holdInterval = 1
  let winCount = 0

  while (true) {
    const remTime = raceTime - holdInterval;
    const distanceCovered = remTime * holdInterval;

    winCount += (distanceCovered > recordDistance)

    if (++holdInterval === raceTime) break;
  }

  return winCount;
}

console.info(`P1 : ${solveP1( raceTimes, recordDistances )}`)    //  741000
console.info(`P2 : ${solveP2( raceTimes, recordDistances )}`)    //  38220708

const t2 = performance.now()

console.info(`T : ${t2 - t1} ms`)