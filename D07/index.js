const fs = require("fs");
const logHeaderPrefix = "AOC2023";
const challengeDayNo = "07";
const challengeTitle = "Camel Cards";

const GAME_MODE = {
  DEFAULT: 0,
  JOKER_PLAY: 1,
};

const CARD_STRENGHT_ORDER = {
  DEFAULT: `AKQJT98765432`,
  JOKER_PLAY: `AKQT98765432J`,
};

const CARD_RATIO_MAP = new Map([
  ["5", 1],
  ["4:1", 2],
  ["3:2", 3],
  ["3:1:1", 4],
  ["2:2:1", 5],
  ["2:1:1:1", 6],
  ["1:1:1:1:1", 7],
]);

const JOKER_CARD = 'J';
const CARD_RATIO_DELIMITER = ':';

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

const getCardsRank = (cards, gameMode = GAME_MODE.DEFAULT) => {
  const checkForJokerPlay = gameMode === GAME_MODE.JOKER_PLAY && cards.includes(JOKER_CARD);

  const cardsStats = Array.from(cards).reduce((stats, card) => {
    if (stats.has(card)) stats.set(card, stats.get(card) + 1);
    else stats.set(card, 1);

    return stats;
  }, new Map());

  let cardsRatio;

  if (checkForJokerPlay && cardsStats.size > 1) {
    //  alter combination of cards 
    const jokerCardCount = cardsStats.get(JOKER_CARD);
    cardsStats.delete(JOKER_CARD);

    const cardsStatsList = Array
      .from(cardsStats.values())
      .sort((cardCountA, cardCountB) =>
        cardCountA > cardCountB ? -1 : cardCountA < cardCountB ? 1 : 0,
      )

    cardsStatsList[0] += jokerCardCount;
    cardsRatio = cardsStatsList.join(CARD_RATIO_DELIMITER);
  } else {
    cardsRatio = Array
      .from(cardsStats.values())
      .sort((cardCountA, cardCountB) => cardCountA > cardCountB ? -1 
        : cardCountA < cardCountB ? 1 
        : 0,
      ).join(CARD_RATIO_DELIMITER);
  }

  return CARD_RATIO_MAP.get(cardsRatio);
};

const compareHands = (cardA, cardB, gameMode = GAME_MODE.DEFAULT) => {
  let cardStrengthRef = gameMode === GAME_MODE.JOKER_PLAY 
    ? CARD_STRENGHT_ORDER.JOKER_PLAY 
    : CARD_STRENGHT_ORDER.DEFAULT;

  for (let cardIndex = 0; cardIndex < cardA.length; cardIndex++) {
    const cardAStrength = cardStrengthRef.indexOf( cardA.at(cardIndex) );
    const cardBStrength = cardStrengthRef.indexOf( cardB.at(cardIndex) );

    if (cardAStrength < cardBStrength) return 1;
    else if (cardAStrength > cardBStrength) return -1;
    else continue;
  }
};

const cardsData = rawInputData.split("\n").map((rawData) => {
  const [cards, bidAmount] = Array.from(rawData.match(/\w{1,}/g));
  return {
    cards,
    bidAmount: +bidAmount,
    rank: getCardsRank(cards),
    altRank: getCardsRank(cards, GAME_MODE.JOKER_PLAY),
  };
});

const solveP1 = (cardsData) => cardsData
  .sort( ( cardsA, cardsB ) => cardsA.rank > cardsB.rank ? -1
    : cardsA.rank < cardsB.rank ? 1
    : compareHands(cardsA.cards, cardsB.cards),
  ).reduce(
    (totalWins, { bidAmount }, index) => totalWins + (index + 1) * bidAmount,
    0,
  );

const solveP2 = (cardsData) => cardsData
  .sort( ( cardsA, cardsB ) => cardsA.altRank > cardsB.altRank ? -1
    : cardsA.altRank < cardsB.altRank ? 1
    : compareHands(cardsA.cards, cardsB.cards, GAME_MODE.JOKER_PLAY),
  ).reduce(
    (totalWins, { bidAmount }, index) => totalWins + (index + 1) * bidAmount,
    0,
  );

console.info(`P1 : ${solveP1( cardsData )}`);    //  248559379
console.info(`P2 : ${solveP2( cardsData )}`);    //  249631254

const t2 = performance.now();

console.info(`T : ${t2 - t1} ms`);