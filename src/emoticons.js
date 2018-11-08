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
