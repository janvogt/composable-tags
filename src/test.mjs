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
