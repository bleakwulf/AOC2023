const fs = require("fs");
const logHeaderPrefix = "AOC2023";
const [ dayNo, title ] = [ "10", "Pipe Maze" ];

const START_FLAG = 'S';

const DIRECTIONS_REF = new Map([
  [ 'N', { xIncrement:  0,  yIncrement: -1,  expectedPipes: [ '7', '|', 'F' ] } ],
  [ 'E', { xIncrement:  1,  yIncrement:  0,  expectedPipes: [ 'J', '-', '7' ] } ],
  [ 'S', { xIncrement:  0,  yIncrement:  1,  expectedPipes: [ 'J', '|', 'L' ] } ],
  [ 'W', { xIncrement: -1,  yIncrement:  0,  expectedPipes: [ 'L', '-', 'F' ] } ]
]);

/** 
  *  key is combo of initial direction + pipe type, 
  *  value is the new direction at the end of the pipe
*/
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

console.info(`${logHeaderPrefix} | Day ${dayNo} | ${title}`);

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

/**  get seed coords  */
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

/**  normalize start point into its proper pipe type  */
const startPipeDirectionCombo = refPipes.reduce( (directionCombo, { direction }) => directionCombo + direction, '' );
switch (startPipeDirectionCombo) {
  case 'NS':  case 'SN':  lines[startCoords.y][startCoords.x] = '|'; break;
  case 'EW':  
  case 'WE':  lines[startCoords.y][startCoords.x] = '-'; break;
  case 'NE':  
  case 'EN':  lines[startCoords.y][startCoords.x] = 'L'; break;
  case 'SE':  
  case 'ES':  lines[startCoords.y][startCoords.x] = 'F'; break;
  case 'SW':  
  case 'WS':  lines[startCoords.y][startCoords.x] = '7'; break;
  case 'NW':  
  case 'WN':  lines[startCoords.y][startCoords.x] = 'J'; break;
};

/**  init loop coords  */
const LOOP_COORDS_REF = new Map([
  [ `${[ startCoords.x, startCoords.y ].join('|')}`, startCoords ],
  ...refPipes.map( ({ x,y }) => [ `${x}|${y}`, { x, y } ])
]);

/**  build entire loop  */
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

const solveP2 = () => {
  const loopCoordsRef = Array.from( LOOP_COORDS_REF.values() )

  return lines.reduce( ( enclosedSpaces, lineData, lineIndex ) => {
    const coordsWithinLine = loopCoordsRef
      .filter( ({ x, y }) => y === lineIndex && lines.at(y).at(x) !== '-')
      .sort( (coordA, coordB) => coordA.x > coordB.x ? 1 : coordA.x < coordB.x ? -1 : 0);

    const simplifiedCoords = Array
      .from(
        coordsWithinLine
          .map( ({ x, y }) => lines.at(y).at(x) )
          .join('')
          .matchAll(/(FJ)|(L7)/g),  
        ({ index }) => index 
      ).reduceRight( ( coordsRef, refIndex ) => {
        coordsRef.splice( refIndex + 1, 1 );
        return coordsRef
      }, coordsWithinLine);

    lineData
      .map( (_, tileIndex) => tileIndex )
      .filter( tileIndex => !LOOP_COORDS_REF.has( `${tileIndex}|${lineIndex}` ))
      .forEach( tileIndex => {
        const leftSideCoords = simplifiedCoords.filter( ({ x }) => x < tileIndex );
        const rightSideCoords = simplifiedCoords.filter( ({ x }) => x > tileIndex );

        if ((leftSideCoords.length % 2) && (rightSideCoords.length % 2)) 
          enclosedSpaces++;
      });

    return enclosedSpaces;
  }, 0);
};

console.info(`P1 : ${solveP1()}`);  //  7093
console.info(`P2 : ${solveP2()}`);  //  407

const t2 = performance.now();

console.info(`T : ${t2 - t1} ms`);