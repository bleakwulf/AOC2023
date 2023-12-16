const fs = require("fs");
const logHeaderPrefix = "AOC2023";
const challengeDayNo = "08";
const challengeTitle = "Haunted Wasteland";

const [ START_NODE, END_NODE ] = [ `AAA`, `ZZZ` ];
const [ START_NODE_SUFFIX, END_NODE_SUFFIX ] = [ `A`, `Z` ];
const [ PATH_SUFFIX_LEFT, PATH_SUFFIX_RIGHT ]= [ 'L', 'R' ];

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

const [ rawInstructions, rawNetworkMap ] = rawInputData.split('\n\n');

const { networkMap, nodes } = rawNetworkMap
  .split('\n')
  .reduce( ( {networkMap, nodes }, rawNodeData) => {
      const [ node, leftPath, rightPath ] = Array.from( rawNodeData.match(/\w{1,}/g) );
      networkMap.set(`${node}|${PATH_SUFFIX_LEFT}`, leftPath);
      networkMap.set(`${node}|${PATH_SUFFIX_RIGHT}`,rightPath);
      nodes.push(node);

      return { networkMap, nodes };
    }, { networkMap: new Map(), nodes: [] } );

const solveP1 = (rawInstructionsRef, networkRef) => {
  const instructions = Array.from( rawInstructionsRef.match(/\w/g) );
  let [ nextNode, steps ] = [ START_NODE, 0 ];

  while (true) {
    const nextPath = instructions.shift();

    nextNode = networkRef.get(`${nextNode}|${nextPath}`);
    steps++;
    instructions.push(nextPath);

    if (nextNode === END_NODE) break;
  }

  return steps;
}

const solveP2 = (rawInstructionsRef, networkRef, nodesRef) => {
  const instructions = Array.from( rawInstructionsRef.match(/\w/g) );
  let maxStepsPerStartNode = new Map();
  let nextNodes = nodesRef.filter( node => node.endsWith(START_NODE_SUFFIX) );
  let steps = 0;

  while (true) {  //  get min steps from each start node to their end node
    const nextPath = instructions.shift();

    nextNodes = nextNodes.map( nextNode => networkRef.get(`${nextNode}|${nextPath}`) );
    steps++;
    instructions.push(nextPath);

    if (nextNodes.some( node => node.endsWith(END_NODE_SUFFIX) )) {
      for(let startNodeIndex = 0; startNodeIndex < nextNodes.length; startNodeIndex++) {
        if (!nextNodes.at(startNodeIndex).endsWith(END_NODE_SUFFIX)) 
          continue;

        if (!maxStepsPerStartNode.has(startNodeIndex)) 
          maxStepsPerStartNode.set(startNodeIndex, []);

        maxStepsPerStartNode.get(startNodeIndex).push(steps);
      }
    }

    if (maxStepsPerStartNode.size === nextNodes.length) break;
  }

  const stepsPerStartNode = Array
    .from( maxStepsPerStartNode.values() )
    .map( node => node.at(0) )
    .sort( ( stepCountA, stepCountB ) => stepCountA > stepCountB ? 1 
      : stepCountA < stepCountB ? -1 
      : 0
    );

  let [ stepIncrement ] = stepsPerStartNode;

  for (let stepIndex = 0; stepIndex < stepsPerStartNode.length; stepIndex++) {
    let stepRefs = [ stepIncrement, stepsPerStartNode.at(stepIndex) ];
    let minSteps = Math.min(...stepRefs);
    steps = minSteps;

    while (true) {
      if (stepRefs.every( stepCount => !(steps % stepCount) )) {
        stepIncrement = steps;
        break;
      };

      steps += minSteps;
    }
  }

  return steps;
}

console.info(`P1 : ${solveP1( rawInstructions, networkMap )}`);          //  12169
console.info(`P2 : ${solveP2( rawInstructions, networkMap, nodes )}`);   //  12030780859469

const t2 = performance.now();

console.info(`T : ${t2 - t1} ms`);