# allele frequency calculation

This module will calculate the allele frequencies of a sequence from a list of variations, a reference sequence, a genomic range and a list of samples.

## Installation 

Clone the repository and run `npm install`.
  
## Usage

Import the AlleleFreq function into your script using

`var AF = require('./lib/allele-frequencies') // The path to the allele-frequencies.js file`

Create an instance of the calculator and count the frequencies: 

```javascript
var freqCalculator = new AF(samples, range, refs, vars);
freqCalculator.read(); // This will read the input
freqCalculator.count; // This will create the frequency table
```

The frequencies can be returned in two ways:
```javascript
var freq = freqCalculator.getFrequencies(); // Will return freqs as an object
freqCalculator.write(path);                  // Will write results to file at path. Default path exists.
```


The instantiation requires the Sample IDs, the range, a reference sequence and the list of variants.

variants is a table giving the reference base and the mutated base for each
sample at each location where a mutation exists.  The columns are:
'sid' - The sample ID
'cid' - The chromosome name
'pos' - The position of the variant on the chromosome
'alt' - The mutated base for this sample
'nalt' - The number of alleles that have the alternate base in this sample (either 1 or 2)
'ref' - The reference base at this location
'nref' - The number of alleles that have the reference base in this sample (either 1 or 0)
Note that a row will only show in this table when a sample differs from the
reference (i.e., nalt>0).

For example: 

``` 
sid   cid      pos alt nalt ref nref
1   1 chr17 41196408   A    1   G    1
2   1 chr17 41197274   A    1   C    1
3   2 chr17 41196841   T    1   G    1
4   3 chr17 41196408   A    1   G    1
5   3 chr17 41197274   A    1   C    1
6   6 chr17 41196408   A    1   G    1
7   6 chr17 41197274   A    1   C    1
8  10 chr17 41196408   A    1   G    1
9  10 chr17 41197274   A    1   C    1
```


## Support

If you have any problem or suggestion please open an issue [here](https://github.com/DennisSchwartz/allele-freq/issues).

## License 

The MIT License

Copyright (c) 2016, Dennis Schwartz

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.