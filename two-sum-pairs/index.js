const fs = require('fs');
const assert = require('assert');
const filePath = './full-2sum.txt';

fs.readFile(filePath, {encoding: 'utf8'}, (err, data) => {
    if (err) {
        console.log(`Error ${err} reading from ${filePath}`);
        return;
    }

    const lines = data.split('\n').filter((x) => x);
    console.log(`read ${lines.length} form ${filePath}`);

    console.time('readInput');
    let [v, nums, cache] = [0, [], new Set()];
    for (const line of lines) {
        v = parseInt(line);
        nums.push(v);
        cache.add(v);
    }
    console.timeEnd('readInput');

    const steps = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2];
    let answers = new Set();
    let x, y;
    console.time('2sum');
    for (let i = 0; i < nums.length; ++i) {
        printProgress(steps, i / nums.length, '2sum');
        for (let t = -10000; t <= 10000; ++t) {
            [x, y] = [nums[i], t - nums[i]];
            if (x != y && !answers.has(t) && cache.has(y)) {
                cache.delete(x);
                answers.add(t);
            }
        }
    }

    console.timeEnd('2sum');

    console.log(`number of targets = ${answers.size}`);
});

var printProgress = function(steps, progress, label) {
    if (steps[0] < progress && progress < steps[1]) {
        console.timeLog(label, steps[0] * 100 + '%');
        steps.shift();
    }
}