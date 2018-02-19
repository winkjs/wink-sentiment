# wink-sentiment

Accurate & fast sentiment scoring of phrases with #hashtags, emoticons:) & emojis🎉

### [![Build Status](https://api.travis-ci.org/winkjs/wink-sentiment.svg?branch=master)](https://travis-ci.org/winkjs/wink-sentiment) [![Coverage Status](https://coveralls.io/repos/github/winkjs/wink-sentiment/badge.svg?branch=master)](https://coveralls.io/github/winkjs/wink-sentiment?branch=master) [![dependencies Status](https://david-dm.org/winkjs/wink-sentiment/status.svg)](https://david-dm.org/winkjs/wink-sentiment) [![devDependencies Status](https://david-dm.org/winkjs/wink-sentiment/dev-status.svg)](https://david-dm.org/winkjs/wink-sentiment?type=dev)

[<img align="right" src="https://decisively.github.io/wink-logos/logo-title.png" width="100px" >](http://winkjs.org/)

Analyze sentiment of tweets, product reviews, social media content or any text using **`wink-sentiment`**. It is a part of _[wink](http://winkjs.org/)_ — a growing family of high quality packages for Statistical Analysis, Natural Language Processing and Machine Learning in NodeJS.

It is based on [AFINN](https://arxiv.org/abs/1103.2903) and [Emoji Sentiment Ranking](http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0144296); it's features include:

1. Intelligent negation handling; for example, phrase "good product" will get a positive score whereas "not a good product" gets a negative score.
2. Automatic detection and scoring of two-word phrases in a text; for example, "cool stuff", "well done", and "short sighted".
3. Processes each emoji, emoticon and/or hashtag separately while scoring.
4. Embeds a powerful [tokenizer](https://www.npmjs.com/package/wink-tokenizer) that returns the tokenized phrase.
5. Returns the sentiment score and tokens. Each token contains a set of properties defining its sentiment, if any.
6. Achieves accuracy of 77%, when validated using Amazon Product Review [Sentiment Labelled Sentences Data Set](https://archive.ics.uci.edu/ml/machine-learning-databases/00331/) at
[UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/index.php).


### Installation

Use [npm](https://www.npmjs.com/package/wink-sentiment) to install:

    npm install wink-sentiment --save

### Example
```javascript
// Load wink-sentiment package.
var sentiment = require( 'wink-sentiment' );
// Just give any phrase and checkout the sentiment score. A positive score
// means a positive sentiment, whereas a negative score indicates a negative
// sentiment. Neutral sentiment is signalled by a near zero score.
sentiment( 'Excited to be part of the @imascientist team:-)!' );
// -> { score: 5,
//      normalizedScore: 2.5,
//      tokenizedPhrase: [
//        { value: 'Excited', tag: 'word', score: 3 },
//        { value: 'to', tag: 'word' },
//        { value: 'be', tag: 'word' },
//        { value: 'part', tag: 'word' },
//        { value: 'of', tag: 'word' },
//        { value: 'the', tag: 'word' },
//        { value: '@imascientist', tag: 'mention' },
//        { value: 'team', tag: 'word' },
//        { value: ':-)', tag: 'emoticon', score: 2 },
//        { value: '!', tag: 'punctuation' }
//      ]
//    }
```

### Documentation
Check out the [wink sentiment API](http://winkjs.org/wink-sentiment/) documentation to learn more.

### Need Help?

If you spot a bug and the same has not yet been reported, raise a new [issue](https://github.com/winkjs/wink-sentiment/issues) or consider fixing it and sending a pull request.

### Copyright & License

**wink-sentiment** is copyright 2017-18 [GRAYPE Systems Private Limited](http://graype.in/).

It is licensed under the under the terms of the GNU Affero General Public License as published by the Free
Software Foundation, version 3 of the License.
