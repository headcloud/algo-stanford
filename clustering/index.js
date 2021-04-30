const fs = require('fs');
const assert = require('assert');
const filePath = './graph.txt';
const splitRE = new RegExp('\\s+');

fs.readFile(filePath, {encoding: 'utf8'}, (err, data) => {
    if (err) {
        console.log(`Error ${err} reading from ${filePath}`);
        return;
    }

    const lines = data.split('\n').filter((x) => x);
    const vsize = parseInt(lines[0]);
    console.log(`file ${filePath} with ${lines.length} lines. Graph info |V|=${vsize}`);

    console.time('createGraph');
    let s, d, w;
    let edges = [];

    for (let i = 1; i < lines.length; ++i) {
        [s, d, w] = lines[i].split(splitRE).filter((x) => x);
        sourceV = parseInt(s);
        destV = parseInt(d);
        weight = parseInt(w);

        edges.push({ source: sourceV, dest: destV, weight: weight });
    }

    console.timeEnd('createGraph');
    assert(edges.length == vsize * (vsize - 1) / 2, 'wrong edges count');

    edges.sort((a, b) => b.weight - a.weight );
    console.log(`sorted edges desc ${edges.slice(0, 10).map((e) => `${e.source}--(${e.weight})--${e.dest}`).join(',')} ...`);

    clusterize(edges, 4, vsize);
});

var clusterize = function(edges, k, N) {
    let vertexToClusterMap = new Map();
    let clusters = new Set();
    for (let i = 1; i <= N; ++i) {
        let c = new Set([i]);
        clusters.add(c);
        vertexToClusterMap.set(i, c);
    }

    let edge, big, small, lastEdge;
    while (clusters.size >= k) {
        edge = edges.pop();
        [big, small] = [vertexToClusterMap.get(edge.source), vertexToClusterMap.get(edge.dest)];
        if (big == small) continue;

        if ( clusters.size > k) {
            if (big.size < small.size) {
                [big, small] = [small, big];
            }

            for (const vertex of small) {
                vertexToClusterMap.set(vertex, big);
                big.add(vertex);
            }
            clusters.delete(small);
        } else {
            lastEdge = edge;
            break;
        }
    }

    console.log(`maximum spacing of ${k}-clustering is ${lastEdge.weight}`);
}