var emojis = require( './emojis.js' );
var afinn = require( './afinn-en-165.js' );
var emoticons = require( './emoticons.js' );
var negations = require( './negations.js' );
var affin2Grams = require( './afinn-en-165-2grams.js' );

/* eslint max-depth: 0 */

// Used to remove extra spaces.
var rgxSpaces = /\s+/ig;
// Used to split on **non-words** to extract words.
var rgxNonWords = /\W+/ig;
// Used to split alphas & spaces, which are not part of emoticons to extract emoticons.
var rgxEmoticons = /[abce-nt-z ]/ig;
// Used to extract emojis.
var rgxEmojis = /([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u26FF]|[\u2700-\u27BF])/g;
// Used to expant elisions.
var rgxNotElision = /([a-z])(n\'t)\b/gi;

var analyze = function ( sentence ) {
  // Early exit.
  if ( sentence.length === 0 ) return { score: 0, normalizedScore: 0 };
  // Preprocess the sentence.
  var s = sentence.trim().replace( rgxSpaces, ' ' ).replace( rgxNotElision, '$1 not' );
  // These tokens will contain text and emojis. The text part will be tokenized later.
  var tokens = s.split( rgxEmojis );
  // The emoticon & word tokens.
  var emoticonTokens, wordTokens;
  // Sentiment Score.
  var ss = 0;
  // Number of words encountered.
  var words = 0;
  // Helpers: for loop indexes, token, temp ss, and word count.
  var i, imax, k, kmax, t, tss, wc;

  for ( i = 0, imax = tokens.length; i < imax; i += 1 ) {
    t = tokens[ i ];
    // All our emojis have a length < 3; quick & dirty way to detect potential emojis!
    if ( t.length && ( t.length < 3 ) && ( emojis[ t ] !== undefined ) ) {
      ss += emojis[ t ];
      words += 1;
    }

    // Ignore 1 letter words completely!
    if ( t.length > 1 ) {
      // AFINN & Emoticons have a minimum length of 2!
      emoticonTokens = t.split( rgxEmoticons );
      wordTokens = t.toLowerCase().split( rgxNonWords );
      // First process emoticons.
      for ( k = 0, kmax = emoticonTokens.length; k < kmax; k += 1 ) {
        t = emoticonTokens[ k ];
        if ( ( t.length > 1 ) && ( emoticons[ t ] !== undefined ) ) {
          ss += emoticons[ t ];
          words += 1;
        }
      }
      // Then the words.
      for ( k = 0, kmax = wordTokens.length; k < kmax; k += 1 ) {
        t = wordTokens[ k ];
        if ( t.length > 1 ) {
          wc = 1;
          if ( afinn[ t ] !== undefined ) {
            // Check for bigram configurations i.e. token at `k` and `k+1`. Accordingly
            // compute the sentiment score in `tss`.
            if ( ( k < ( kmax - 1 ) ) && affin2Grams[ t ] && ( affin2Grams[ t ][ wordTokens[ k + 1 ] ] !== undefined ) ) {
              tss = affin2Grams[ t ][ wordTokens[ k + 1 ] ];
              // Will have to count `2` words!
              wc = 2;
            } else {
              tss = afinn[ t ];
            }
            // Check for negation — upto two words ahead; even a bigram config may be negated!
            ss +=  ( ( k > 0 && negations[ wordTokens[ k - 1 ] ] ) || ( k > 1 && negations[ wordTokens[ k - 2 ] ] ) ) ? -tss : tss;
            // Increment `k` by 1 if a bigram config was found earlier i.e. `wc` was set to **2**.
            k += ( wc - 1 );
          }
          // Update number of words accordingly.
          words += wc;
        }
      }
    }
  }
  // To avoid division by 0!
  if ( words === 0 ) words = 1;
  // Return score and its normalized value.
  return { score: ss, normalizedScore: ( ss / words ) };
};

module.exports = analyze;
