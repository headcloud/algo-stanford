const fs = require('fs')
const fileName = './data.txt'

fs.readFile(fileName, {encoding: 'utf-8', flag: 'r'}, (err, data) => {
    if (err) {
        console.log(`Failed to read data from ${fileName}: ${err}`);
        return;
    }

    const lines = data.split('\n').filter((x) => x);
    const vSize = parseInt(lines[0]);
    console.log(`File contains data for ${vSize} cities graph`);

    const cities = [];
    const remaining = new Set();
    for (let i = 1; i < lines.length; ++i) {
        cities.push(lines[i].split(/\s+/).filter((x) => x).slice(-2).map((v) => parseFloat(v)));
        remaining.add(i-1);
    }

    console.log(`Read ${cities.length} points from file`);

    const route = [0];
    let from, currMinDist, currMinIndex, dst;
    while (remaining.size > 1) {
        currMinDist = Number.POSITIVE_INFINITY;
        from = route[route.length-1];
        remaining.delete(from);
        for (const i of remaining) {
            dst = distSquared(cities[from], cities[i]);
            if (dst < currMinDist) {
                currMinDist = dst;
                currMinIndex = i;
            }
        }

        route.push(currMinIndex);
    }

    // console.log(route);

    let routeLen = 0;
    for (let i = 1; i < route.length; ++i) {
        routeLen += Math.sqrt(distSquared(cities[route[i-1]], cities[route[i]]));
    }

    routeLen += Math.sqrt(distSquared(cities[route[0]], cities[route[route.length-1]]));

    console.log(`TSP len found is: ${routeLen}`);
});

var distSquared = function(a, b) {
    let [dx, dy] = [b[0] - a[0], b[1] - a[1]];
    return dx*dx + dy*dy;
}