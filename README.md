# wink-sentiment

Accurate and fast sentiment scoring of phrases with emoticons :) & emojis 🎉

### [![Build Status](https://api.travis-ci.org/winkjs/wink-sentiment.svg?branch=master)](https://travis-ci.org/winkjs/wink-sentiment) [![Coverage Status](https://coveralls.io/repos/github/winkjs/wink-sentiment/badge.svg?branch=master)](https://coveralls.io/github/winkjs/wink-sentiment?branch=master) [![devDependencies Status](https://david-dm.org/winkjs/wink-sentiment/dev-status.svg)](https://david-dm.org/winkjs/wink-sentiment?type=dev)

[<img align="right" src="https://decisively.github.io/wink-logos/logo-title.png" width="100px" >](http://winkjs.org/)

Analyze sentiment of tweets, product reviews, social media content or any text using **`wink-sentiment`**. It is a part of _[wink](http://winkjs.org/)_ — a growing family of high quality packages for Statistical Analysis, Natural Language Processing and Machine Learning in NodeJS.

It is based on [AFINN](https://arxiv.org/abs/1103.2903) and [Emoji Sentiment Ranking](http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0144296); it's features include:

1. Intelligent negation handling; for example, phrase "good product" will get a positive score whereas "not a good product" gets a negative score.
2. Automatic detection and scoring of two-word phrases in a text; for example, "cool stuff", "well done", and "short sighted".
3. Processes each emoji and/or emoticon separately while scoring.
4. Achieves accuracy of 77%, when validated using Amazon Product Review [Sentiment Labelled Sentences Data Set](https://archive.ics.uci.edu/ml/machine-learning-databases/00331/) at
[UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/index.php).


### Installation

Use [npm](https://www.npmjs.com/package/wink-sentiment) to install:

    npm install wink-sentiment --save


### Documentation
For detailed API docs, check out http://winkjs.org/wink-sentiment/ URL!

### Need Help?

If you spot a bug and the same has not yet been reported, raise a new [issue](https://github.com/winkjs/wink-sentiment/issues) or consider fixing it and sending a pull request.

### Copyright & License

**wink-sentiment** is copyright 2017 [GRAYPE Systems Private Limited](http://graype.in/).

It is licensed under the under the terms of the GNU Affero General Public License as published by the Free
Software Foundation, version 3 of the License.
