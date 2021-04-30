const fs = require('fs');
const assert = require('assert');
const Heap = require('./heap').heap;
const filePath = './jobs.txt';

fs.readFile(filePath, {encoding: 'utf8'}, (err, data) => {
    if (err) {
        console.log(`Error ${err} reading from ${filePath}`);
        return;
    }

    const lines = data.split('\n').filter((x) => x);
    const jobsCount = parseInt(lines[0]);
    console.log(`file ${filePath} contains ${lines.length} data rows and ${jobsCount} jobs`);

    const jobs = [];
    let rawJob;
    for (let i = 1; i < lines.length; ++i) {
        rawJob = lines[i].split(' ');
        jobs[i-1] = {weight: parseInt(rawJob[0]), length: parseInt(rawJob[1])};
    }

    assert(jobs.length == jobsCount, 'wrong jobs number');
    const jobsTimeDiffSchedule = getWeightedCompletionTimeWithDiffStrategy(jobs);
    console.log(`jobs completion time scheduled by diff strategy: ${jobsTimeDiffSchedule}`);
    const jobsTimeRatioSchedule = getWeightedCompletionTimeWithRatioStrategy(jobs);
    console.log(`jobs completion time scheduled by ratio strategy: ${jobsTimeRatioSchedule}`);

});

var getWeightedCompletionTimeWithDiffStrategy = function(jobs) {
    var jobsComparator = function(a, b) {
        let [adiff, bdiff] = [a.weight - a.length, b.weight - b.length];
        if (adiff != bdiff) return bdiff - adiff;
        return b.weight - a.weight;
    }

    const jobsCopy = Array.from(jobs);
    jobsCopy.sort(jobsComparator);

    let result = 0;
    let time = 0;
    for (let i = 0; i < jobsCopy.length; ++i) {
        time += jobsCopy[i].length;
        result += time * jobsCopy[i].weight;
    }

    return result;
};

var getWeightedCompletionTimeWithRatioStrategy = function(jobs) {
    var jobsComparator = (a, b) => (b.weight/b.length) - (a.weight/a.length);

    const jobsCopy = Array.from(jobs);
    jobsCopy.sort(jobsComparator);

    let result = 0;
    let time = 0;
    for (let i = 0; i < jobsCopy.length; ++i) {
        time += jobsCopy[i].length;
        result += time * jobsCopy[i].weight;
    }

    return result;
}