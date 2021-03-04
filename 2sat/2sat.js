const { assert } = require('console');
const fs = require('fs');
const Vertex = require('./vertex.js').Vertex;
const inputFile = './2sat6.txt';

let getIndex;

fs.readFile(inputFile, {flag: 'r', encoding: 'utf-8'}, (err, data) => {
    if (err) {
        console.log(`Error reading from ${inputFile}: ${err}`);
        return;
    }

    var lines = data.split('\n').filter((x) => x);
    console.log(`read ${lines.length} lines from file`);
    let G = new Map();
    let maxVertexId = parseInt(lines[0]);
    getIndex = (val) => val < 0 ? maxVertexId + Math.abs(val) : val;

    console.time('createGraph');
    for (let i = 1; i < lines.length; ++i) {
        let items = lines[i].split(/\s+/).filter((x) => x);
        let [a, b] = [parseInt(items[0]), parseInt(items[1])];

        let [X, notX, Y, notY] = [getIndex(a), getIndex(-a), getIndex(b), getIndex(-b)];
        
        if (!G.has(X))  G.set(X, new Vertex(X));
        if (!G.has(notX)) G.set(notX, new Vertex(notX));
        if (!G.has(Y))    G.set(Y, new Vertex(Y));
        if (!G.has(notY))   G.set(notY, new Vertex(notY));

        G.get(notX).addOutgoing(Y);
        G.get(Y).addIncoming(notX);
        G.get(notY).addOutgoing(X);
        G.get(X).addIncoming(notY);
    }

    if (G.size < maxVertexId*2) { // there are disconnected vertices in graph. so add them to graph
        for (let i = 1; i <= maxVertexId; ++i) {
            let notI = getIndex(-i);
            if (!G.has(i))  G.set(i, new Vertex(i));
            if (!G.has(notI)) G.set(notI, new Vertex(notI));
        }
    }
    console.timeEnd('createGraph');

    // printGraph(G);

    console.time('SCC calculation');
    const sccMap = calculateSCC(G);
    console.timeEnd('SCC calculation');

    // console.log(sccMap);

    // const sizesSorted = Array.from(sccMap.values());
    // sizesSorted.sort((a, b) => b.size - a.size);
    // console.log(`graph SCCs in order of sizes: ${sizesSorted.slice(0,5).map(x => Array.from(x)).join('|')}`);

    let nonTrivialScc = [...sccMap.values()].filter((x) =>  x.size > 1);
    console.log(nonTrivialScc);

    for (const scc of nonTrivialScc) {
        for (const x of scc) {
            let notX = x > maxVertexId ? x - maxVertexId : getIndex(-x);
            if (scc.has(notX)) {
                console.log('UNSATISFIABLE');
                return;
            }
        }
    }

    console.log('SATISFIABLE');
});

var calculateSCC = function(G) {
    // initialize timer
    let timer = {current: 1};
    // PHASE I: loop over all graph vertices to calculate the ordering;
    // we need a map of timer -> vertex for the second phase
    const ordering  = new Map();
    // also cache for vertices explored so far
    const visited = new Set();
    for (let id = 1; id <= G.size ; ++id) {
        if (!visited.has(id)) { // if vertex is not explored yet
            reverseDFS(G, id, visited, timer, ordering); // DFS from it to assign timer mark
            // reverseDFS1(G, id, visited, timer, ordering); // DFS from it to assign timer mark
        }
    }

    assert(ordering.size == G.size, 'all vertices should be ordered');
    // console.log(ordering); // debug

    // PHASE II: loop over vertices in decreasing order of timer marks
    // we need a map for each SCC: key is the source vertex, value will be the size of SCC
    const sccMap = new Map();
    // reset cache for vertices explored so far
    visited.clear();
    for (let i = G.size; i > 0; --i) {
        vToExplore = ordering.get(i);
        if (!visited.has(vToExplore)) { // if vertex is not explored in second phase yet
            DFS(G, vToExplore, visited, vToExplore, sccMap); // DFS to collect size of SCC for that leader
        }
    }

    let sumSizes = 0;
    for (const [sv, vertices] of sccMap) {
        sumSizes += vertices.size;
    }
    assert(sumSizes == G.size, 'sizes of all SCCs should add up to size of the graph');

    return sccMap;
}

var reverseDFS = function(G, root, visited, timer, ordering) {
    visited.add(root); // mark DFS root vertex as explored
    const stack = [{i: 0, edges: G.get(root).in, origin: root}];
    
    let frame, vertex;
    while (stack.length > 0) {
        frame = stack[stack.length - 1];
        if (frame.i >= frame.edges.length) {
            stack.pop();
            ordering.set(timer.current++, frame.origin); // mark initial vertex with current timer
        } else {
            vertex = frame.edges[frame.i];
            if (!visited.has(vertex)) {
                visited.add(vertex);
                stack.push({i: 0, edges: G.get(vertex).in, origin: vertex});
            }
            frame.i++;
        }
    } 
}

var DFS = function(G, root, visited, srcVertex, sccMap) {
    visited.add(root);
    const stack = [{i: 0, edges: G.get(root).out, v: root}];
    
    let frame, vertex;
    while (stack.length > 0) {
        frame = stack[stack.length - 1];
        if (frame.i >= frame.edges.length) {
            stack.pop();
            if (!sccMap.has(srcVertex)) {
                sccMap.set(srcVertex, new Set([frame.v]));
            } else {
                sccMap.get(srcVertex).add(frame.v);
            }
        } else {
            vertex = frame.edges[frame.i];
            if (!visited.has(vertex)) {
                visited.add(vertex);
                stack.push({i: 0, edges: G.get(vertex).out, v: vertex});
            }
            frame.i++;
        }
    }
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