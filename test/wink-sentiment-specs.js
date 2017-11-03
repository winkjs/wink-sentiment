/* eslint-disable no-sync */

var chai = require( 'chai' );
var mocha = require( 'mocha' );
var ws = require( '../src/wink-sentiment.js' );

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
    expect( ws( 'I am feeling good' ) ).to.deep.equal( { score: 4, normalizedScore: 1.3333333333333333 } );
  } );

  it( 'should return a score of -3/-1 with "not a good product"', function () {
    expect( ws( 'not a good product' ) ).to.deep.equal( { score: -3, normalizedScore: -1 } );
  } );

  it( 'should return a score of -2/-1 with "bad luck"', function () {
    expect( ws( 'bad luck' ) ).to.deep.equal( { score: -2, normalizedScore: -1 } );
  } );

  it( 'should return a score of 2/0.666 with "not bad luck"', function () {
    expect( ws( 'not bad luck' ) ).to.deep.equal( { score: 2, normalizedScore: 0.6666666666666666 } );
  } );

  it( 'should return a score of 6/2 with "love you <3"', function () {
    expect( ws( 'love you <3' ) ).to.deep.equal( { score: 6, normalizedScore: 2 } );
  } );

  it( 'should return a score of 6/2 with "love you<3"', function () {
    expect( ws( 'love you<3' ) ).to.deep.equal( { score: 6, normalizedScore: 2 } );
  } );

  it( 'should return a score of 8/2 with "love you<3 :)"', function () {
    expect( ws( 'love you<3 :)' ) ).to.deep.equal( { score: 8, normalizedScore: 2 } );
  } );

  it( 'should return a score of 12/2.4 with "love you<3 😍😃"', function () {
    expect( ws( 'love you<3 😍😃' ) ).to.deep.equal( { score: 12, normalizedScore: 2.4 } );
  } );

  it( 'should return a score of 0/0 with "xxx"', function () {
    expect( ws( 'xxx' ) ).to.deep.equal( { score: 0, normalizedScore: 0 } );
  } );

  it( 'should throw error with non-string input', function () {
    expect( ws.bind( null ) ).to.throw( 'wink-sentiment: input phrase must be a string, instead found: undefined' );
    expect( ws.bind( 10 ) ).to.throw( 'wink-sentiment: input phrase must be a string, instead found: undefined' );
  } );
} );
