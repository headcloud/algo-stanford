class Vertex{
    constructor(id){
       this.id = id ;
       this.in = [];
       this.out = [];
    }

    addIncoming(from) {
        this.in.push(from);
    }

    addOutgoing(to) {
        this.out.push(to);
    }

    toString = () => `v${this.id} => [${this.out}] <= [${this.in}]`;
};

module.exports = {vertex: Vertex};