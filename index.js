const fs = require("fs");
const logHeaderPrefix = "AOC2023";
const [dayNo, title] = ["12", "Hot Springs"];
let rawInputData;

try {
  // rawInputData = fs.readFileSync(`${__dirname}/D12/input.txt`, "utf8");
  rawInputData = fs.readFileSync(`${__dirname}/D12/demo.txt`, "utf8");
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

const solveP1 = () => {};

const solveP2 = () => {};

console.info(`P1 : ${solveP1()}`); //
console.info(`P2 : ${solveP2()}`); //

const t2 = performance.now();

console.info(`T : ${t2 - t1} ms`);
