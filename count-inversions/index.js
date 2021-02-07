const fs = require('fs');

fs.readFile('./test_array.txt', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const nums = data.split('\n').map((x) => parseInt(x));
    console.log(`input data size: ${nums.length}`);
    // console.log(`shuffled data: ${shuffle(nums)}`);
    console.log(`number of inversions is ${countInversions(nums, 0, nums.length-1)}`);
    console.log(`nums state after counting: ${nums.slice(0, 30)}`);
  }
);

var shuffle = function(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

var countInversions = function(nums, left, right) {
    if (left == right) return 0; // single item
    
    if (right - left == 1) { // just 2 items;
        if (nums[left] <= nums[right]) return 0; // correct order
        [nums[left], nums[right]] = [nums[right], nums[left]]
        return 1; // inverted pair
    }

    // find middle index
    let middle = Math.trunc((right - left) / 2) + left;  
    // countInversions in left part
    let leftInversions = countInversions(nums, left, middle);
    // countInversions in rigth part
    let rightInversions = countInversions(nums, middle+1, right);

    // merge left and rigth part counting split inversions at the same time
    let splitInversions = 0;
    let leftPart = nums.slice(left, middle+1);

    let [l, r] = [0, middle+1];
    for (let i = left; i <= right; ++i) {
        if (r > right || (leftPart[l] < nums[r] && l < leftPart.length)) {
            nums[i] = leftPart[l]; 
            l++;
        } else {
            splitInversions += leftPart.length - l;
            nums[i] = nums[r];
            r++;
        }
    }

    return leftInversions + rightInversions + splitInversions;
}