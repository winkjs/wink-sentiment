//     wink-sentiment
//     Accurate and fast sentiment scoring of phrases with hashtags, emoticons & emojis.
//
//     Copyright (C) 2017-18  GRAYPE Systems Private Limited
//
//     This file is part of “wink-sentiment”.
//
//     Permission is hereby granted, free of charge, to any person obtaining a
//     copy of this software and associated documentation files (the "Software"),
//     to deal in the Software without restriction, including without limitation
//     the rights to use, copy, modify, merge, publish, distribute, sublicense,
//     and/or sell copies of the Software, and to permit persons to whom the
//     Software is furnished to do so, subject to the following conditions:
//
//     The above copyright notice and this permission notice shall be included
//     in all copies or substantial portions of the Software.
//
//     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
//     OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//     THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//     DEALINGS IN THE SOFTWARE.

//
var emojis = require( './emojis.js' );
var afinn = require( './afinn-en-165.js' );
var emoticons = require( './emoticons.js' );
var negations = require( './negations.js' );
var affin2Grams = require( './afinn-en-165-2grams.js' );
var tokenize = require( 'wink-tokenizer' )().tokenize;

/* eslint max-depth: 0 */

// ### normalize
/**
 *
 * Computes the normalized sentiment score from the absolute scores.
 *
 * @param {number} hss absolute sentiment scrore of hashtags.
 * @param {number} wss absolute sentiment scrore of words/emojis/emoticons.
 * @param {number} sentiHashtags number of hashtags that have an associated sentiment score.
 * @param {number} sentiWords wnumber of words that have an associated sentiment score.
 * @param {number} totalWords total number of words in the text.
 * @return {number} normalized score.
 * @private
*/
var normalize = function ( hss, wss, sentiHashtags, sentiWords, totalWords ) {
  // **N**ormalized **h**ashtags & **w**ords **s**entiment **s**cores.
  let nhss = 0,
      nwss = 0;
  // 1. Normalize hashtags sentiment score by computing the average.
  if ( sentiHashtags ) nhss = hss / sentiHashtags;
  if ( sentiWords ) {
    // 2. Normalize words sentiment score by computing the average.
    nwss = wss / sentiWords;
    // 3. Normalized words sentiment score is further adjusted on the basis of the
    // total number of words in the text.
    // Average sentence length in words (assumed).
    const avgLength = 15;
    // Make adjustments.
    nwss /= Math.sqrt( ( totalWords > avgLength ) ? ( totalWords / avgLength ) : 1 );
  }
  return ( nhss && nwss ) ? ( ( nhss + nwss ) / 2 ) : ( nwss || nhss );
}; // normalize()

// ### sentiment
/**
 *
 * Computes the absolue and normalized sentiment scores of the input `phrase`,
 * after tokenizing it.
 *
 * The normalized score is computed by taking into account of absolute scores of
 * words, emojis, emoticons, and hashtags and adjusting it on the basis of total
 * words in the text; this is always between -5 and +5. A score of less than 0 indicates
 * negative sentiments and a score of more than 0 indicates positive sentiments;
 * wheras a near zero score suggests a neutral sentiment. While counting tokens
 * only the ones tagged as **`word`**, **`emoji`**, or **`emoticon`** are counted;
 * and one letter words are ignored.
 *
 * It performs tokenization using [wink-tokenizer](http://winkjs.org/wink-tokenizer/).
 * During sentiment analysis, each token may be assigned up to 3 new properties.
 * These properties are:
 *
 * 1. **`score`** — contains the sentiment score of the word, emoji, emoticon or hashtag, which is always
 * between -5 and +5. This is added only when the word in question has a positive or
 * negative sentiment associated with it.
 * 2. **`negation`** — is added & set to **true** whenever the `score` of the
 * token has beeen impacted due to a negation word apprearing prior to it.
 * 3. **`grouped`** — is added whenever, the token is the first
 * word of a short idiom or a phrase. It's value provides the number of tokens
 * that have been grouped together to form the phrase/idiom.
 *
 * @param {string} phrase whoes sentiment score needs to be computed.
 * @return {object} absolute `score`, `normalizedScore` and `tokenizedPhrase` of `phrase`.
 *
 * @example
 * sentiment( 'not a good product #fail' );
 * // -> { score: -5,
 * //      normalizedScore: -2.5,
 * //      tokenizedPhrase: [
 * //        { value: 'not', tag: 'word' },
 * //        { value: 'a', tag: 'word' },
 * //        { value: 'good', tag: 'word', negation: true, score: -3 },
 * //        { value: 'product', tag: 'word' },
 * //        { value: '#fail', tag: 'hashtag', score: -2 }
 * //      ]
 * //    }
 */
