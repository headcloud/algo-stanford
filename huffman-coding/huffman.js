const fs = require('fs');
const Heap = require('./src/heap').Heap;
const inputFile = './huff_full.txt';

fs.readFile(inputFile, {flag: 'r', encoding: 'utf-8'}, (err, contents) => {
    if (err) {
        console.log(`Error ${err} reading from ${inputFile}`);
        return;
    }

    const lines = contents.split('\n').filter((x) => x);
    const symbolsCount = parseInt(lines[0]);
    console.log(`file ${inputFile} contains ${lines.length} data rows and ${symbolsCount} symbols`);

    const nodesHeap = new Heap((a, b) => a.val - b.val);
    for (let i = 1; i < lines.length; ++i) {
        nodesHeap.insert(new Node(parseInt(lines[i], 10), null, null, i));
    }

    const root = getHuffmanTree(nodesHeap);
    // printLevels(root);
    const levels = getMinMaxlevels(root, symbolsCount);
    console.log(`Codeword bits: max=${levels[1]-1}, min=${levels[0]-1}`);
});

var Node = function(val, left, right, label) {
    console.assert(val != undefined, 'node should be created without value');
    this.val = val;
    this.left = left != undefined ? left : null;
    this.right = right != undefined ? right : null;
    this.label = label != undefined ? label : null;
}

var getHuffmanTree = function(nodesHeap) {
    if (nodesHeap.size() == 2) {
        let left = nodesHeap.extract();
        let right = nodesHeap.extract();
        
        return new Node(left.val + right.val, left, right);
    }

    let min1 = nodesHeap.extract();
    let min2 = nodesHeap.extract();
    let merged = new Node(min1.val + min2.val, min1, min2);
    nodesHeap.insert(merged);

    return getHuffmanTree(nodesHeap);
}

var printLevels = function(root) {
    let [levelNodes, level, newNodes, str] = [[root], 1, null, null];
    while (levelNodes.length > 0) {
        newNodes = [];
        str = `[lvl #${level}]`;
        
        let label;
        for (const node of levelNodes) {
            label = node.label ? `, label: ${node.label}` : '';
            str += ` {val: ${node.val}${label}}`;
            if (node.left) newNodes.push(node.left);
            if (node.right) newNodes.push(node.right);
        }

        console.log(str);
        level++;
        levelNodes = newNodes;
    }
}

var getMinMaxlevels = function(root, N) {
    let [min, max] = [N, 0];

    var traverse = function(node, level) {
        if (node.label) {
            min = Math.min(min, level);
            max = Math.max(max, level);
        }
        if (node.left) traverse(node.left, level+1);
        if (node.right) traverse(node.right, level+1);
    }

    traverse(root, 1);
    return [min, max];
}