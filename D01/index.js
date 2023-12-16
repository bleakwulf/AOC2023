const fs = require('fs')
const logHeaderPrefix = 'AOC2023'
const challengeDayNo = '01'
const challengeTitle = 'Trebuchet?!'

let rawInputData;

const DIGIT_WORD_MAP = new Map([
  ['zero', 0],
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
]);

const NUMBER_TEXTS = Array.from( DIGIT_WORD_MAP.keys());
const NUMBER_DIGITS = Array.from( DIGIT_WORD_MAP.values());

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const normalizeLineData = rawLineData => {
  let searchParam = new RegExp(`(?=(?<digitMatch>(${NUMBER_TEXTS.concat(NUMBER_DIGITS).join('|')})))`, 'g');

  return Array.from(
      rawLineData.matchAll(searchParam)
    ).map( ({ groups:{ digitMatch } }) => DIGIT_WORD_MAP.get(digitMatch) || +digitMatch );
}

const parseDocument = (rawInput, isNormalizeData = false ) => rawInput
  .split(`\n`)
  .map(lineData => isNormalizeData 
    ? normalizeLineData(lineData)
    : Array.from(
        lineData.matchAll(/(?<calibrationDigit>(\d{1}))/g),
        ({ groups: { calibrationDigit } }) => +calibrationDigit
      )
  ).map(calibrationDigits => {
    let tensDigit = calibrationDigits.at(0) ?? 0;
    let unitsDigit = calibrationDigits.at(-1) ?? 0;

    return +`${tensDigit}${unitsDigit}`;
  })
  .reduce((totals, calibrationValue) => totals += calibrationValue, 0);

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now();

  console.info(`P1 : ${ parseDocument( rawInputData ) }`);        //  52974
  console.info(`P2 : ${ parseDocument( rawInputData, true )}`);   //  53340

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}