/**
 * Created by ds on 24/04/2016.
 */

var fs = require('fs');


var alleleFreq = function (range, vars, refSeq, samples) {

    var refs = refSeq;
    //var samples = samples; // Save the samples for normalisation
    var start = 0;
    var end = 0;
    var variants = {};
    var frequencies = {};

    return {

        read: function () {

            // Parse the range from string
            start = parseRange(range, /:(.*)-/);
            end = parseRange(range, /-(.*)$/);

            // Parse the input variants and extract header
            // Split input into lines
            var lines = vars.split('\n');
            // Remove header line and add id column
            var header = lines.shift();
            header = header.split(/\s+/);
            header.unshift('id');

            // Iterate over lines of variant input
            while (lines.length > 0) {
                // Split lines on whitespace
                var l = lines.shift().split(/\s+/);
                // remove empty fields from beginning of line
                while ( l[0] === '') l.shift();
                // Skip empty lines
                if (l.length < 2) continue;
                // For all columns, save values
                var variant = {};
                variant['sid'] = l[header.indexOf('sid')]; // Using the index allows for a different column order;
                variant['cid'] = l[header.indexOf('cid')];
                variant['alt'] = l[header.indexOf('alt')];
                var nalt = parseInt(l[header.indexOf('nalt')]);
                variant['nalt'] = nalt;
                variant['ref'] = l[header.indexOf('ref')];
                variant['nref'] = parseInt(nalt > 0 ? l[header.indexOf('nref')] : 2);
                var pos = parseInt(l[header.indexOf('pos')]);
                variant['pos'] = parseInt(pos);

                // Save to variants
                if (!variants[pos]) variants[pos] = [];
                variants[pos].push(variant);
            }

        },

        count: function () {
            for ( var i = start; i <= end; i++ ) {
                // If there is no variant entry for this position, set it two homozygous refseq
                //frequencies[i + 1 - start] = { A: 0, C: 0, G: 0, T: 0 }; // Initialise freq
                var count = { A: 0, C: 0, G: 0, T: 0 };
                var sum = 0;
                // If there is no variant at this position, set freq to 2 * number of samples
                if (!variants[i]) {
                    count[refs[i - start]] = 2 * samples.length;
                    sum += 2 * samples.length;
                } else {
                    var numOfVars = variants[i].length; // How many variants are at this position
                    var nref = 2 * (samples.length - numOfVars); // Any allele that homozygous for ref will count to sum.
                    count[refs[i - start]] = nref;
                    sum = nref;
                    variants[i].forEach(function (v) { //iterate over any variants at this position
                        count[v.alt] += v.nalt;
                        count[v.ref] += v.nref;
                        sum += v.nalt + v.nref; // Save the number of occurences to the total;
                    });
                }
                // Normalize count
                for (var base in count) {
                    if (count.hasOwnProperty(base)) {
                        count[base] = +(Math.round((count[base] / sum) + "e+2")  + "e-2"); // JS is weird with floats
                    }
                }
                frequencies[i + 1 - start] = count;
            }
        },

        /*
         Return frequencies as object
         */
        getFrequencies: function () {
            return frequencies;
        },

        /*
         Create output from frequencies
         */
        write: function (path) {
            /*
             We could ommit the filesystem stuff and instead return a string.
             That would retain browser compatibility.
             */

            // Create a default output path;
            if (!path) path = "allele-frequencies-" + new Date().toISOString() + ".txt";
            
            // Sort keys for proper order:
            var sortf = function (a, b) {
                return a - b;
            };
            var positions = Object.keys(frequencies).sort(sortf);
            // Write header line
            var output = 'pos  A C G T\n';
            for (var i = 1; i <= positions.length; i++ ) {
                output += i +
                    ' ' + frequencies[i]['A'] +
                    ' ' + frequencies[i]['C'] +
                    ' ' + frequencies[i]['G'] +
                    ' ' + frequencies[i]['T'] + '\n';

            }
            fs.writeFileSync(path, output);


            //for ( i = 1; i <= positions.length; i++ ) {
//    var currentCount = count[positions[i - 1]];
//    var sum = 0;
//    for (el in currentCount) {
//        if (currentCount.hasOwnProperty(el)) {
//            sum += currentCount[el];
//        }
//    }
//    if (sum > 2) console.log(positions[i - 1] - start, currentCount);
//    var outStr = i +
//        ' ' + (currentCount['A'] / sum) +
//        ' ' + (currentCount['C'] / sum) +
//        ' ' + (currentCount['T'] / sum) +
//        ' ' + (currentCount['G'] / sum) + ' ' + sum + '\n';
//    ws.write(outStr);
//}

        }

    };

    /**
     * Extract start and end positions from range
     *
     * This will match the positions with a regex.
     * To remove the commas the strings are then
     * split and rejoined and then parsed as integers.
     * @param range Range String (Example: Chr17:41,196,312-41,197,819)
     * @param regex matching
     * @returns {Number}
     */
    function parseRange  (range, regex) {
        return parseInt(range.match(regex)[1].split(',').join(''));
    }


};


module.exports = alleleFreq;