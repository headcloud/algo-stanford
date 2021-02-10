const { assert } = require('console');
const fs = require('fs');

fs.readFile('./full_sample.txt', {encoding: 'utf8'}, (err, data) => {
    if (err) {
        console.log(`Error reading from file ${err}`);
    } else {

        var lines = data.split('\n').filter((x) => x);
        console.log(`read ${lines.length} lines from file`);
        let wsSplit = new RegExp('\\s+');
        
        const iterations = 2500;
        let minCut = Number.MAX_SAFE_INTEGER;
        let G; // temporary graph
        for(let i = 0; i < iterations; ++i) {
            G = buildGraph(lines, wsSplit);
            // if (i == 0) printGraph(G);
            minCut = Math.min(minCut, calculateMinCut(G));
            // printGraph(G);
        }
        
        console.log(`after ${iterations} iterations minCut=${minCut}`);
    }
});

/* V is the map 
key is number of the vertex
value is array of corresponding edges from it
*/
var calculateMinCut = function(G) {
    // start loop until number of vertices is greater than 2
    while (G.size > 2) {
        // obtain number of edges N
        let m = countEdges(G);
        // choose random index [0,m) for edge to contract
        let ei = getRandom(0, m);
        // take 2 vertices this edge represents
        let [v1, v2] = getEdgeByIndex(G, ei);
        // take all the edges of the second vertex v2 and substitute v2 for v1 in each
        let v2Edges = G.get(v2);
        let edgesToScan;
        for (const neighbor of v2Edges) { // all vertices v2 is pointing to
            edgesToScan = G.get(neighbor); // take their corresponding edges
            for (let i = 0; i < edgesToScan.length; ++i) {
                if (edgesToScan[i] == v2) { // those which points to v2 which is vanishing
                    edgesToScan[i] = v1; // redirect them to v1;
                }
            }
        }
        
        // make v1 to point to all the vertices of v2 and clean self-loops
        let v1Edges = G.get(v1);
        let newv1Edges = v1Edges.concat(v2Edges).filter((x) => x !== v1);
        G.set(v1, newv1Edges);
        // it is safe to delete v2 now
        assert(G.delete(v2), 'contracted vertex is not removed!');
    }

    // for one of the remaining vertices calculate number of edges
    return G.values().next().value.length;
}

var getRandom = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

var countEdges = function(G) {
    let count = 0;
    for (const [v, vedges] of G) {
        count += vedges.length;
    }

    // console.log(`number of undirected edges is ${count / 2}`);
    return count;
};

var getEdgeByIndex = function(G, index) {
    let base = 0;
    for (const [v, vedges] of G) {
        if ( base <= index && index <= (base + vedges.length - 1) ) {
            return [v, vedges[index - base]];
        }
        base += vedges.length;
    }

    assert(false, 'edge should be found by now');
};

var printGraph = function(G) {
    console.log(`===================== G ======================`);
    for (const [v, edges] of G) {
        console.log(`V[${v}] -> ${edges}`);
    }
    console.log(`===================== G ======================`);
}

function buildGraph(lines, wsSplit) {
    const G = new Map();
    for (const line of lines) {
        let items = line.split(wsSplit).filter((x) => x);
        let vertex = items.shift();
        G.set(vertex, items);
    }

    return G;
}
