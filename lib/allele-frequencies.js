/**
 * Created by ds on 24/04/2016.
 */


var alleleFreq = function (range, vars, refSeq) {

    var refs = refSeq;
    var samples = []; // Save the samples for normalisation
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

            // Iterate over input
            while (lines.length > 0) {
                // Split lines on whitespace
                var l = lines.shift().split(/\s+/);
                // remove empty fields from beginning of line
                while ( l[0] === '') l.shift();
                // Skip empty lines
                if (l.length < 2) continue;
                // For all columns, save values
                var variant = {};
                var sid = l[header.indexOf('sid')]; // This allows for a different column order
                variant['sid'] = sid;
                if (samples.indexOf(sid) < 0) samples.push(sid); // Add only if not present
                variant['cid'] = l[header.indexOf('cid')];
                variant['alt'] = l[header.indexOf('alt')];
                var nalt = parseInt(l[header.indexOf('nalt')]);
                variant['nalt'] = nalt;
                variant['ref'] = l[header.indexOf('ref')];
                variant['nref'] = parseInt(nalt > 0 ? l[header.indexOf('nref')] : 2);
                var pos = parseInt(l[header.indexOf('pos')]);
                variant['pos'] = pos;

                // Save to variants
                if (!variants[pos]) variants[pos] = [];
                variants[pos].push(variant);
            }

        },

        count: function () {
            for ( var i = start; i <= end; i++ ) {
                // If there is no variant entry for this position, set it two homozygous refseq
                frequencies[i] = { A: 0, C: 0, G: 0, T: 0 }; // Initialise freq

                // If there is no variant at this position, set freq to 2 * number of samples
                if (!variants[i]) {
                    frequencies[i][refs[i - start]] = 1;
                } else {
                    var numOfVars = frequencies[i].length; // How many variants are at this position
                    var count = { A: 0, C: 0, G: 0, T: 0 };
                    var nref = 2 * (samples.length - numOfVars);
                    count[refs[i - start]] = nref;
                    var sum = nref;
                    variants[i].forEach(function (v) { //iterate over any variants at this position
                        count[v.alt] += v.nalt;
                        sum += v.nalt;
                        count[v.ref] += v.ref;
                    });
                    // Normalize count
                    for (var base in count) {
                        if (count.hasOwnProperty(base)) {
                            frequencies[i][base] = count[base] / sum;
                        }
                    }
                }
            }
        },

        getFrequencies: function () {
            return frequencies;
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


    function parseInput ( input ) {

    }
};


module.exports = alleleFreq;