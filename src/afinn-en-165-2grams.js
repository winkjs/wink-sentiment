//     wink-sentiment
//     Accurate and fast sentiment scoring of phrases with emoticons & emojis.
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
