//     wink-sentiment
//     Accurate and fast sentiment scoring of phrases with emoticons & emojis.
//
//     Copyright (C) 2017  GRAYPE Systems Private Limited
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
var emojis = require( './emojis.js' );
var afinn = require( './afinn-en-165.js' );
var emoticons = require( './emoticons.js' );
var negations = require( './negations.js' );
var affin2Grams = require( './afinn-en-165-2grams.js' );
var tokenize = require( 'wink-tokenizer' )().tokenize;

/* eslint max-depth: 0 */

// ### tokens
/**
 *
 * Computes the absolue and normalized sentiment scores of the input `phrase`.
 * The normalized score is computed by dividing the absolute score by the number
 * of tokens; this is always between -5 and +5. A score of less than 0 indicates
 * negative sentiments and a score of more than 0 indicates positive sentiments;
 * wheras a near zero score suggests a neutral sentiment.
 *
 * @param {object[]} phrase — whoes sentiment score needs to be computed.
 * @return {object} — absolute `score`, `normalizedScore` and `tokenizedPhrase` of `phrase`.
 *
 * @example
 * sentiment( [ { token: 'not', tag: 'word' },
 *                     { token: 'a', tag: 'word' },
 *                     { token: 'good', tag: 'word' },
 *                     { token: 'product', tag: 'word' } ] );
 * // -> { score: -3, normalizedScore: -1 }
 * sentiment( [ { token: 'Excited', tag: 'word' },
 *                     { token: 'to', tag: 'word' },
 *                     { token: 'be', tag: 'word' },
 *                     { token: 'part', tag: 'word' },
 *                     { token: 'of', tag: 'word' },
 *                     { token: 'the', tag: 'word' },
 *                     { token: '@imascientist', tag: 'mention' },
 *                     { token: 'team', tag: 'word' },
 *                     { token: ':-)', tag: 'emoticon' },
 *                     { token: '!', tag: 'punctuation' } ] );
 * // { score: 3, normalizedScore: 0.21428571428571427 }
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
  // Number of words encountered.
  var words = 0;
  // Helpers: for loop indexes, token, temp ss, and word count.
  var k, kmax, t, tkn, tss, wc;

  for ( k = 0, kmax = tokenizedPhrase.length; k < kmax; k += 1 ) {
    tkn = tokenizedPhrase[ k ];
    t = tkn.token;
    switch ( tkn.tag ) {
      case 'emoji':
        tkn.score = emojis[ t ];
        ss += tkn.score;
        words += 1;
        break;
      case 'emoticon':
        tkn.score = emoticons[ t ];
        ss += tkn.score;
        words += 1;
        break;
      case 'word':
        if ( t.length > 1 ) {
          t = t.toLowerCase();
          wc = 1;
          // tkn.score = 0;
          // if  ( negations[ t ] ) tkn.negation = true;
          if ( afinn[ t ] !== undefined ) {
            // Check for bigram configurations i.e. token at `k` and `k+1`. Accordingly
            // compute the sentiment score in `tss`.
            if ( ( k < ( kmax - 1 ) ) && affin2Grams[ t ] && ( affin2Grams[ t ][ tokenizedPhrase[ k + 1 ].token ] !== undefined ) ) {
              tss = affin2Grams[ t ][ tokenizedPhrase[ k + 1 ].token ];
              tkn.grouped = 1;
              // Will have to count `2` words!
              wc = 2;
            } else {
              tss = afinn[ t ];
            }
            // Check for negation — upto two words ahead; even a bigram config may be negated!
            if ( ( k > 0 && negations[ tokenizedPhrase[ k - 1 ].token ] ) || ( k > 1 && negations[ tokenizedPhrase[ k - 2 ].token ] ) ) {
              tss = -tss;
              tkn.negation = true;
            }
            ss += tss;
            // Increment `k` by 1 if a bigram config was found earlier i.e. `wc` was set to **2**.
            k += ( wc - 1 );
            tkn.score = tss;
          }
          // Update number of words accordingly.
          words += wc;
        }
        break;
      default:
      // Do Nothing!
    } // swtich ( t.tag )
  }
  // if ( words === 0 ) words = 1;
  // Return score and its normalized value.
  return { score: ss, normalizedScore: ( ss / words ), tokenizedPhrase: tokenizedPhrase };
}; // sentiment()

module.exports = sentiment;
