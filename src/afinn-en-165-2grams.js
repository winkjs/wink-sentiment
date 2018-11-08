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
// Each key in this object is an English word and the corresponding value is another
// object; whose key is the next word that must be present in succession and its
// value is the sentiment score of the 2-grams.
//
// This data is derived from the AFINN data. The AFINN data is copyright by
// Finn Årup Nielsen. It is sourced from github repo fnielsen/afinn, licensed
// under the Apache License 2.0. You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0

/* eslint object-curly-newline: 0 */
var afinn2Grams = {
  bad: {
    luck: -2,
    fit: -1
  },
  best: {
    damn: 4
  },
  cashing: {
    in: -2
  },
  cool: {
    stuff: 3
  },
  cover: {
    up: -3
  },
  damn: {
    cute: 3,
    good: 4
  },
  environment: {
    friendly: 2
  },
  fed: {
    up: -3
  },
  fucking: {
    amazing: 4,
    beautiful: 4,
    cute: 4,
    fantastic: 4,
    good: 4,
    great: 4,
    hot: 2,
    love: 4,
    loves: 4,
    perfect: 4
  },
  game: {
    changing: 3
  },
  green: {
    wash: -3,
    washing: -3
  },
  ill: {
    fated: -2
  },
  kind: {
    of: 0
  },
  loving: {
    kindness: 3
  },
  made: {
    up: -1
  },
  messing: {
    up: -2
  },
  post: {
    traumatic: -2,
  },
  right: {
    direction: 3
  },
  screwed: {
    up: -3
  },
  self: {
    abuse: -2,
    confident: 2,
    contradictory: -2,
    deluded: -2
  },
  short: {
    sighted: -2,
    sightedness: -2
  },
  side: {
    effect: -2,
    effects: -2
  },
  some: {
    kind: 0
  },
  violence: {
    related: -3
  },
  well: {
    being: 2,
    championed: 3,
    developed: 2,
    done: 3,
    established: 2,
    focused: 2,
    groomed: 2,
    proportioned: 2,
  }
};

module.exports = afinn2Grams;
