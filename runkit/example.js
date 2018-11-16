/* eslint-disable no-console */

// Load wink-sentiment package.
var sentiment = require( 'wink-sentiment' );
// Positive sentiment text.
console.log( sentiment( 'Excited to be part of the @imascientist team:-)!' ) );
// Negative sentiment text.
console.log( sentiment( 'Not a good product :(' ) );
// Neutral sentiment text.
console.log( sentiment( 'I will meet you tomorrow.' ) );
