const fs = require("fs");
const logHeaderPrefix = "AOC2023";
const challengeDayNo = "09";
const challengeTitle = "Mirage Maintenance";

let rawInputData;

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, "utf8");
} catch (e) {
  console.log(`Error!`);
  console.error(e);
}

if (!rawInputData) {
  console.error("No data found.");
  return;
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

const t1 = performance.now();

const newHistoricValues = rawInputData
  .split('\n')
  .map( reportLine => {
    const diffsRef = [ Array
      .from( reportLine.match(/-?\d{1,}/g) ) 
      .map(Number)
    ];

    while (true) {
      const refLine = diffsRef.at(-1);

      if (refLine.every( historyValue => !historyValue )) break;

      const newDiffCalc = refLine
        .reduce( (diffs, value, index, refLine) => {
          if (!index) return diffs;

          diffs.push( value - refLine.at(index - 1) );
          return diffs;
        }, [] );

      diffsRef.push( newDiffCalc );
    }

    const suffixValue = diffsRef
      .reduceRight( (newValue, diffRef) => newValue + diffRef.at(-1), 0 );

    const prefixValue = diffsRef
      .reduceRight( (newValue, diffRef) => diffRef.at(0) - newValue, 0 );

    return { prefixValue, suffixValue };
  });

const solveP1 = inputData => inputData
  .reduce( (valueSum, { suffixValue }) => valueSum + suffixValue, 0 );

const solveP2 = inputData => inputData
  .reduce( (valueSum, { prefixValue }) => valueSum + prefixValue, 0 );

  console.info(`P1 : ${solveP1( newHistoricValues )}`);  //  1974232246
  console.info(`P2 : ${solveP2( newHistoricValues )}`);  //  928

const t2 = performance.now();

console.info(`T : ${t2 - t1} ms`);