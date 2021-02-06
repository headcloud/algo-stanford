 function multiply(m:string, n:string) : string {
     if (!m || !n || m.length == 0 || n.length == 0) {
         throw new RangeError('Wrong multiplication parameters.');
     }

    if (m.length < 2 || n.length < 2) {
        return parseInt(m) * parseInt(n) + '';
    }
    // 0: define n;
    const N:number = Math.max(m.length, n.length);
    const halfN:number = N / 2 | 0;
    // 1: split first into a and b
    const mSplit:number = m.length - halfN;
    let a:string = m.substring(0, mSplit);
    let b:string = m.substring(mSplit); 
    // 2: split second into c and d
    const nSplit = n.length - halfN;
    let c = n.substring(0, nSplit);
    let d = n.substring(nSplit);
    // 3: call multiply(a, c) (*)
    let ac = parseInt(multiply(a, c));
    // 4: call multiply(b, d) (**)
    let bd = parseInt(multiply(b, d));
    // 5: compute multiply(a+b, c+d) - (*) - (**) ->  (***)
    let abSum = parseInt(a) + parseInt(b);
    let cdSum = parseInt(c) + parseInt(d);
    let zzz = parseInt(multiply(abSum+'', cdSum+''));
    let xxx = zzz - ac - bd;
    // 6: return (*) <<  n + (***) << n/2 + (**)
     
    return (ac * Math.pow(10, N)) + (xxx * Math.pow(10, halfN)) + bd +'';
}

var a:string = '2233';
var b:string = '1155';

var product:string = multiply(a, b);

console.log(`${a} * ${b} = ${product}`);
