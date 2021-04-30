class Heap {
    constructor (comparator) {
        this.comparator = comparator;
        // elements are stored at indexes 1..length-1
        // to simplify parent-child index calculations 
        this.values = [0];
    };

    size() {
        return this.values.length - 1;
    };

    insert(num) {
        // insert into heap
        this.__heapify(num);

        // return new count of elements in the heap
        return this.values.length - 1; 
    };

    extract() {
        // extract from top of the heap
        return this.values.length > 1 ? this.__removeHead() : null;
    };

    peek() {
        // look at the top element of the heap
        return this.values.length >1 ?  this.values[1] :null;
    };

    __heapify(num) {
        const vals = this.values;
        if (vals.length == 0) {
            vals[1] = num;
        } else {
            let index = vals.length;
            vals[vals.length] = num;
            let parentIndex = Math.floor(index / 2);
            while (parentIndex > 0 && this.comparator(vals[parentIndex], vals[index]) > 0) { // while inserted value is less than parent
                // bubble it up
                [vals[parentIndex], vals[index]] = [vals[index], vals[parentIndex]];
                index = parentIndex;
                parentIndex = Math.floor(index / 2);
            }
        }
    };

    __removeHead() {
        const vals = this.values;
        const result = vals[1];
        if (vals.length == 2) {
            vals.length = 1;
            return result;
        }
        
        // exchange head and last value
        [vals[1], vals[vals.length - 1]] = [vals[vals.length - 1], vals[1]];
        vals.length = vals.length - 1; // fast way to remove head element;
        let index = 1;
        let [li, ri] = [2*index, 2*index + 1];
        let exchangeIndex = ri >= vals.length || this.comparator(vals[li], vals[ri]) < 0 ? li : ri;

        while (this.comparator(vals[exchangeIndex], vals[index]) < 0) {
            [vals[index], vals[exchangeIndex]] = [vals[exchangeIndex], vals[index]];
            index = exchangeIndex;
            [li, ri] = [2*index, 2*index+1];
            if (li >= vals.length) break;

            if (ri >= vals.length) {
                exchangeIndex = li;
            } else {
                exchangeIndex = this.comparator(vals[li], vals[ri]) < 0 ? li : ri;
            }
        }

        return result;
    };

    __contents() {
        return this.values.slice(1);
    }
}

module.exports = {heap: Heap};