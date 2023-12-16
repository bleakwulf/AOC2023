const fs = require('fs');
const logHeaderPrefix = 'AOC2023';
const challengeDayNo = '03';
const challengeTitle = 'Gear Ratios';

const GEAR_PART = '*';
const GEAR_JOINT_PARTS_MAX = 2;

let rawInputData;

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');
} catch (e) {
  console.log(`Error!`);
  console.error(e);
}

const getNeighborCoords = (lineCount, lineWidth, xCoord, yCoord, partLength) => {
  let neighborCoords = [];
  const [ 
    hasWestSpace, 
    hasNorthSpace, 
    hasEastSpace, 
    hasSouthSpace 
  ] = [
    !!~(yCoord - 1),
    !!~(xCoord - 1), 
    yCoord + partLength - 1 < lineWidth - 1,
    xCoord < lineCount - 1
  ];

  // get NW coordinate
  if (hasNorthSpace && hasWestSpace)
    neighborCoords.push(`${xCoord - 1}|${yCoord - 1}`);

  // get N coordinates
  if (hasNorthSpace) {
    const [ northYCoordMax, northXCoord ] = [ yCoord + partLength, xCoord - 1 ];
    let northYCoord = yCoord;

    while (true) {
      neighborCoords.push(`${northXCoord}|${northYCoord}`);
      if (++northYCoord >= northYCoordMax) break;
    }
  }

  // get NE coordinate
  if (hasNorthSpace && hasEastSpace)
    neighborCoords.push(`${xCoord - 1}|${yCoord + partLength}`);

  // get E coordinate
  if (hasEastSpace)
    neighborCoords.push(`${xCoord}|${yCoord + partLength}`);

  // get SE coordinate
  if (hasEastSpace && hasSouthSpace)
    neighborCoords.push(`${xCoord + 1}|${yCoord + partLength}`);

  // get S coordinates
  if (hasSouthSpace) {
    const [ southYCoordMax, southXCoord ] = [ yCoord + partLength, xCoord + 1 ];
    let southYCoord = yCoord;
    while (true) {
      neighborCoords.push(`${southXCoord}|${southYCoord}`);
      if (++southYCoord >= southYCoordMax) break;
    }
  }

  // get SW coordinate
  if (hasSouthSpace && hasWestSpace)
    neighborCoords.push(`${xCoord + 1}|${yCoord - 1}`);

  // get W coordinate
  if (hasWestSpace)
    neighborCoords.push(`${xCoord}|${yCoord - 1}`);

  return neighborCoords;
}

const parseInput = rawInput => {
  const schematicLines = rawInput.split(`\n`);
  const lineCount = schematicLines.length;
  const lineWidth = schematicLines.at(0).length;

  const symbolsMap = new Map(
    schematicLines
      .map( (schematicLine, lineIndex ) => Array.from(
          schematicLine.matchAll(/(?<symbol>([^\d\w\.\s]))/g),
          ({ index, groups:{ symbol } }) => [ `${lineIndex}|${index}`, symbol ]
        )
      ).flat()
  );

  const gearsMap = new Map(
    schematicLines
      .map( (schematicLine, lineIndex ) => Array.from(
          schematicLine.matchAll(new RegExp(`(\\${GEAR_PART})`, 'g')),
          ({ index }) => [ `${lineIndex}|${index}`, [] ]
        )
      ).flat()
  );

  const partNumbers = schematicLines
    .map( (schematicLine, lineIndex ) => Array.from(
        schematicLine.matchAll(/(?<partNumber>(\d{1,}))/g),
        ({ index, groups:{ partNumber } }) => ({ 
          lineIndex, 
          columnIndex: index, 
          partNumber, 
          partLength: partNumber.length
        })
      )
    ).flat()
    .map( ({ lineIndex, columnIndex, partNumber, partLength }) => {
      const neighborCoords = getNeighborCoords(
        lineCount, lineWidth, lineIndex, columnIndex, partLength
      );
      const isNearSymbol = neighborCoords.some( coord => symbolsMap.get(coord) );
      const nearbyGears = neighborCoords.filter( coord => gearsMap.get(coord) );

      return { partNumber: +partNumber, isNearSymbol, nearbyGears };
    });

  //  map out gears and their joint parts
  partNumbers
    .filter( ({ nearbyGears }) => nearbyGears.length)
    .flat()
    .forEach( ({ partNumber, nearbyGears }) => {
      nearbyGears.forEach( gearCoord => {
        gearsMap.get(gearCoord).push(partNumber);
      })
    });

  return { partNumbers, gearsMap };
}

const solveP1 = partNumbersData => partNumbersData
  .filter( ({ isNearSymbol }) => isNearSymbol)
  .reduce( (partSum, { partNumber }) => partSum += partNumber, 0);

const solveP2 = gearsMap => Array
  .from(gearsMap.values())
  .filter( jointParts => jointParts.length === GEAR_JOINT_PARTS_MAX)
  .map( ([ part1, part2 ]) => part1 * part2 )
  .reduce( (gearRatioSum, gearRatio) => gearRatioSum += gearRatio, 0 );

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now();
  const { partNumbers: partNumbersData, gearsMap } = parseInput(rawInputData);

  console.info(`P1 : ${solveP1( partNumbersData )}`);    //  507214
  console.info(`P2 : ${solveP2( gearsMap )}`);           //  72553319

  const t2 = performance.now();
  console.info(`T : ${t2 - t1} ms`);
}