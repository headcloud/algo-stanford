function add(a, b) {
    if (a == null || b == null) {
        throw new Error(`call add(${a}, ${b}) is incorrect.`);
    }

    let x = a.trim();
    let y = b.trim();
    const len = Math.max(x.length, y.length);

    if (x.length < len) x = x.padStart(len, '0');
    if (y.length < len) y = y.padStart(len, '0');

    let result = '';
    let carry = 0;

    for (let i = len-1; i >= 0; --i) {
        let digit1 = parseInt(x[i], 10);
        let digit2 = parseInt(y[i], 10);
        let sum = digit1 + digit2 + carry;
        let resDigit = sum % 10;
        carry = sum / 10 | 0;
        result = resDigit + result;
    }

    return carry == 0 ? result : carry + result;
}

function sub(a, b) {
    if (a == null || b == null) {
        throw new Error(`call sub(${a}, ${b}) is incorrect.`);
    }

    let x = a.trim();
    let y = b.trim();
    const len = Math.max(x.length, y.length);

    if (x.length < len) x = x.padStart(len, '0');
    if (y.length < len) y = y.padStart(len, '0');

    if (y > x) {
        throw new Error(`unexpected subtraction of bigger ${y} from ${x}`);
    }

    let result = '';
    let carry = 0;

    for (let i = len-1; i >= 0; --i) {
        let digit1 = parseInt(x[i], 10);
        let digit2 = parseInt(y[i], 10);
        if (digit2 > digit1) {
            let carryPlace = i-1;
            while (carry == 0 && carryPlace >= 0) {
                let carryFrom = parseInt(x[carryPlace], 10);
                if (carryFrom > 0) {
                    carry = 1;
                    x = setCharAt(x, carryPlace, carryFrom - 1 + '');
                } else {
                    x = setCharAt(x, carryPlace, '9');
                    carryPlace--;
                }
            }
        }

        let resDigit = (carry * 10 + digit1) - digit2;
        carry = 0;
        result = resDigit + result;
    }

    while(result.charAt(0) == '0') {
        result = result.substring(1);
    }

    return result;
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;

    return str.substring(0, index) + chr + str.substring(index + 1);
}

function multiply(alpha, beta) {
    if (alpha == null || beta == null) {
        throw new Error(`call multiply(${alpha}, ${beta}) is incorrect.`);
    }

    let x = alpha.length > 0 ? alpha.trim() : alpha;
    let y = beta.length > 0 ? beta.trim() : beta;
    let rawLen = Math.max(x.length, y.length);
    const len =  rawLen < 2 || rawLen % 2 == 0 ? rawLen : rawLen + 1;
    const halfLen = Math.trunc(len / 2);

    if (x.length < len) x = x.padStart(len, '0');
    if (y.length < len) y = y.padStart(len, '0');

    if (len <= 1) {
        let digit1 = parseInt(x, 10);
        let digit2 = parseInt(y, 10);
        return new String(digit1 * digit2);
    }

    // 1: split alpha into a and b parts
    let a = x.substring(0, halfLen);
    let b = x.substring(halfLen);
    // 2: split beta into c and d
    let c = y.substring(0, halfLen);
    let d = y.substring(halfLen);
    // 3: calculate a*c
    let ac = multiply(a, c);
    // 4: calculate b*d 
    let bd = multiply(b, d);
    // 5: compute (a+b)*(c+d) - ac - bd  (star)
    let star = sub( sub( multiply(add(a, b), add(c, d)), ac), bd );
    // 6: return (ac) <<  n + (star) << n/2 + (bd)
    let acPadded = ac + Array.from({length: len}, () => '0').join('');
    let starPadded = star + Array.from({length: (len - halfLen)}, () => '0').join('');

    // finally
    let result = add( add(acPadded,starPadded), bd);

    while(result.charAt(0) == '0') {
        result = result.substring(1);
    }

    return result;
}

var a = '3141592653589793238462643383279502884197169399375105820974944592';
var b = '2718281828459045235360287471352662497757247093699959574966967627';
console.log(`a = ${a}`);
console.log(`b = ${b}`);

console.log(`a*b=${multiply(a, b)}`);

// for (let i = 0; i < 1001; ++i) {
//     for (let j = i; j < 1001; ++j) {
//         let res1 = multiply(new String(i), new String(j));
//         let res2 = i * j;
//         if (res1 != res2) {
//             console.log(`multiply(${i}, ${j})=${res1}, but has to be ${res2}`);
//         }
//     }
// }
