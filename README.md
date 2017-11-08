# composable-tags

Small and dependency free library for ES2015 template string tags that compose well.

```sh
  npm install composable-tags
```

## Usage

```js
function t(TerminatingTag, ...Tags)
```

Call the t function with one terminating tag and any number of composable tags. They are applied from right to left.

```js
import {t, stripIdent, id, render} from 'composable-tags'

const name = 'you';
const tag = t(render, stripIdent({newLine: '\n'}), id);
console.log(tag`
    Hallo ${name},

    I just wanted to tell you that
    1+1 = ${1+1}.

    Sincerely yours.
`);
/* prints:
Hallo you,

I just wanted to tell you that
1+1 = 2.

Sincerely yours.
*/
```

### Composable Tags

Combine these as you want. Or create your own: they all are a function of the form `{parts: [String], values: [Any]} -> {parts: [String], values: [Any]}`

#### id

```js
const id // Tag
```
Does nothing. I.e. this identity holds:

```js
t(...someTagsLeft, id, ...someTagsRight) == t(...someTagsLeft,...someTagsRight)
```

#### stripCommonIndent

```js
function stripCommonIndent({newLine = '\n', indentation = " "} = {}) // Tag
```

Strips common ident on all lines except the first.

#### stripEmptyLines

```js
function stripEmptyLines({ newLine = "\n", leading = true, within = false, trailing = true, trailingNewLine = true} = {}) // Tag
```

Strips empty lines. If `trailingNewLine` is `true` one trailing newline at the end will be enforced. If `within` is `true` all empty lines between first and last non-empty line will be removed as well.

### Terminating Tags

You can use one terminating tag at the end of the list of tags. You must not use any other tags left of a terminating one - otherweise things will explode.

#### render

```js
const render // TerminatingTag
```

Terminates the sequence of tags and renders it as string
```js
t(render)`abc` === `abc`
```
#### box

```js
function box(foreignTag) // TerminatingTag
```

Use any tag from other libraies as the terminating tag.

## Useful Examples

### Source Code Syntax Highligthing

You want to leverage syntax highlighting for your, e.g. GraphQL, template string in your editor without changing the semantics? Just do the following:

```js
import {t, render} from 'composable-tags'

const gql = t(render) // equivalent to not use any tags.
// if you want to strip indentaion as well just use
// const gql = t(render, stripCommonIndent()) instead

const query = gql`
    query userWithSyntaxHighlighting($email: String!) {
        allUser(email: $email) {
            id
        }
    }
`
```

## Contributions

Your more than welcome to add your own helpful tags. After all what is a composable tag system worth if it doesn't contain the tags you want to compose?
