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
 * Computes the absolue and normalized sentiment scores of the input `phrase`,
 * after tokenizing it.
 *
 * The normalized score is computed by dividing the absolute score by the number
 * of tokens; this is always between -5 and +5. A score of less than 0 indicates
 * negative sentiments and a score of more than 0 indicates positive sentiments;
 * wheras a near zero score suggests a neutral sentiment. While counting tokens
 * only the ones tagged as **`word`**, **`emoji`**, or **`emoticon`** are counted;
 * and one letter words are ignored.
 *
 * It performs tokenization using [wink-tokenizer](http://winkjs.org/wink-tokenizer/).
 * During sentiment analysis, each token may be assigned up to 3 new properties.
 * These properties are:
 *
 * 1. **`score`** — contains the sentiment score of the word, which is always
 * between -5 and +5. This is added only when the word in question has a positive or
 * negative sentiment associated with it.
 * 2. **`negation`** — is added & set to **true** whenever the `score` of the
 * token has beeen impacted due to a negation word apprearing prior to it.
 * 3. **`grouped`** — is added whenever, the token is the first
 * word of a short idom or a phrase. It's value provides the number of tokens
 * that have been grouped together to form the phrase/idom.
 *
 * @param {string} phrase — whoes sentiment score needs to be computed.
 * @return {object} — absolute `score`, `normalizedScore` and `tokenizedPhrase` of `phrase`.
 *
 * @example
 * sentiment( 'not a good product' );
 * // -> { score: -3,
 * //      normalizedScore: -1,
 * //      tokenizedPhrase: [
 * //        { value: 'not', tag: 'word' },
 * //        { value: 'a', tag: 'word' },
 * //        { value: 'good', tag: 'word', negation: true, score: -3 },
 * //        { value: 'product', tag: 'word' }
 * //      ]
 * //    }
 * sentiment( 'Excited to be part of the @imascientist team:-)!' );
 * // -> { score: 5,
 * //      normalizedScore: 0.625,
 * //      tokenizedPhrase: [
 * //        { value: 'Excited', tag: 'word', score: 3 },
 * //        { value: 'to', tag: 'word' },
 * //        { value: 'be', tag: 'word' },
 * //        { value: 'part', tag: 'word' },
 * //        { value: 'of', tag: 'word' },
 * //        { value: 'the', tag: 'word' },
 * //        { value: '@imascientist', tag: 'mention' },
 * //        { value: 'team', tag: 'word' },
 * //        { value: ':-)', tag: 'emoticon', score: 2 },
 * //        { value: '!', tag: 'punctuation' }
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
  // Number of words encountered.
  var words = 0;
  // Helpers: for loop indexes, token, temp ss, and word count.
  var k, kmax, t, tkn, tss, wc;

  for ( k = 0, kmax = tokenizedPhrase.length; k < kmax; k += 1 ) {
    tkn = tokenizedPhrase[ k ];
    t = tkn.value;
    switch ( tkn.tag ) {
      case 'emoji':
        tkn.score = emojis[ t ];
        if (!tkn.score) {
          tkn.score = 0;
        }
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
            if ( ( k < ( kmax - 1 ) ) && affin2Grams[ t ] && ( affin2Grams[ t ][ tokenizedPhrase[ k + 1 ].value ] !== undefined ) ) {
              tss = affin2Grams[ t ][ tokenizedPhrase[ k + 1 ].value ];
              tkn.grouped = 1;
              // Will have to count `2` words!
              wc = 2;
            } else {
              tss = afinn[ t ];
            }
            // Check for negation — upto two words ahead; even a bigram config may be negated!
            if ( ( k > 0 && negations[ tokenizedPhrase[ k - 1 ].value ] ) || ( k > 1 && negations[ tokenizedPhrase[ k - 2 ].value ] ) ) {
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
