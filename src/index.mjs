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

export function t(...tags) {
  return function(parts, ...values) {
    // console.log(parts, values);
    return tags.reverse().reduce((accum, tag, i) => {
      if (tag.__isTerminatingTag && i < tags.length - 1) {
        throw new TypeError(
          `Terminating tag at intermediary position ${i + 1} of ${tags.length}`
        );
      }
      return tag(accum);
    },
    { parts, values });
  };
}

export function stripCommonIndent({ newLine = "\n", indentation = " " } = {}) {
  if (indentation.length !== 1) {
    throw new TypeError(
      `Indentation must be a single character string, but got "${indentation}"`
    );
  }
  const indentRegExp = new RegExp(`^${indentation[0]}*`);
  const indent = row => indentRegExp.exec(row)[0].length;
  const commonIndent = rows =>
    rows.slice(1).reduce((accum, row) => {
      const curIntend = row.length === 0 ? accum : indent(row);
      return curIntend < accum ? curIntend : accum;
    }, Infinity);
  const stripIndent = indentN => rows => {
    if (indentN === Infinity) {
      return rows;
    }
    return rows.map(
      (row, i) => (row.length === 0 || i === 0 ? row : row.slice(indentN))
    );
  };
  return function({ parts, values }) {
    const partRows = parts.map(part => part.split(newLine));
    // console.log(partRows);
    const n = partRows
      .map(commonIndent)
      .reduce((accum, indent) => (indent < accum ? indent : accum), Infinity);
    // console.log(n);
    const stripedParts = partRows
      .map(stripIndent(n))
      .map(rows => rows.join(newLine));
    // console.log(stripedParts);
    return { parts: stripedParts, values };
  };
}

export function stripEmptyLines(
  {
    newLine = "\n",
    leading = true,
    within = false,
    trailing = true,
    trailingNewLine = true
  } = {}
) {
  const drop = (leading, within, trailing, keepOnlyEmpty) => lines => {
    const nonEmptyLines = lines
      .map((line, i) => (line !== "" ? i : -1))
      .filter(i => i !== -1);
    if (nonEmptyLines.length === 0) {
      return keepOnlyEmpty ? [] : lines;
    }
    const [min, max] = [nonEmptyLines[0], nonEmptyLines.slice(-1)];
    const [pre, body, post] = [
      lines.slice(0, min),
      lines.slice(min, max + 1),
      lines.slice(max + 1)
    ];
    return [].concat(
      leading ? [] : pre,
      within ? body.filter(line => line !== "") : body,
      trailing ? [] : post
    );
  };
  const triMap = (first, middle, last) => parts => {
    const [pre, body, post] = [
      parts.slice(0, 1),
      parts.slice(1, parts.length - 1),
      parts.slice(-1)
    ];
    return [].concat(pre.map(first), body.map(middle), post.map(last));
  };
  return function({ parts, values }) {
    const partRows = parts.map(p => p.split(newLine));
    // console.log(partRows);
    const filtered =
      partRows.length <= 1
        ? partRows.map(drop(leading, within, trailing, false))
        : triMap(
            drop(leading, within, within, leading),
            drop(within, within, within, within),
            drop(within, within, trailing, trailing)
          )(partRows);
    // console.log(filtered);
    const newParts = filtered.map(lines => lines.join(newLine));
    if (!newParts[newParts.length - 1].endsWith(newLine) && trailingNewLine) {
      newParts[newParts.length - 1] += newLine;
    }
    return { parts: newParts, values };
  };
}

export function id({ parts, values }) {
  return { parts, values };
}

export function render({ parts, values }) {
  return parts.slice(1).reduce((res, cur, i) => {
    return res + values[i] + cur;
  }, parts[0]);
}
render.__isTerminatingTag = true;

export function box(tag) {
  const composable = function({ parts, values }) {
    return tag(parts, ...values);
  };
  composable.__isTerminatingTag = true;
  return composable;
}
