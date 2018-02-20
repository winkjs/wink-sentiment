//     wink-sentiment
//     Accurate and fast sentiment scoring of phrases with hashtags, emoticons & emojis.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-sentiment”.
//
//     “wink-sentiment” is free software: you can redistribute
//     it and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-sentiment” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-sentiment”.
//     If not, see <http://www.gnu.org/licenses/>.

//
/* eslint-disable no-sync */

var chai = require( 'chai' );
var mocha = require( 'mocha' );
var ws = require( '../src/wink-sentiment.js' );
var fs = require( 'fs' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

// Validate stem test cases given by Dr Martin F Porter for Porter Stemmer Algoritm V2.
describe( 'sentiment', function () {
  it( 'should return a score of 0 with empty text', function () {
    expect( ws( '' ) ).to.deep.equal( { score: 0, normalizedScore: 0 } );
    expect( ws( '  ' ) ).to.deep.equal( { score: 0, normalizedScore: 0 } );
  } );

  it( 'should return a score of 4/2 with "I am feeling good"', function () {
    expect( ws( 'I am feeling Good' ) ).to.deep.equal( {
      score: 4,
      normalizedScore: 2,
      tokenizedPhrase: [
        { value: 'I', tag: 'word' },
        { value: 'am', tag: 'word' },
        { value: 'feeling', tag: 'word', score: 1 },
        { value: 'Good', tag: 'word', score: 3 }
      ]
    } );
  } );

  it( 'should return a score of -3/-3 with "Not a good product"', function () {
    // Case insensitive comparison at -2
    expect( ws( 'Not a good product' ) ).to.deep.equal( {
       score: -3,
       normalizedScore: -3,
       tokenizedPhrase: [
         { value: 'Not', tag: 'word' },
         { value: 'a', tag: 'word' },
         { value: 'good', tag: 'word', score: -3, negation: true },
         { value: 'product', tag: 'word' }
       ]
     } );
  } );

  it( 'should return a score of -3/-3 with "Not good product"', function () {
    // Case insensitive comparison at -1
    expect( ws( 'Not good product' ) ).to.deep.equal( {
       score: -3,
       normalizedScore: -3,
       tokenizedPhrase: [
         { value: 'Not', tag: 'word' },
         { value: 'good', tag: 'word', score: -3, negation: true },
         { value: 'product', tag: 'word' }
       ]
     } );
  } );

  it( 'should return a score of 3/3 with "good product"', function () {
    expect( ws( 'good product' ) ).to.deep.equal( {
       score: 3,
       normalizedScore: 3,
       tokenizedPhrase: [
         { value: 'good', tag: 'word', score: 3 },
         { value: 'product', tag: 'word' }
       ]
     } );
  } );

  it( 'should return a score of -2/-2 with "it was my bad luck"', function () {
    // Test bi-gram config along with it's case insensitivity (**L**uck).
    expect( ws( 'it was my bad Luck' ) ).to.deep.equal( {
      score: -2,
      normalizedScore: -2,
      tokenizedPhrase: [
        { value: 'it', tag: 'word' },
        { value: 'was', tag: 'word' },
        { value: 'my', tag: 'word' },
        { value: 'bad', tag: 'word', score: -2, grouped: 1 },
        { value: 'Luck', tag: 'word' }
      ]
    } );
  } );

  it( 'should return a score of 2/2 with "it was not my bad luck"', function () {
    expect( ws( 'it was not my bad luck' ) ).to.deep.equal( {
      score: 2,
      normalizedScore: 2,
      tokenizedPhrase: [
        { value: 'it', tag: 'word' },
        { value: 'was', tag: 'word' },
        { value: 'not', tag: 'word' },
        { value: 'my', tag: 'word' },
        { value: 'bad', tag: 'word', score: 2, negation: true, grouped: 1 },
        { value: 'luck', tag: 'word' }
      ]
    } );
  } );

  it( 'should return a score of 6/3 with "love you <3"', function () {
    expect( ws( 'love you <3' ) ).to.deep.equal( {
      score: 6,
      normalizedScore: 3,
      tokenizedPhrase: [
        { value: 'love', tag: 'word', score: 3 },
        { value: 'you', tag: 'word' },
        { value: '<3', tag: 'emoticon', score: 3 }
      ]
    } );
  } );

  it( 'should return a score of 6/3 with "love you<3"', function () {
    expect( ws( 'love you<3' ) ).to.deep.equal( {
      score: 6,
      normalizedScore: 3,
      tokenizedPhrase: [
        { value: 'love', tag: 'word', score: 3 },
        { value: 'you', tag: 'word' },
        { value: '<3', tag: 'emoticon', score: 3 }
      ]
    } );
  } );

  it( 'should return a score of 8/2.6666666666666665 with "love you<3 :)"', function () {
    expect( ws( 'love you<3 :)' ) ).to.deep.equal( {
      score: 8,
      normalizedScore: 2.6666666666666665,
      tokenizedPhrase: [
        { value: 'love', tag: 'word', score: 3 },
        { value: 'you', tag: 'word' },
        { value: '<3', tag: 'emoticon', score: 3 },
        { value: ':)', tag: 'emoticon', score: 2 }
      ]
    } );
  } );

  it( 'should return a score of 12/3 with "love you<3 😍😃"', function () {
    expect( ws( 'love you<3 😍😃' ) ).to.deep.equal( {
      score: 12,
      normalizedScore: 3,
      tokenizedPhrase: [
        { value: 'love', tag: 'word', score: 3 },
        { value: 'you', tag: 'word' },
        { value: '<3', tag: 'emoticon', score: 3 },
        { value: '😍', tag: 'emoji', score: 3 },
        { value: '😃', tag: 'emoji', score: 3 }
      ]
    } );
  } );

  it( 'should return a score of 0/0 with "unknownword"', function () {
    expect( ws( 'unknownword' ) ).to.deep.equal( {
      score: 0,
      normalizedScore: 0,
      tokenizedPhrase: [
        { value: 'unknownword', tag: 'word' }
      ]
    } );
  } );

  it( 'should return a score of 0/0 with unknown emoji "🚀"', function () {
    expect( ws( '🚀' ) ).to.deep.equal( {
      score: 0,
      normalizedScore: 0,
      tokenizedPhrase: [
        { value: '🚀', tag: 'emoji' }
      ]
    } );
  } );

  it( 'should return a score of 0/0 with unknown emoji ";/"', function () {
    expect( ws( ';/' ) ).to.deep.equal( {
      score: 0,
      normalizedScore: 0,
      tokenizedPhrase: [
        { value: ';/', tag: 'emoticon' }
      ]
    } );
  } );

  it( 'should return a handle a sentence with unknown emoji & emoticon', function () {
    expect( ws( 'useless🚀 product;/' ) ).to.deep.equal( {
      score: -2,
      normalizedScore: -2,
      tokenizedPhrase: [
        { value: 'useless', tag: 'word', score: -2 },
        { value: '🚀', tag: 'emoji' },
        { value: 'product', tag: 'word' },
        { value: ';/', tag: 'emoticon' }
      ]
    } );
  } );

  it( 'should return a score of 12/3 with "#love you<3 😍😃 #unknown"', function () {
    // This will ensure both known & unknown hashtags are tested.
    expect( ws( '#love you<3 😍😃 #unknown' ) ).to.deep.equal( {
      score: 12,
      normalizedScore: 3,
      tokenizedPhrase: [
        { value: '#love', tag: 'hashtag', score: 3 },
        { value: 'you', tag: 'word' },
        { value: '<3', tag: 'emoticon', score: 3 },
        { value: '😍', tag: 'emoji', score: 3 },
        { value: '😃', tag: 'emoji', score: 3 },
        { value: '#unknown', tag: 'hashtag' }
      ]
    } );
  } );

  it( 'should return a score of 12/3 with "It was a #fail product"', function () {
    // This will ensure both known & unknown hashtags are tested.
    expect( ws( 'it was a #Fail product' ) ).to.deep.equal( {
      score: -2,
      normalizedScore: -2,
      tokenizedPhrase: [
        { value: 'it', tag: 'word' },
        { value: 'was', tag: 'word' },
        { value: 'a', tag: 'word' },
        { value: '#Fail', tag: 'hashtag', score: -2 },
        { value: 'product', tag: 'word' }
      ]
    } );
  } );

  it( 'should return a score of 5/2.0189 with >15 words sentence', function () {
    // This will trigger condition when # words > 15 (average sentence length).
    expect( ws( 'Sound quality on both end is excellent, I use headset to call my wife and ask my wife to use headset to call me!' ) ).to.deep.equal( {
      score: 5,
      normalizedScore: 2.0189321327181204,
      tokenizedPhrase: [
        { value: 'Sound', tag: 'word' },
        { value: 'quality', tag: 'word', score: 2 },
        { value: 'on', tag: 'word' },
        { value: 'both', tag: 'word' },
        { value: 'end', tag: 'word' },
        { value: 'is', tag: 'word' },
        { value: 'excellent', tag: 'word', score: 3 },
        { value: ',', tag: 'punctuation' },
        { value: 'I', tag: 'word' },
        { value: 'use', tag: 'word' },
        { value: 'headset', tag: 'word' },
        { value: 'to', tag: 'word' },
        { value: 'call', tag: 'word' },
        { value: 'my', tag: 'word' },
        { value: 'wife', tag: 'word' },
        { value: 'and', tag: 'word' },
        { value: 'ask', tag: 'word' },
        { value: 'my', tag: 'word' },
        { value: 'wife', tag: 'word' },
        { value: 'to', tag: 'word' },
        { value: 'use', tag: 'word' },
        { value: 'headset', tag: 'word' },
        { value: 'to', tag: 'word' },
        { value: 'call', tag: 'word' },
        { value: 'me', tag: 'word' },
        { value: '!', tag: 'punctuation' }
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
