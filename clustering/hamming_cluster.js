const { assert } = require('console');
const { getDiffieHellman } = require('crypto');
const fs = require('fs');
const filePath = './clustering_big.txt';
const splitRE = new RegExp('\\s+');

// console.assert(masks.length == 276, 'wrong number of masks');


fs.readFile(filePath, {encoding: 'utf8'}, (err, data) => {
    if (err) {
        console.log(`Error ${err} reading from ${filePath}`);
        return;
    }

    const lines = data.split('\n').filter((x) => x);
    const header = lines[0].split(splitRE).filter((x) => x);
    const [vsize, bitsCount] = [parseInt(header[0]), parseInt(header[1])];
    console.log(`file ${filePath} with graph size |V|=${vsize}. Vertex label has ${bitsCount} bits`);

    let oneMasks = get1DiffMasks(bitsCount)
    let twoMasks = get2DiffMasks(bitsCount);
    assert(oneMasks.length + twoMasks.length == 300, 'wrong number of masks');

    console.time('createGraph');
    let vertexProximityData = []; // for each vertex store 0, 1, 2 distant neighbors 
    let labelToVertexMap = new Map();

    let vLabel;
    for (let i = 1; i < lines.length; ++i) {
        vLabel = parseInt(lines[i].split(splitRE).filter((x) => x).join(''), 2);
        vertexProximityData[i] = {
            label: vLabel,
            oneAwayLabels: oneMasks.map((mask) => vLabel ^ mask),
            twoAwayLabels: twoMasks.map((mask) => vLabel ^ mask)
        };
        
        if (!labelToVertexMap.has(vLabel)) {
            labelToVertexMap.set(vLabel, new Set());
        }
        
        labelToVertexMap.get(vLabel).add(i);
    }

    console.timeEnd('createGraph');
    console.log(`there are ${labelToVertexMap.size} distinct labels`);
    
    console.time('clusterization');
    clusterize(vsize, vertexProximityData, labelToVertexMap);
    console.timeEnd('clusterization');
});

var get1DiffMasks = function(bitsCount) {
    const masks = [];
    let num = 1;
    for (let i = 0; i < bitsCount; ++i) {
        masks.push(num);
        num <<= 1;
    }

    return masks;
};

var get2DiffMasks = function(bitsCount) {
    const masks = [];
    let hi, low;
    for (let i = 1; i < bitsCount; ++i) {
        hi = 1 << i;
        low = 1;
        for (let j = 0; j < i; ++j) {
            masks.push(hi + low);
            low <<= 1;
        }
    }

    return masks;
};

var clusterize = function(N, proximityData, labelsLookup) {
    let vertexToClusterMap = new Map();
    let clusters = new Set();
    for (let i = 1; i <= N; ++i) {
        let c = new Set([i]);
        clusters.add(c);
        vertexToClusterMap.set(i, c);
    }
    
    // clusterize duplicate vertices
    let visited = new Set();
    let currentLabel, currentCluster, otherCluster, verticesToJoin;
    for (let i = 1; i <= N; ++i) {
        visited.add(i);
        currentLabel = proximityData[i].label;
        verticesToJoin = labelsLookup.get(currentLabel);
        if (verticesToJoin.size < 1) continue;

        // join vertices with the same label into one cluster of the current vertex
        currentCluster = vertexToClusterMap.get(i);

        for (const vertex of verticesToJoin) {
            if (!visited.has(vertex)) {
                otherCluster = vertexToClusterMap.get(vertex);
                if (currentCluster == otherCluster) continue;
                
                for (const vertex of otherCluster) {
                    vertexToClusterMap.set(vertex, currentCluster);
                    currentCluster.add(vertex);
                }
                clusters.delete(otherCluster);
            }
        }
    }

    console.log(`after joining vertices with same label there are ${clusters.size} clusters`);

    // clusterize vertices 1 hop away
    visited.clear();
    let proximityLabels;
    for (let i = 1; i <= N; ++i) {
        visited.add(i);
        proximityLabels = proximityData[i].oneAwayLabels;
        verticesToJoin = new Set();
        for (const label of proximityLabels) {
            if (labelsLookup.has(label)) {
                labelsLookup.get(label).forEach((x) => verticesToJoin.add(x));
            }
        }
        
        if (verticesToJoin.size < 1) continue;

        // join vertices with the same label into one cluster of the current vertex
        currentCluster = vertexToClusterMap.get(i);

        for (const vertex of verticesToJoin) {
            if (!visited.has(vertex)) {
                otherCluster = vertexToClusterMap.get(vertex);
                if (currentCluster == otherCluster) continue;
                
                for (const vertex of otherCluster) {
                    vertexToClusterMap.set(vertex, currentCluster);
                    currentCluster.add(vertex);
                }
                clusters.delete(otherCluster);
            }
        }
    }

    console.log(`after joining vertices 1 hop away there are ${clusters.size} clusters`);

    // clusterize vertices 2 hops away
    visited.clear();
    for (let i = 1; i <= N; ++i) {
        visited.add(i);
        proximityLabels = proximityData[i].twoAwayLabels;
        verticesToJoin = new Set();
        for (const label of proximityLabels) {
            if (labelsLookup.has(label)) {
                labelsLookup.get(label).forEach((x) => verticesToJoin.add(x));
            }
        }
        
        if (verticesToJoin.size < 1) continue;

        // join vertices with the same label into one cluster of the current vertex
        currentCluster = vertexToClusterMap.get(i);

        for (const vertex of verticesToJoin) {
            if (!visited.has(vertex)) {
                otherCluster = vertexToClusterMap.get(vertex);
                if (currentCluster == otherCluster) continue;
                
                for (const vertex of otherCluster) {
                    vertexToClusterMap.set(vertex, currentCluster);
                    currentCluster.add(vertex);
                }
                clusters.delete(otherCluster);
            }
        }
    }

    console.log(`after joining vertices 2 hops away there are ${clusters.size} clusters`);
}