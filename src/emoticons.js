//     wink-sentiment
//     Accurate and fast sentiment scoring of phrases with hashtags, emoticons & emojis.
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
// Each key in this object is an emoticon and the corresponding value is it's
// sentiment score.
//
// This data is derived from the AFINN data. The AFINN data is copyright by
// Finn Årup Nielsen. It is sourced from github repo fnielsen/afinn, licensed
// under the Apache License 2.0. You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
var emoticons = {
  ':)': 2,
  ':(': -2,
  ':|': -1,
  ':]': 2,
  ':[': -2,
  ':}': 2,
  ':{': -2,
  ':/': -2,
  ':\\': -2,
  ':*': 2,
  ':-)': 2,
  ':-(': -2,
  ':-|': -1,
  ':-]': 2,
  ':-[': -2,
  ':-}': 2,
  ':-?': -1,
  ':->': 2,
  ':-*': 2,
  ':-D': 3,
  ':-P': 3,
  ':-S': -2,
  ':-p': 3,
  ':-/': -2,
  ':D': 3,
  ':P': 3,
  ':S': -2,
  ':p': 3,
  ':o)': 2,
  ':\'(': -2,
  '(:': 2,
  '):': -2,
  '(-:': 2,
  ')-:': -2,
  ';-(': -2,
  ';)': 2,
  ';(': -2,
  ';-)': 2,
  ';-D': 3,
  '=(': -2,
  '=/': -2,
  '=\\': -2,
  '=^/': -1,
  '=P': 3,
  '\o/': 3,
  '♥': 3,
  ':-))': 3,
  ':-)))': 3,
  ':-))))': 3,
  ':-)))))': 3,
  ':-))))))': 4,
  ':-)))))))': 4,
  ':-))))))))': 4,
  ':-)))))))))': 4,
  '://': 0,
  ':))': 3,
  ':)))': 3,
  ':))))': 3,
  ':)))))': 3,
  ':))))))': 4,
  ':)))))))': 4,
  ':))))))))': 4,
  ':)))))))))': 4,
  ':))))))))))': 4,
  ':-((': -3,
  ':-(((': -3,
  ':-((((': -3,
  ':((': -3,
  ';))': 3,
  ';)))': 3,
  '<3': 3,
  '<33': 3,
  '<333': 4,
  '<3333': 4,
  '<33333': 4,
  '<333333': 4,
  '<3333333': 4,
  '<33333333': 4,
  '<333333333': 4,
  '8(': -2,
  '8)': 2,
  '8-D': 3,
  '8-)': 2,
  '8-(': -2,
  '8D': 3,
  'X-D': 3,
  'XD': 3
};

module.exports = emoticons;
