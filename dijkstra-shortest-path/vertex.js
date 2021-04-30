class Vertex {
    constructor (id) {
        this.id = id;
        this.edges = [];
    }

    addEdge(headId, weight) {
        this.edges.push([headId, weight]);
    }

    toString() {
        let stringBuilder = `v${this.id}`;
        for (const edge of this.edges) {
            stringBuilder += ` -(${edge[1]})->v${edge[0]}`;
        }

        return stringBuilder;
    }
};

module.exports = {vertex: Vertex};