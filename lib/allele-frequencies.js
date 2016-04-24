/**
 * Created by ds on 24/04/2016.
 * This will calculate the allele frequencies in the given output from a variants database.
 * I am assuming access to the query data (Sample IDs and range).
 */

var fs = require('fs');


var AlleleFreq = function (samples, range, refSeq, vars) {

    var refs = refSeq;
    if (typeof samples === 'string') {
        samples = samples.split(',');
    }
    // Parse the range from string
    var start = parseRange(range, /:(.*)-/);
    var end = parseRange(range, /-(.*)$/);
    if (start === end || end < start) {
        throw new Error("Invalid range!", range);
    }

    var variants = {};
    var frequencies = {};

    return {

        /**
         *  This function parses the list of variants and other input. The variants are
         *  stored in a list by their position. This way, the list input list is only iterated once.
         *
         *  An optional callback is available which has the variants
         *  and the beginning and end of the range as parameters. Mostly used for testing.
         */
        read: function (cb) {

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
                // For all columns, save values in object
                var variant = {};
                variant['sid'] = l[header.indexOf('sid')]; // Using the index allows for a different column order;
                variant['cid'] = l[header.indexOf('cid')];
                variant['alt'] = l[header.indexOf('alt')];
                variant['nalt'] = parseInt(l[header.indexOf('nalt')]);
                variant['ref'] = l[header.indexOf('ref')];
                variant['nref'] = parseInt(l[header.indexOf('nref')]);
                var pos = parseInt(l[header.indexOf('pos')]);
                variant['pos'] = pos;

                // Save to list of variants at this position.
                if (!variants[pos]) variants[pos] = [];
                variants[pos].push(variant);
            }

            /*
                Optional callback function. (Mainly for testing)
             */
            if (cb) cb(variants, start, end);
        },

        /**
         * This will calculate the frequencies from the variant list and sample IDs.
         *
         */
        calculateFrequencies: function () {
            // Check if any variants have been parsed
            if (Object.keys(variants).length === 0 && JSON.stringify(variants) === JSON.stringify({})) {
                console.error("WARNING: There are not variants found. Please check your input file!");
            }
            for ( var i = start; i <= end; i++ ) {
                var count = { A: 0, C: 0, G: 0, T: 0 };
                // If there is no variant at this position, set it to homozygous -> freq to 2 * number of samples
                if (!variants[i]) {
                    count[refs[i - start]] = 2 * samples.length;
                } else {
                    // How many variants are at this position?
                    var numOfVars = variants[i].length;
                    // Any allele that is homozygous for ref will calculateFrequencies to sum of reference bases.
                    var nref = 2 * (samples.length - numOfVars);
                    // Set it to the base at current position of the ref sequence
                    count[refs[i - start]] = nref;
                    //iterate over all variants found at this position
                    variants[i].forEach(function (v) {
                        count[v.alt] += v.nalt;
                        count[v.ref] += v.nref;
                        // Save the number of variants to the total;
                    });
                }
                var sum =  2 * samples.length; // The total number of alleles is always the same
                // Normalize calculateFrequencies
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
            if (Object.getOwnPropertyNames(frequencies).length === 0) {
                console.error("The frequencies have not been calculated yet. " +
                    "Please run read() and calculateFrequencies() first!")
            }
            return frequencies;
        },

        /*
         Create output from frequencies
         */
        writeToFile: function (path) {
            /*
             We could leave out the filesystem stuff and instead return a string.
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

            // Try to writeToFile output to file.
            try {
                fs.writeFileSync(path, output);
            } catch (err) {
                console.error("Error writing to file!", err);
                console.log("Data to writeToFile: ", output);
            }
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


module.exports = AlleleFreq;