const fs = require('fs');
const inputFile = './mwis_full.txt';

fs.readFile(inputFile, {flag: 'r', encoding: 'utf-8'}, (err, contents) => {
    if (err) {
        console.log(`Error ${err} reading from ${inputFile}`);
        return;
    }

    const lines = contents.split('\n').filter((x) => x);
    const count = parseInt(lines[0]);
    console.log(`file ${inputFile} contains ${lines.length} data rows and ${count} vertices`);

    const weights = [];
    for (let i = 1; i < lines.length; ++i) {
        weights.push(parseInt(lines[i], 10));
    }

    const dpTable = calculateMWISweight(weights);
    console.log(`weight of MWIS is ${dpTable[dpTable.length-1]}`);

    const mwis = new Set(reconstructSolution(weights, dpTable));
    const answerVertices = [1, 2, 3, 4, 17, 117, 517, 997];

    let answer = '';
    for (const v of answerVertices) {
        answer += mwis.has(v-1) ? '1' : '0';
    }

    console.log(`solution ${answer}`);
});

var calculateMWISweight = function(weights) {
    
    let n = weights.length;
    const dp = [0, weights[0]];

    for (let i = 2; i <= n; ++i) {
        dp[i] = Math.max(dp[i-2] + weights[i-1], dp[i-1]);
    }

    return dp;
}

var reconstructSolution = function(weights, dp) {
    const mwis = [];

    for (let i = dp.length-1; i >= 1;) {
        if (dp[i-1] >= (dp[i-2] || 0) + weights[i-1]) {
            // vertex is not in the optimal solution
            i--;
        } else {
            mwis.unshift(i-1);
            i -=2;
        }
    }

    return mwis;
}