const fs = require('fs')
const logHeaderPrefix = 'AOC2023'
const challengeDayNo = '02'
const challengeTitle = 'Cube Conundrum'

let rawInputData;

const COLOR_QUOTA_MATRIX = new Map([
  [ 'red',   12 ],
  [ 'green', 13 ],
  [ 'blue',  14 ],
]);

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
} catch (e) {
  console.log(`Error!`)
  console.error(e)
}

const parseGameData = rawInput => rawInput
  .split('\n')
  .map(lineData => {
    const [gameIdTag, gameDrawsData] = lineData.split(':')

    const [gameId] = Array.from(
      gameIdTag.matchAll(/Game (?<gameId>(\d{1,}))/g),
      ({ groups: { gameId } }) => +gameId
    );

    const gameDraws = gameDrawsData
      .split(';')
      .map(drawSet => Array.from(
        drawSet.match(/(\d{1,} \w+)/g)
      ).reduce(
        (drawData, cubeData) => {
          const [count, color] = cubeData.split(' ')

          drawData[color] = +count;
          drawData.isValidCount &&= COLOR_QUOTA_MATRIX.get(color) >= +count

          return drawData
        },
        { isValidCount: true }
      ));

    const isValidGame = gameDraws.every( ({ isValidCount }) => isValidCount);

    // compute minimum cubes per color in a game
    const winCombo = Array
      .from(COLOR_QUOTA_MATRIX.keys())
      .reduce( (winCounts, color) => {
        winCounts[color] = gameDraws.reduce(
          (maxCount, gameDraw) => gameDraw[color] 
            ? Math.max(maxCount, gameDraw[color]) 
            : maxCount,
          -Infinity
        );

        return winCounts;
      }, {} );

    return { gameId, gameDraws, isValidGame, winCombo };
  });

const solveP1 = gameData => gameData
  .filter(({ isValidGame }) => isValidGame)
  .reduce((totals, { gameId }) => totals += gameId, 0);

const solveP2 = gameData => gameData
  .reduce((totals, { winCombo }) => {
      const { red = 0, green = 0, blue = 0} = winCombo;
      const power = (red + green + blue)
        ? (red || 1) * (green || 1) * (blue || 1)
        : 0;

      return totals += power
    }, 0 );

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()
  const gameData = parseGameData(rawInputData);

  console.info(`P1 : ${solveP1(gameData)}`)    //  3035
  console.info(`P1 : ${solveP2(gameData)}`)    //  66027

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}