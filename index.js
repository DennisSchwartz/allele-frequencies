/**
 * Created by ds on 24/04/2016.
 *
 * This will calculate the allele frequencies in the given output from a variants database.
 * This first attempt assumes correctness of the input format and that the original query is available.
 */


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
var start = parseInt(range.match(/:(.*)-/)[1]); // [1] to return only matching group
var end = parseInt(range.match(/-(.*)$/)[1]);

// Initialize output:
var count = {};
for ( var i = 1; i <= refs.length; i++ ) {
    count[i + start] = { A: 0, C: 0, G: 0, T: 0 };
    count[i + start][refs[i - 1]]++; // Add 1 for the base in ref
}

console.log(count);
// Split input into lines
var lines = variants.split('\n');
// Remove header line
var header = 'id ' + lines.shift();

while (lines.length > 0) {
    // Split lines on whitespace
    var l = lines.shift().split(/\s+/);
    l.shift();
    // Skip empty lines
    if (l.length < 8) continue;
    console.log(l);
}