const fs = require('fs');
const inputFile = "./in_rnd_1_2.txt"
const wsRE = /\s+/;

fs.readFile(inputFile, {flag: 'r', encoding: 'utf-8'}, (err, contents) => {
    if (err) {
        console.log(`Error ${err} reading from ${inputFile}`);
        return;
    }

    console.time('Init');
    const lines = contents.split('\n').filter((x) => x);
    const [vSize, eSize] = lines[0].split(wsRE).map((x) => parseInt(x));
    console.log(`file ${inputFile} contains ${lines.length} data rows and ${vSize} vertices`);
    
    const edges = new Map();
    let [u, v, w] = [0, 0, 0];
    for (let i = 1; i < lines.length; ++i) {
        [u, v, w] = lines[1].split(wsRE).map((s) => parseInt(s));
        edges.set(eKey(u, v), w);
    } 

    const dp = Array.from({length: vSize+1}, () => new Array(vSize+1));
    for (let i = 1; i <= vSize; ++i) {
        for (let j = 1; j <= vSize; ++j) {
            dp[i][j] = [];
            if (i == j) {
                dp[i][j][0] = 0;
            } else if (edges.has(eKey(i, j))) {
                dp[i][j][0] = edges.get(eKey(i, j));
            } else {
                dp[i][j][0] = Number.POSITIVE_INFINITY;
            }
        }
    }
    console.timeEnd('Init');

    for (let k = 1; k <= vSize; ++k) {
        for (let i = 1; i <= vSize; ++i) {
            for (let j = 1; j <= vSize; ++j) {
                dp[i][j][k] = Math.min(dp[i][j][k-1], dp[i][k][k-1] + dp[k][j][k-1]);
            }
        }
    }

    console.log(dp[1][20][1000]);
});

var eKey = (u, v) => `${u}#${v}`;