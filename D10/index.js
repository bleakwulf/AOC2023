const fs = require("fs");
const logHeaderPrefix = "AOC2023";
const challengeDayNo = "10";
const challengeTitle = "Pipe Maze";

const START_FLAG = 'S';
const PIPE_TYPES = [ 'F', 'J', 'L', '7', '|', '-' ];

const DIRECTIONS_REF = new Map([
  [ 'N', { xIncrement:  0,  yIncrement: -1,  expectedPipes: [ '7', '|', 'F' ] } ],
  [ 'E', { xIncrement:  1,  yIncrement:  0,  expectedPipes: [ 'J', '-', '7' ] } ],
  [ 'S', { xIncrement:  0,  yIncrement:  1,  expectedPipes: [ 'J', '|', 'L' ] } ],
  [ 'W', { xIncrement: -1,  yIncrement:  0,  expectedPipes: [ 'L', '-', 'F' ] } ]
]);

const PIPE_DIRECTIONS_REF = new Map([
  [ 'N+|', 'N' ], 
  [ 'S+|', 'S' ], 
  [ 'E+-', 'E' ], 
  [ 'W+-', 'W' ], 
  [ 'N+F', 'E' ], 
  [ 'W+F', 'S' ], 
  [ 'N+7', 'W' ], 
  [ 'E+7', 'S' ], 
  [ 'S+L', 'E' ], 
  [ 'W+L', 'N' ], 
  [ 'S+J', 'W' ], 
  [ 'E+J', 'N' ]
]);

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

// parse raw input
const { lines, startCoords }= rawInputData
  .split('\n')
  .reduce( 
    ({lines, startCoords}, line, lineIndex ) => {
      if(line.includes(START_FLAG))
        startCoords = { x: line.indexOf(START_FLAG), y: lineIndex };

      return {
        lines: lines
          .concat([ 
            Array.from( line.match(/[\w\|\.\-]/gm) ) 
          ]),
        startCoords
      }
    }, 
    { lines: [], startCoords: null }
  );

// get seed coords
let refPipes = Array
  .from( DIRECTIONS_REF.entries() )
  .map(  ([ key, { xIncrement, yIncrement, expectedPipes } ]) => {
    const [ newXCoord, newYCoord ] = [ 
      startCoords.x + xIncrement, 
      startCoords.y + yIncrement 
    ];

    return expectedPipes.includes( lines.at(newYCoord).at(newXCoord) ) 
      ? { direction: key, x: newXCoord, y: newYCoord }
      : null
  })
  .filter( seedData => seedData );

//  init loop coords
const LOOP_COORDS_REF = new Map([
  [ `${[ startCoords.x, startCoords.y ].join('|')}`, startCoords ],
  ...refPipes.map( ({ x,y }) => [ `${x}|${y}`, { x, y } ])
]);

//  build entire loop
let farthestStep = 1;
while (true) {
  let isDuplicateCoord = false;
  refPipes = refPipes
    .map( ({ direction, x, y }) => {
      const refPipe = lines.at(y).at(x);
      const newDirection = PIPE_DIRECTIONS_REF.get(`${direction}+${refPipe}`);
      const { xIncrement, yIncrement } = DIRECTIONS_REF.get(newDirection);

      return { 
        direction: newDirection, 
        x: x + xIncrement, 
        y: y + yIncrement 
      };
    });

  const [ refCoord1, refCoord2 ] = refPipes
    .map( ({ x, y }) => `${x}|${y}`);

  const isSameCoord = refCoord1 === refCoord2;

  refPipes.forEach( ({ x, y })=> {
    if (LOOP_COORDS_REF.has(`${x}|${y}`)) 
      isDuplicateCoord = true;
    else 
      LOOP_COORDS_REF.set(`${x}|${y}`, { x, y })
  });

  farthestStep++;

  if (isDuplicateCoord) {
    if (!isSameCoord) farthestStep++;
    break;
  }
}

const solveP1 = () => farthestStep;

const solveP2 = () => {};

console.info(`P1 : ${solveP1(  )}`);  //  7093
console.info(`P2 : ${solveP2(  )}`);  //  

const t2 = performance.now();

console.info(`T : ${t2 - t1} ms`);