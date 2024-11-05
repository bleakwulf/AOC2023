const fs = require("fs");
const logHeaderPrefix = "AOC2023";
const [dayNo, title] = ["12", "Hot Springs"];

const [ UNKNOWN_SPRING, DAMAGED_SPRING, GOOD_SPRING ] = [ '?', '#', '.' ];
const [ OPTIONAL_BOOKEND_SPRINGS, GOOD_SPRINGS, EXPECTED_SPRING_GROUP ] = [ `[?\.]?`, `[?\.]+`, `[\?#]{:length,:length}` ]

let rawInputData;

try {
  rawInputData = fs.readFileSync(`${__dirname}/D12/input.txt`, "utf8");
  // rawInputData = fs.readFileSync(`${__dirname}/D12/demo.txt`, "utf8");
} catch (e) {
  console.log(`Error!`);
  console.error(e);
}

if (!rawInputData) {
  console.error("No data found.");
  return;
}

console.info(`${logHeaderPrefix} | Day ${dayNo} | ${title}`);

const t1 = performance.now();

const calcPatternMatch = ( inputData, segmentPatterns ) => {
  let refData = [ `.${inputData}.` ];
  
  // return segmentPatterns.reduce( (comboMatch, segmentLength) => {
  //   const patternRef = new RegExp(`(?=[\?|.]{1}[\?|#]{${segmentLength}}[\?|.]{1})`, 'g');
  //   // const patternRef = new RegExp(`([\?|.]{1}[\?|#]{${segmentLength}}[\?|.]{1})`, 'g');

  //   const match = refData
  //     .splice(0)
  //     .map( dataRef => Array
  //       .from(
  //         dataRef.matchAll(patternRef),
  //         ({ index }) => dataRef.slice( index + segmentLength + 1 )
  //       )
  //     ).flat();

  //   comboMatch = match.length;

  //   // match.forEach( remPart => refData.push( remPart ) );
  //   refData = refData.concat(match)
  //   return comboMatch;
  // }, 0)

  // ----------------------------------------------------------------------
  return segmentPatterns.reduce( (comboMatch, segmentLength) => {
    const patternRef = new RegExp(`(?=[\?|.]{1}[\?|#]{${segmentLength}}[\?|.]{1})`, 'g');
    // const patternRef = new RegExp(`([\?|.]{1}[\?|#]{${segmentLength}}[\?|.]{1})`, 'g');

    const match = refData
      .splice(0)
      .map( dataRef => {
          if (!dataRef) return null

          const firstWorkingSpring = dataRef.indexOf('#');
          return Array
            .from(
              dataRef.matchAll(patternRef),
              ({ index }) => {
                if (!!~firstWorkingSpring && index > firstWorkingSpring)
                  return null
                else
                  return dataRef.slice( index + segmentLength + 1 )
              }
            )
      }).flat()
      .filter( match => !!match);

    comboMatch = match.length;

    // match.forEach( remPart => refData.push( remPart ) );
    refData = refData.concat(match)
    return comboMatch;
  }, 0)


}

const refData = rawInputData
  .split('\n')
  .map( ( lineData, lineIndex ) => {
    let [ springsMap, conditionsRef ] = lineData.split(' ');
    conditionsRef = conditionsRef.split(',').map(Number);
    
    return { lineIndex, springsMap, conditionsRef, patternMatch: calcPatternMatch( springsMap, conditionsRef) };
  });

// console.log(refData);

const solveP1 = () => refData
  .reduce( ( totalPatternMatch, { patternMatch } ) => totalPatternMatch + patternMatch, 0 );

const solveP2 = () => {};

console.info(`P1 : ${solveP1()}`); //  9773  too high; 1699 too low; 8248 X
console.info(`P2 : ${solveP2()}`); //  

const t2 = performance.now();

console.info(`T : ${t2 - t1} ms`);
