const fs = require("fs");
const logHeaderPrefix = "AOC2023";
const [ dayNo, title ] = [ "11", "Cosmic Expansion" ];

const GALAXY_INDICATOR = '#';
const [ MIN_EXPANSION_SIZE, MAX_EXPANSION_SIZE ] = [ 1, 1e6 ];

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

//  parse raw data input
const { 
  linesData, 
  columnsData, 
  galaxyPairs 
} = rawInputData
  .split('\n')
  .reduce( 
    ( { linesData, columnsData, galaxies, galaxyPairs, galaxyIdRef }, lineData, lineIndex ) => {
      if (!columnsData.length) 
        columnsData = Array
          .from({ length: lineData.length })
          .fill('');

      const lineGalaxies = Array
        .from( lineData.matchAll(new RegExp(GALAXY_INDICATOR, 'g')) )
        .map( ({ index }) => index );

      linesData.push( lineGalaxies.length );

      lineGalaxies.forEach( columnIndex => {
        const galaxyId = ++galaxyIdRef;

        // pair new galaxy with existing galaxies 
        Array
          .from( galaxies.entries() )
          .forEach( ([ refGalaxyId, { x: refcoordX, y: refCoordY }]) => {
            galaxyPairs.set( 
              `${refGalaxyId}|${galaxyId}`, 
              { 
                x1: refcoordX, 
                x2: columnIndex, 
                y1: refCoordY, 
                y2: lineIndex 
              }
            );
          });

        //  add to galaxies
        galaxies.set( galaxyId, { x: columnIndex, y: lineIndex  });

        // append to column data
        columnsData[columnIndex] += GALAXY_INDICATOR;
      });

      return { linesData, columnsData, galaxies, galaxyPairs, galaxyIdRef };
    }, 
    {
      linesData: [],
      columnsData: [],
      galaxies: new Map(),
      galaxyPairs: new Map(),
      galaxyIdRef: 0
    }
);

//  initialize expanding axis points 
const [ X_OFFSETS, Y_OFFSETS ] = [ columnsData, linesData ]
  .map( axisData => axisData.reduce( 
    ( offsetPoints, pointValue, pointIndex ) => pointValue ? offsetPoints : offsetPoints.concat([ pointIndex ]),
    []
  ));

const simulateExpansion = ( expansionSize = MIN_EXPANSION_SIZE ) => Array
  .from( galaxyPairs.values() )
  .map( ({ x1, x2, y1, y2 }) => {
    const [ xMin, xMax, yMin, yMax ] = [
      Math.min( x1, x2 ),
      Math.max( x1, x2 ),
      Math.min( y1, y2 ),
      Math.max( y1, y2 )
    ];

    const [ xOffset, yOffset ] = [
      X_OFFSETS.filter( xCoord => xCoord > xMin && xCoord < xMax ),
      Y_OFFSETS.filter( yCoord => yCoord > yMin && yCoord < yMax )
    ].map( axisData => expansionSize === MIN_EXPANSION_SIZE 
      ? axisData.length 
      : axisData.length * (expansionSize - 1) );

    //  get Manhattan distance
    const distance = Math.abs( x2 - x1) + Math.abs( y2 - y1 );

    // return distance including offsets
    return distance + xOffset + yOffset;
  });

const calcDistance = ( expansionSize = MIN_EXPANSION_SIZE ) => {
  const expandedUniverse = simulateExpansion( expansionSize );
  return expandedUniverse.reduce( ( distancesSum, distance ) => distancesSum + distance, 0 );
}

const solveP1 = () => calcDistance();

const solveP2 = () => calcDistance( MAX_EXPANSION_SIZE );

console.info(`P1 : ${solveP1()}`);  //  10490062
console.info(`P2 : ${solveP2()}`);  //  382979724122

const t2 = performance.now();

console.info(`T : ${t2 - t1} ms`);