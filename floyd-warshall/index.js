const fs = require('fs');
const inputFile = "./g3.txt"
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
        [u, v, w] = lines[i].split(wsRE).map((s) => parseInt(s));
        --u; --v;
        let key = eKey(u, v);
        if (edges.has(key)) {
            edges.set(key, Math.min(edges.get(key), w));
        } else {
            edges.set(eKey(u, v), w);
        }
    }
    // console.log(edges);

    let prev = Array.from({length: vSize}, () => new Array(vSize));
    for (let i = 0; i < vSize; ++i) {
        for (let j = 0; j < vSize; ++j) {
            let key = eKey(i, j);
            if (i == j) {
                prev[i][j] = Math.min(0, edges.get(key) || 0)
            } else if (edges.has(key)) {
                prev[i][j] = edges.get(key);
            } else {
                prev[i][j] = Number.POSITIVE_INFINITY;
            }
        }
    }
    console.timeEnd('Init');
    // printTable(prev, 4);

    let current = Array.from({length: vSize}, () => new Array(vSize));
    let ssp = Number.POSITIVE_INFINITY;
    let hasNegativeCycle = false;
    for (let k = 1; k < vSize; ++k) {
        for (let i = 0; i < vSize; ++i) {
            for (let j = 0; j < vSize; ++j) {
                current[i][j] = Math.min(prev[i][j], prev[i][k] + prev[k][j]);
                if (k == vSize - 1) { // on last iteration collect ssp
                    ssp = Math.min(ssp, current[i][j]);
                    if (i == j && current[i][j] < 0) hasNegativeCycle = true;
                }
            }
        }

        [prev, current] = [current, prev];
    }

    // printTable(prev, 4);
    console.log(`Shortest shortest path length is: ${hasNegativeCycle ? 'NULL' : ssp}`);
});

var eKey = (u, v) => `${u}#${v}`;

var getNumWidth = function(num) {
    if (num == 0) return 1;
    let width = 0;
    while (num > 0) {
        width++;
        num = Math.trunc(num / 10);
    }

    return width;
}

var printTable = function(table, colW) {
    const w = colW + 3;
    const firstW = Math.max(7, getNumWidth(table.length));
    let header = 'i\\w |'.padStart(firstW);
    for (let i = 0; i < table[0].length; ++i) header += `${i} |`.padStart(w);
    console.log(header);

    let line;
    for (let i = 0; i < table.length; ++i) {
        line = `${i} |`.padStart(firstW);
        for (let j = 0; j < table[0].length; ++j) {
            line += `${isFinite(table[i][j]) ? table[i][j] : '+∞'} |`.padStart(w);
        }
        console.log(line);
    }
}