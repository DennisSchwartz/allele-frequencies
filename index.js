/**
 * Created by ds on 24/04/2016.
 *
 * This will calculate the allele frequencies in the given output from a variants database.
 * This first attempt assumes correctness of the input format and that the original query is available.
 */

var fs = require('fs');
/*
   Return from variant query. In this case as a string?
 */
var variants = 'sid   cid      pos      alt nalt ref nref\n\
            1    1   chr17   41196408   A    1   G    1\n\n\
            2    1   chr17   41197274   A    1   C    1\n\
            3    2   chr17   41196841   T    1   G    1\n\
            4    3   chr17   41196408   A    1   G    1\n\
            5    3   chr17   41197274   A    1   C    1\n\
            6    6   chr17   41196408   A    1   G    1\n\
            7    6   chr17   41197274   A    1   C    1\n\
            8   10   chr17   41196408   A    1   G    1\n\
            9   10   chr17   41197274   A    1   C    1';

/*
    Can I assume variants come as a JSON encoded JS object?
 */

var variantsObject = {
    1: {
        sid: 1,
        cid: "chr17",
        pos: 41196408,
        alt: "A",
        nalt: 1,
        ref: "G",
        nnref: 1
    },
    2: {
        sid: 1,
        cid: "chr17",
        pos: 41197274,
        alt: "A",
        nalt: 1,
        ref: "C",
        nnref: 1
    }
};


/*
    Reference sequence
 */
var refs = "TGGAAGTGTTTGCTACCAAGTTTATTTGCAGTGTTAACAGCACAACATTTACAAAACGTATTTTGTACAATCAAGTCTTCACTGCCCTTGCACACTGGGGGGGCTAGG" +
    "GAAGACCTAGTCCTTCCAACAGCTATAAACAGTCCTGGATAATGGGTTTATGAAAAACACTTTTTCTTCCTTCAGCAAGCAAAATTATTTATGAAGCTGTATGGTTTCAGCAACA" +
    "GGGAGCAAAGGAAAAAAATCACCTCAAAGAAAGCAACAGCTTCCTTCCTGGTGGGATCTGTCATTTTATAGATATGAAATATTCATGCCAGAGGTCTTATATTTTAAGAGGAATG" +
    "GATTATATACCAGAGCTACAACAATAAACATTTTACTTATTACTAATGAGGAATTAGAAGACTGTCTTTGGAAACCGGTTCTTGAAAATCTTCTGCTGTTTTAGAACACATTCTT" +
    "TAGAAATCTAGCAAATATATCTCAGACTTTTAGAAATCTCTTCTAGTTTCATTTTCCTTTTTTTTTTTTTTTTTTTGAGCCACAGTCTCACTGTCACCCAGGCTGGAGTGCCGTG" +
    "GTATGATCTTGGCTCACTGCAACCTCCACCTCCCGGGCTGAAGTGATTCTCCTGCCTTAGCCACCTGAGTAGCTGGGATTACAGGTGTCCACCACCATGACCGGCTAATTTCTGT" +
    "ATTTTTAGTAGAGATGGGGTTTCACCATGTTGGCCAGGCTGGTTTCGAACTCCTGACCTCCAGTGATCTGCCCACCTTGGCCTCCCAAAGTGCTGGGATTACAGGCGTGAGCCAC" +
    "CATGCCCAGGTTTCAAGTTTCCTTTTCATTTCTAATACCTGCCTCAGAATTTCCTCCCCAATGTTCCACTCCAACATTTGAGAACTGCCCAAGGACTATTCTGACTTTAAGTCAC" +
    "ATAATCGATCCCAAGCACTCTCCTTCCATTGAAGGGTCTGACTCTCTGCCTTTGTGAACACAGGGTTTTAGAGAAGTAAACTTAGGGAAACCAGCTATTCTCTTGAGGCCAAGCC" +
    "ACTCTGTGCTTCCAGCCCTAAGCCAACAACAGCCTGAATAGAAAGAATAGGGCTGATAAATAATGAATCAGCATCTTGCTCAATTGGTGGCGTTTAAATGGTTTTAAAATCTTCT" +
    "CAGGTGAAAAATTACCATAATTTTGTGCTCATGGCAGATTTCCAAGGGAGACTTCAAGCAGAAAATCTTTAAGGGACCCTTGCATAGCCAGAAGTCCTTTTCAGGCTGATGTACA" +
    "TAAAATATTTAGTAGCCAGGACAGTAGAAGGACTGAAGAGTGAGAGGAGCTCCCAGGGCCTGGAAAGGCCACTTTGTAAGCTCATTCTTGGGGTCCTGTGGCTCTGTACCTGTGG" +
    "CTGGCTGCAGTCAGTAGTGGCTGTGGGGGATCTGGGGTATCAGGTAGGTGTCCAGCTCCTGGCACTGGTAGAGTGCTACACTGTCCAACACCCACTCTCGGGTCACCACAGGTGC" +
    "CTCACACATCTGCCCAATTG";


var range = 'Chr17:41,196,312-41,197,819';
var start = range.match(/:(.*)-/)[1]; // [1] to return only matching group
start = parseInt(start.split(',').join('')); // Convert string with commas into integer
var end = range.match(/-(.*)$/)[1];
end = parseInt(end.split(',').join(''));


// Initialize output:
var count = {};
for ( var i = 0; i < refs.length; i++ ) {
    count[i + start] = { A: 0, C: 0, G: 0, T: 0 };
    count[i + start][refs[i]] = 2; // Add 1 for the base in ref
}

// Split input into lines
var lines = variants.split('\n');
// Remove header line
var header = lines.shift();
header = header.split(/\s+/);
header.unshift('id');

while (lines.length > 0) {
    // Split lines on whitespace
    var l = lines.shift().split(/\s+/);
    while ( l[0] === '') l.shift(); // remove empty fields from beginning of line
    // Skip empty lines
    if (l.length < 7) continue;
    var alt = l[header.indexOf('alt')]; // This allows for a different column order
    var nalt = parseInt(l[header.indexOf('nalt')]);
    var ref = l[header.indexOf('ref')];
    var nref = parseInt(nalt > 0 ? l[header.indexOf('nref')] : 2);
    var pos = parseInt(l[header.indexOf('pos')]);
    count[pos][alt] += nalt;
    count[pos][ref] += nref;
}

/*
    Create output from count
 */

var ws = fs.createWriteStream('output.txt');
ws.write('pos   A   C   G   T\n');
// Sort keys for proper order:
var sortf = function (a, b) {
    return a - b;
};
var positions = Object.keys(count).sort(sortf);
for ( i = 1; i <= positions.length; i++ ) {
    var currentCount = count[positions[i - 1]];
    var sum = 0;
    for (el in currentCount) {
        if (currentCount.hasOwnProperty(el)) {
            sum += currentCount[el];
        }
    }
    if (sum > 2) console.log(positions[i - 1] - start, currentCount);
    var outStr = i +
        ' ' + (currentCount['A'] / sum) +
        ' ' + (currentCount['C'] / sum) +
        ' ' + (currentCount['T'] / sum) +
        ' ' + (currentCount['G'] / sum) + ' ' + sum + '\n';
    ws.write(outStr);
}
