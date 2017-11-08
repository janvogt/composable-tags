/**
 * A set of ES2015 template string tags that compose well.
 *
 * @author    Jan Vogt <janvogt@users.noreply.github.com>
 * @copyright (c) 2017 Jan Vogt
 * @license MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { t, render, id, stripCommonIndent, stripEmptyLines } from "./index";

const test = fn => {
  fn((a, b) => {
    if (a !== b) {
      console.error(`"${a}" should be equal to \n"${b}"`);
      throw new Error("Assertion Failed");
    }
  });
};

test(eq => {
  eq(t(render)`abc ${5} def`, "abc 5 def");
  eq(t(render, id)`abc ${5} def`, t(render)`abc 5 def`);
  eq(
    t(render, stripCommonIndent())`
      Hallo ${"You"},

      I just wanted to tell you that
      1+1 = ${1 + 1}.

      Sincerely yours.`,
    `
Hallo You,

I just wanted to tell you that
1+1 = 2.

Sincerely yours.`
  );
  eq(
    t(render, stripEmptyLines())`

Hallo ${"You"},

I just wanted to tell you that
1+1 = ${1 + 1}.

Sincerely yours.

`,
    `Hallo You,

I just wanted to tell you that
1+1 = 2.

Sincerely yours.

`
  );
  eq(
    t(render, stripEmptyLines({ trailing: true, within: true }))`

Hallo ${"You"},

I just wanted to tell you that
1+1 = ${1 + 1}.

Sincerely yours.

`,
    `Hallo You,
I just wanted to tell you that
1+1 = 2.
Sincerely yours.
`
  );
  eq(
    t(
      render,
      stripEmptyLines({ trailing: true, within: true, trailingNewLine: false })
    )`

Hallo ${"You"},

I just wanted to tell you that
1+1 = ${1 + 1}.

Sincerely yours.

`,
    `Hallo You,
I just wanted to tell you that
1+1 = 2.
Sincerely yours.`
  );
});
