const fs = require('fs');
const logHeaderPrefix = 'AOC2023';
const challengeDayNo = '04';
const challengeTitle = 'Scratchcards ';

let rawInputData;

try {
  rawInputData = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');
} catch (e) {
  console.log(`Error!`);
  console.error(e);
}

const parseInput = rawInputData => rawInputData
  .split('\n')
  .map( cardData => {
    const [ , cardNumbersData] = cardData.split(':')

    const [ winningNumbers, drawnNumbers ] = cardNumbersData
      .split('|')
      .map( numbersData => Array.from(
        numbersData.matchAll(/(?<numberPart>(\d{1,}))/g),
        ({ groups:{ numberPart } }) => +numberPart
      ));

    const cardMatch = drawnNumbers
      .filter( drawnNumber => winningNumbers.includes(drawnNumber) )
      .length;

    return cardMatch;
  });

const solveP1 = gameData => gameData
  .filter( cardMatch => cardMatch )
  .reduce( ( winScore, cardMatch ) => winScore += Math.pow( 2, cardMatch - 1 ), 0);

const solveP2 = gameData => {
  let multiplierQueue = Array(gameData.length).fill(1);

  return gameData
    .reduce( ( cardCount, cardMatch ) => {
      const cardMultiplier = multiplierQueue.shift() ?? 1;
      let cardCounter = 0;

      while (cardCounter < cardMatch) {
        multiplierQueue[ cardCounter ] ??= 0
        multiplierQueue[ cardCounter ] += cardMultiplier 
        cardCounter++
      }

      return cardCount += cardMultiplier
    }, 0);
}

console.info(`${logHeaderPrefix} | Day ${challengeDayNo} | ${challengeTitle}`);

if (rawInputData) {
  const t1 = performance.now()
  const gameData = parseInput(rawInputData);

  console.info(`P1 : ${solveP1(gameData)}`)    //  20829
  console.info(`P2 : ${solveP2(gameData)}`)    //  12648035

  const t2 = performance.now()
  console.info(`T : ${t2 - t1} ms`)
}