/* eslint-disable no-sync */

var chai = require( 'chai' );
var mocha = require( 'mocha' );
var ws = require( '../src/wink-sentiment.js' );
var fs = require( 'fs' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

// Validate stem test cases given by Dr Martin F Porter for Porter Stemmer Algoritm V2.
describe( 'basic test cycle', function () {
  it( 'should return a score of 0 with empty text', function () {
    expect( ws( '' ) ).to.deep.equal( { score: 0, normalizedScore: 0 } );
    expect( ws( '  ' ) ).to.deep.equal( { score: 0, normalizedScore: 0 } );
  } );

  it( 'should return a score of 4/1.333 with "I am feeling good"', function () {
    expect( ws( 'I am feeling good' ) ).to.deep.equal( {
      score: 4,
      normalizedScore: 1.3333333333333333,
      tokenizedPhrase: [
        { token: 'I', tag: 'word' },
        { token: 'am', tag: 'word' },
        { token: 'feeling', tag: 'word', score: 1 },
        { token: 'good', tag: 'word', score: 3 }
      ]
    } );
  } );

  it( 'should return a score of -3/-1 with "not a good product"', function () {
    expect( ws( 'not a good product' ) ).to.deep.equal( {
       score: -3,
       normalizedScore: -1,
       tokenizedPhrase: [
         { token: 'not', tag: 'word' },
         { token: 'a', tag: 'word' },
         { token: 'good', tag: 'word', score: -3, negation: true },
         { token: 'product', tag: 'word' }
       ]
     } );
  } );

  it( 'should return a score of 3/1.5 with "good product"', function () {
    expect( ws( 'good product' ) ).to.deep.equal( {
       score: 3,
       normalizedScore: 1.5,
       tokenizedPhrase: [
         { token: 'good', tag: 'word', score: 3 },
         { token: 'product', tag: 'word' }
       ]
     } );
  } );

  it( 'should return a score of -2/-1 with "bad luck"', function () {
    expect( ws( 'bad luck' ) ).to.deep.equal( {
      score: -2,
      normalizedScore: -1,
      tokenizedPhrase: [
        { token: 'bad', tag: 'word', score: -2, grouped: 1 },
        { token: 'luck', tag: 'word' }
      ]
    } );
  } );

  it( 'should return a score of 2/0.666 with "not bad luck"', function () {
    expect( ws( 'not bad luck' ) ).to.deep.equal( {
      score: 2,
      normalizedScore: 0.6666666666666666,
      tokenizedPhrase: [
        { token: 'not', tag: 'word' },
        { token: 'bad', tag: 'word', score: 2, negation: true, grouped: 1 },
        { token: 'luck', tag: 'word' }
      ]
    } );
  } );

  it( 'should return a score of 6/2 with "love you <3"', function () {
    expect( ws( 'love you <3' ) ).to.deep.equal( {
      score: 6,
      normalizedScore: 2,
      tokenizedPhrase: [
        { token: 'love', tag: 'word', score: 3 },
        { token: 'you', tag: 'word' },
        { token: '<3', tag: 'emoticon', score: 3 }
      ]
    } );
  } );

  it( 'should return a score of 6/2 with "love you<3"', function () {
    expect( ws( 'love you<3' ) ).to.deep.equal( {
      score: 6,
      normalizedScore: 2,
      tokenizedPhrase: [
        { token: 'love', tag: 'word', score: 3 },
        { token: 'you', tag: 'word' },
        { token: '<3', tag: 'emoticon', score: 3 }
      ]
    } );
  } );

  it( 'should return a score of 8/2 with "love you<3 :)"', function () {
    expect( ws( 'love you<3 :)' ) ).to.deep.equal( {
      score: 8,
      normalizedScore: 2,
      tokenizedPhrase: [
        { token: 'love', tag: 'word', score: 3 },
        { token: 'you', tag: 'word' },
        { token: '<3', tag: 'emoticon', score: 3 },
        { token: ':)', tag: 'emoticon', score: 2 }
      ]
    } );
  } );

  it( 'should return a score of 12/2.4 with "love you<3 😍😃"', function () {
    expect( ws( 'love you<3 😍😃' ) ).to.deep.equal( {
      score: 12,
      normalizedScore: 2.4,
      tokenizedPhrase: [
        { token: 'love', tag: 'word', score: 3 },
        { token: 'you', tag: 'word' },
        { token: '<3', tag: 'emoticon', score: 3 },
        { token: '😍', tag: 'emoji', score: 3 },
        { token: '😃', tag: 'emoji', score: 3 }
      ]
    } );
  } );

  it( 'should return a score of 0/0 with "unknownword"', function () {
    expect( ws( 'unknownword' ) ).to.deep.equal( {
      score: 0,
      normalizedScore: 0,
      tokenizedPhrase: [
        { token: 'unknownword', tag: 'word' }
      ]
    } );
  } );

  it( 'should throw error with undefined input', function () {
    expect( ws.bind( null ) ).to.throw( 'wink-sentiment: input phrase must be a string, instead found: undefined' );
  } );

  it( 'should throw error with non-string input', function () {
    expect( ws.bind( null, 10 ) ).to.throw( 'wink-sentiment: input phrase must be a string, instead found: number' );
  } );
} );

describe( 'validate with amazon product review data from UCI', function () {
  // To be on safe side with travis!
  this.timeout(3600);
  // Load Amazon Product Review [Sentiment Labelled Sentences Data Set](https://archive.ics.uci.edu/ml/machine-learning-databases/00331/)
  // at [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/index.php).
  var input = fs.readFileSync( './test/data/amazon_cells_labelled.txt', 'utf8' ).split( '\n' );

  input.pop();
  var fn = 0,
      fp = 0,
      tn = 0,
      tp = 0;
  input.forEach( function ( row ) {
    var cols = row.split( '\t' );
    if ( +cols[ 1 ] === 1 ) {
      if ( ws( cols[0] ).score >= 0 ) tp += 1;
      if ( ws( cols[0] ).score < 0 ) fn += 1;
    } else {
      if ( ws( cols[0] ).score < 0 ) tn += 1;
      if ( ws( cols[0] ).score >= 0 ) fp += 1;
    }
  } );

  var precision = tp / ( tp + fp );
  var recall = tp / ( tp + fn );
  // Reduce verbosity of test output by moving `it` outside the `forEach`.
  it( 'it should achieve an accuracy of 77%', function () {
    expect( Math.round( ( tp + tn ) * 100 / ( tp + tn + fp + fn ) ) ).to.equal( 77 );
  } );

  it( 'it should achieve an recall of 98%', function () {
    expect( Math.round( recall * 100 ) ).to.equal( 98 );
  } );

  it( 'it should achieve an precision of 69%', function () {
    expect( Math.round( precision * 100 ) ).to.equal( 69 );
  } );

  it( 'it should achieve an f-measure of 0.81', function () {
    expect( +( 2 * precision * recall / ( precision + recall ) ).toFixed( 2 ) ).to.equal( 0.81 );
  } );
} );
