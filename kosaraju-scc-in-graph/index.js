const { assert } = require('console');
const fs = require('fs');
const vrtx = require('./vertex.js').vertex;

console.time('fileRead');
fs.readFile('./full_graph.txt', {encoding: 'utf8'}, (err, data) => {
    console.timeEnd('fileRead');
    if (err) {
        console.log(`Error reading from file ${err}`);
    } else {
        const wsSplit = new RegExp('\\s+');

        var lines = data.split('\n').filter((x) => x);
        console.log(`read ${lines.length} lines from file`);
        let G = new Map();
        let maxVertexId = 0;

        console.time('createGraph');
        for (const line of lines) {
            let items = line.split(wsSplit).filter((x) => x);
            let [from, to] = [parseInt(items[0]), parseInt(items[1])];
            maxVertexId = Math.max(maxVertexId, from, to);
            if (!G.has(from)) G.set(from, new vrtx(from));
            G.get(from).addOutgoing(to);
            
            if (!G.has(to)) G.set(to, new vrtx(to));
            G.get(to).addIncoming(from);
        }

        if (G.size < maxVertexId) { // there are disconnected vertices in graph. so add them to graph
            for (let i = 1; i <= maxVertexId; ++i) {
                if (!G.has(i)) G.set(i, new vrtx(i));
            }
        }
        console.timeEnd('createGraph');

        // printGraph(G);

        console.time('SCC calculation');
        const sccMap = calculateSCC(G);
        console.timeEnd('SCC calculation');
        // console.log(sccMap);
        const sizesSorted = Array.from(sccMap.values());
        sizesSorted.sort((a, b) => b - a);
        console.log(`graph SCCs in order of sizes: ${sizesSorted.slice(0,5).join(',')}`);
    }
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
    for (const [sv, size] of sccMap) {
        sumSizes += size;
    }
    assert(sumSizes == G.size, 'sizes of all SCCs should add up to size of the graph');

    return sccMap;
}

var reverseDFS1 = function(G, root, visited, timer, ordering) {
    visited.add(root);
    let incoming = G.get(root).in;
    for (let i = 0; i < incoming.length; ++i) {
        if (!visited.has(incoming[i])) {
            reverseDFS1(G, incoming[i], visited, timer, ordering);
        }
    }

    ordering.set(timer.current++, root);
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

var DFS1 = function(G, root, visited, srcVertex, sccMap) {
    visited.add(root);
    let outgoing = G.get(root).out;
    for (let i = 0; i < outgoing.length; ++i) {
        if (!visited.has(outgoing[i])) {
            DFS1(G, outgoing[i], visited, srcVertex, sccMap);
        }
    }

    sccMap.set(srcVertex, sccMap.get(srcVertex)+1 || 1);
}

var DFS = function(G, root, visited, srcVertex, sccMap) {
    visited.add(root);
    const stack = [{i: 0, edges: G.get(root).out}];
    
    let frame, vertex;
    while (stack.length > 0) {
        frame = stack[stack.length - 1];
        if (frame.i >= frame.edges.length) {
            stack.pop();
            sccMap.set(srcVertex, sccMap.get(srcVertex)+1 || 1);
        } else {
            vertex = frame.edges[frame.i];
            if (!visited.has(vertex)) {
                visited.add(vertex);
                stack.push({i: 0, edges: G.get(vertex).out});
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
