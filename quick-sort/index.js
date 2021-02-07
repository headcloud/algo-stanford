const fs = require('fs')

fs.readFile('./full_sample.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const nums = data.split('\n').filter((x) => x).map((x) => parseInt(x));
    const lastIndex = nums.length-1;
    console.log(`input data size: ${nums.length}`);

    var firstElComp = countComparisonsAndSort(Array.from(nums), 0, lastIndex, chooseFirst);
    var lastElComp = countComparisonsAndSort(Array.from(nums), 0, lastIndex, chooseLast);
    var med3ElComp = countComparisonsAndSort(nums, 0, lastIndex, chooseMedian3);
    console.log(`FIRST: ${firstElComp}`);
    console.log(` LAST: ${lastElComp}`);
    console.log(`MEDI3: ${med3ElComp}`);
});

var countComparisonsAndSort = function(nums, left, right, choosePivotCallback) {
    // base case, single element, no comparisons and it is sorted allready
    if (left >= right) return 0;
    // console.log(`input array: ${nums.filter((x, i) => i >= left && i <= right)}`);
    // choose pivot
    const pivotIndex = choosePivotCallback(nums, left, right);
    // make it to be the first element
    [nums[left], nums[pivotIndex]] = [nums[pivotIndex], nums[left]];
    // initialize partition indices
    // lastSmaller - index of the last element smaller than pivot
    let lastSmaller = left;
    
    // initialize comparison counter;
    let numberOfComparisons = right - left;
    // perform partitioning
    for (let i = left+1; i <= right; ++i) {
        if (nums[i] < nums[left]) {
            ++lastSmaller;
            [nums[lastSmaller], nums[i]] = [nums[i], nums[lastSmaller]];
        }
    }

    // swap pivot with last smaller
    [nums[left], nums[lastSmaller]] = [nums[lastSmaller], nums[left]];

    // work on left and right parts
    numberOfComparisons += countComparisonsAndSort(nums, left, lastSmaller-1, choosePivotCallback);
    numberOfComparisons += countComparisonsAndSort(nums, lastSmaller+1, right, choosePivotCallback);

    return numberOfComparisons;
}

var chooseFirst = (nums, left, right) => left;

var chooseLast = (nums, left, right) => right;

var chooseMedian3 = function(nums, left, right) {
    let middle = left + Math.trunc((right-left) / 2);
    
    if (Math.min(nums[left], nums[right]) < nums[middle] && nums[middle] < Math.max(nums[left], nums[right])) {
        // console.log(`     left: ${nums[left]} right: ${nums[right]}  middle: ${nums[middle]}  MEDIAN: ${nums[middle]}\n`);
        return middle;
    }
    if (Math.min(nums[middle], nums[right]) < nums[left] && nums[left] < Math.max(nums[middle], nums[right])) {
        // console.log(`     left: ${nums[left]} right: ${nums[right]}  middle: ${nums[middle]}  MEDIAN: ${nums[left]}\n`);
        return left;
    }

    // console.log(`     left: ${nums[left]} right: ${nums[right]}  middle: ${nums[middle]}  MEDIAN: ${nums[right]}\n`);
    return right;
}