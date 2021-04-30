const fs = require('fs');
const assert = require('assert');
const vertex = require('./vertex.js').vertex;
const filePath = './edges.txt';
const splitRE = new RegExp('\\s+');

fs.readFile(filePath, {encoding: 'utf8'}, (err, data) => {
    if (err) {
        console.log(`Error ${err} reading from ${filePath}`);
        return;
    }

    const lines = data.split('\n').filter((x) => x);
    const gInfo = lines[0].split(splitRE);
    const [vsize, esize] = [parseInt(gInfo[0]), parseInt(gInfo[1])];
    console.log(`file ${filePath} with ${lines.length} lines. Graph info |V|=${vsize} |E|=${esize}`);

    let G = new Map();
    console.time('createGraph');
    let s, d, w, sourceV, destV, weight;

    for (let i = 1; i < lines.length; ++i) {
        [s, d, w] = lines[i].split(splitRE).filter((x) => x);
        sourceV = getVertexById(parseInt(s), G);
        destV = getVertexById(parseInt(d), G);
        weight = parseInt(w);

        sourceV.addEdge(destV.id, weight);
        destV.addEdge(sourceV.id, weight);
    }

    console.timeEnd('createGraph');
    assert(G.size == vsize, 'wrong graph size number');
    // printGraph(G);

    const X = new Set([1]);
    console.time('calculateMST');
    const mstCost = calculateMST(X, G);
    console.timeEnd('calculateMST');
    console.log(`graph MST costs: ${mstCost}`);
});

function getVertexById(id, G) {
    let v = G.get(id);
    if (!v) {
        v = new vertex(id);
        G.set(id, v);
    }

    return v;
};

var getNumWidth = function(num) {
    if (num == 0) return 1;
    let width = 0;
    while (num > 0) {
        width++;
        num = Math.trunc(num / 10);
    }

    return width;
};

var printGraph = function(G) {
    let keyWidth = getNumWidth(G.size);
    for (const [key, value] of G) {
        let prefix = `${key}`.padStart(keyWidth);
        console.log(`${prefix}: ${value.toString()}`);
    }
};

var calculateMST = function(X, G) {
    let result = 0;
    let minW, winner;
    while(X.size != G.size) {
        winner = null; minW = null;
        for(const xVertex of X) {
            let edgesToConsider = G.get(xVertex).edges;
            for (const e of edgesToConsider) {
                if (!X.has(e[0])) {
                    if (!minW || e[1] < minW) {
                        minW = e[1];
                        winner = e[0];
                    }
                }
            }
        }

        result += minW;
        X.add(winner);
    }

    return result;
}