var sentiment = function ( phrase ) {
  if ( typeof phrase !== 'string' ) {
    throw Error( 'wink-sentiment: input phrase must be a string, instead found: ' + typeof phrase );
  }
  // Early exit.
  var tokenizedPhrase = tokenize( phrase );
  if ( tokenizedPhrase.length === 0 ) return { score: 0, normalizedScore: 0 };

  // Sentiment Score.
  var ss = 0;
  // Hash Tags SS.
  var hss = 0;
  // Number of sentiment containing hashtags and words encountered.
  var sentiHashtags = 0,
      sentiWords = 0;
  // Number of words encountered.
  var words = 0;
  // Helpers: for loop indexes, token, temp ss, and word count.
  var k, kmax, t, tkn, tss, wc;

  for ( k = 0, kmax = tokenizedPhrase.length; k < kmax; k += 1 ) {
    tkn = tokenizedPhrase[ k ];
    t = tkn.value;
    switch ( tkn.tag ) {
      case 'emoji':
        tss = emojis[ t ];
        if ( tss ) {
          ss += tss;
          tkn.score = tss;
          sentiWords += 1;
        }
        words += 1;
        break;
      case 'emoticon':
        tss = emoticons[ t ];
        if ( tss ) {
          ss += tss;
          tkn.score = tss;
          sentiWords += 1;
        }
        words += 1;
        break;
      case 'hashtag':
        tss = afinn[ t.slice( 1 ).toLowerCase() ];
        if ( tss ) {
          tkn.score = tss;
          hss += tss;
          sentiHashtags += 1;
        }
        break;
      case 'word':
        t = t.toLowerCase();
        wc = 1;
        // Check for bigram configurations i.e. token at `k` and `k+1`. Accordingly
        // compute the sentiment score in `tss`. Convert to Lower Case for case insensitive comparison.
        if ( ( k < ( kmax - 1 ) ) && affin2Grams[ t ] && ( affin2Grams[ t ][ tokenizedPhrase[ k + 1 ].value.toLowerCase() ] !== undefined ) ) {
          tss = affin2Grams[ t ][ tokenizedPhrase[ k + 1 ].value.toLowerCase() ];
          tkn.grouped = 1;
          // Will have to count `2` words!
          wc = 2;
          // sentiWords += 1;
        } else {
          tss = afinn[ t ] || 0;
          // sentiWords += 1;
        }
        // Check for negation — upto two words ahead; even a bigram AFINN config may be negated! Convert to Lower Case for case insensitive comparison.
        if ( ( k > 0 && negations[ tokenizedPhrase[ k - 1 ].value.toLowerCase() ] ) || ( k > 1 && negations[ tokenizedPhrase[ k - 2 ].value.toLowerCase() ] ) ) {
          tss = -tss;
          tkn.negation = true;
        }
        ss += tss;
        // Increment `k` by 1 if a bigram config was found earlier i.e. `wc` was set to **2**.
        k += ( wc - 1 );
        if ( tss ) {
          tkn.score = tss;
          sentiWords += 1;
        }
        // Update number of words accordingly.
        words += wc;
        break;
      default:
      // Do Nothing!
    } // swtich ( t.tag )
  }
  // if ( words === 0 ) words = 1;
  // Return score and its normalized value.
  return {
    score: ( ss + hss ),
    normalizedScore: +( normalize( hss, ss, sentiHashtags, sentiWords, words ) ).toFixed( 4 ),
    tokenizedPhrase: tokenizedPhrase
  };
}; // sentiment()

module.exports = sentiment;
