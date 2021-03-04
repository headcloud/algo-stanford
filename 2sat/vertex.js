class Vertex{
    constructor(id){
       this.id = id ;
       this.in = [];
       this.out = [];
    }

    addIncoming(from) {
        if (!this.in.includes(from)) this.in.push(from);
    }

    addOutgoing(to) {
        if (!this.out.includes(to)) this.out.push(to);
    }

    toString = () => `v${this.id} => [${this.out}] <= [${this.in}]`;
};

module.exports = {Vertex: Vertex};