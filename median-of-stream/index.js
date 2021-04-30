const fs = require('fs');
const assert = require('assert');
const Heap = require('./heap').heap;
const filePath = './Median.txt';

fs.readFile(filePath, {encoding: 'utf8'}, (err, data) => {
    if (err) {
        console.log(`Error ${err} reading from ${filePath}`);
        return;
    }

    const lines = data.split('\n').filter((x) => x);
    console.log(`read ${lines.length} form ${filePath}`);

    let loHeap = new Heap((a, b) => b - a);
    let hiHeap = new Heap((a, b) => a - b);
    let [i, item, mediansSum] = [0, null, 0];
    let medianPos;
    for (const line of lines) {
        i++;
        item = parseInt(line);
        if (loHeap.size() == 0 || item < loHeap.peek()) {
            loHeap.insert(item);
        } else if (hiHeap.size() == 0 || item > hiHeap.peek()) {
            hiHeap.insert(item);
        } else if (item >= loHeap.peek() && item <= hiHeap.peek()) {
            loHeap.insert(item);
        }
        assert(loHeap.size() + hiHeap.size() == i, "size of both heaps should be equal to number of items read");

        if (Math.abs(loHeap.size() - hiHeap.size()) > 1) { // if rebalancing needed
            if (loHeap.size() > hiHeap.size()) hiHeap.insert(loHeap.extract());
            else loHeap.insert(hiHeap.extract());
        }
        assert(Math.abs(loHeap.size() - hiHeap.size()) <= 1, "heaps are not balanced");

        medianPos = (i % 2 == 0) ? i / 2 : (i+1) / 2;
        mediansSum += medianPos == loHeap.size() ? loHeap.peek() : hiHeap.peek();
    }

    console.log(`medians sum mod 10000 = ${mediansSum % 10000}`);
});