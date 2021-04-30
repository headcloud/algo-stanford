const fs = require('fs');
const vertex = require('./vertex.js').vertex;
const filePath = './dijkstra_data.txt';
const witeSpaceSplit = new RegExp('\\s+');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
    if (err) {
        console.log(`Error ${err} reading from ${filePath}`);
        return;
    }

    const lines = data.split('\n').filter((x) => x);
    console.log(`read ${lines.length} form ${filePath}`);

    let G = new Map();
    console.time('createGraph');
    let lineParts, sourceV, destParts, destId, destV, weight;

    for (const line of lines) {
        lineParts = line.split(witeSpaceSplit).filter((x) => x);
        sourceV = getVertexById(parseInt(lineParts.shift()), G);

        while (lineParts.length) {
            destParts = lineParts.shift().split(',');
            [destId, weight] = [parseInt(destParts[0]), parseInt(destParts[1])];
            sourceV.addEdge(destId, weight);
        }
    }

    console.timeEnd('createGraph');
    // printGraph(G);
    const X = new Set([1]);
    const A = new Map([[1, 0]]);
    console.time('calculateShortestPaths');
    calculateSPs(X, A, G);
    console.timeEnd('calculateShortestPaths');

    printAnswer([7, 37, 59, 82, 99, 115, 133, 165, 188, 197], A);
});

var calculateSPs = function(X, A, G) {
    let candidates = new Map();
    let winner;
    while(X.size != G.size) {
        winner = null;
        for(const xVertex of X) {
            let edgesToConsider = G.get(xVertex).edges;
            for (const e of edgesToConsider) {
                if (!X.has(e[0])) {
                    let newScore = Math.min(candidates.get(e[0]) || 1000000, A.get(xVertex) + e[1]);
                    candidates.set(e[0], newScore);
                    if (!winner || newScore < candidates.get(winner)) {
                        winner = e[0];
                    }
                }
            }
        }

        A.set(winner, candidates.get(winner));
        X.add(winner);
    }
}

function getVertexById(id, G) {
    let v = G.get(id);
    if (!v) {
        v = new vertex(id);
        G.set(id, v);
    }

    return v;
}

var printGraph = function(G) {
    let keyWidth = getNumWidth(G.size);
    for (const [key, value] of G) {
        let prefix = `${key}`.padStart(keyWidth);
        console.log(`${prefix}: ${value.toString()}`);
    }
}

var getNumWidth = function(num) {
    if (num == 0) return 1;
    let width = 0;
    while (num > 0) {
        width++;
        num = Math.trunc(num / 10);
    }

    return width;
}

var printAnswer = function(vertices, paths) {
    let maxNumWidth = vertices.reduce((maxWidth, num) => Math.max(maxWidth, getNumWidth(num)));
    for (const v of vertices) {
        maxNumWidth = Math.max(maxNumWidth, getNumWidth(paths.get(v)));
    }

    let [keys, vals, dump] = ['', '', []];
    for (const v of vertices) {
        keys += `${v}`.padStart(maxNumWidth);
        vals += `${paths.get(v)}`.padStart(maxNumWidth);
        dump.push(paths.get(v));
    }
    console.log(`keys: ${keys}`);
    console.log(`vals: ${vals}`);
    console.log(dump.join(','));
}
