/**
 * Created by ds on 24/04/2016.
 */

// chai is an assertion library
var chai = require('chai');

// @see http://chaijs.com/api/assert/
var assert = chai.assert;

// register alternative styles
// @see http://chaijs.com/api/bdd/
var expect = require('chai').expect;
var should = chai.should();

var AlleleFreq = require('../lib/allele-frequencies');


/*
    Allele frequency calculator module
 */

describe('Allele Frequency Calculation', function() {
    describe('Input reader', function() {
        var variants, refs, range, samples;
        var AF;
        before(function() {
            variants = 'sid   cid      pos      alt nalt ref nref\n\
            1    1   chr17   41196408   A    1   G    1\n\
            \n\
            2    1   chr17   41197274   A    1   C    1\n';

            refs = "TGGAAGTGTTTGCTACCAAGTTTATTTGCAGTGTTAACAGCACAACATTTACAAAACGTATTTTGTACAATCAAGTCTTCACTGCCCTTGCACACTGGGGGGGCTAGG" +
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


            range = 'Chr17:41,196,312-41,197,819';
            samples = "1,2,3,5,6,10";



        });

        it('Reader should handle empty lines', function() {
            AF = new AlleleFreq(samples, range, refs, variants);

            var res = {
                41196408: [{
                    sid: "1",
                    cid: "chr17",
                    pos: 41196408,
                    alt: "A",
                    nalt: 1,
                    ref: "G",
                    nref: 1
                }],
                41197274: [{
                    sid: "1",
                    cid: "chr17",
                    pos: 41197274,
                    alt: "A",
                    nalt: 1,
                    ref: "C",
                    nref: 1
                }]
            };

            AF.read(function (v) {
                expect(v).to.deep.equal(res);
            });

        });

        it('Reader should handle spaces in range', function() {

            range = 'Chr17 : 41,196,312 - 41,197,819';
            AF = new AlleleFreq(samples, range, refs, variants);
            AF.read(function (v, s, e) {
                s.should.equal(41196312);
                e.should.equal(41197819);
            })
        });

        it('Reader should handle missing commas in range', function() {

            range = 'Chr17:41196312-41197819';
            AF = new AlleleFreq(samples, range, refs, variants);
            AF.read(function (v, s, e) {
                s.should.equal(41196312);
                e.should.equal(41197819);
            })
        });
        //
        //it('should have a name as has been set', function() {
        //    expect(this.node.get("id")).to.equal(this.id);
        //});
        //
        //it('should be an instance of the Node model', function() {
        //    expect(this.node).to.be.an.instanceOf(Node);
        //})
    });
});