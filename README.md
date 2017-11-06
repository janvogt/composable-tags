# composable-tags

Small and dependency free library for ES2015 template string tags that compose well.

## Usage

Call the t function with any number of tags. They are applied from right to left.

```js
    import {t, stripIdent, id, render} from 'composable-tags'

    const name = 'you'
    const result = t(render, stripIdent({newLine: '\n'}), id)`
        Hallo ${name},

        I just wanted to tell you that
        1+1 = ${1+1}.

        Sincerely yours.
    `
    console.log(result)
    /* prints:
    Hallo you,

    I just wanted to tell you that
    1+1 = 2.

    Sincerely yours.
    */
```

### Composable Tags

- `id`
    Does nothing (i.e. this identity holds: `t(...someTagsLeft..., id, ...someTagsRight...) == t(...someTagsLeft...,...someTagsRight...))`).
- `stripCommonIndent({newLine = '\n', indentation = " "} = {})`
    Strips common ident on all lines except the first.
- `stripEmptyLines({ newLine = "\n", leading = true, within = false, trailing = true, trailingNewLine = false} = {})`
    Strips empty lines. If `notLastLine` is `true` one trailing newline at the end is allowed. If `inBody` is `true` all empty lines between non empty lines are removed as well.

### Terminating Tags

You can use one terminating tag at the end of the list of tags. You must not use any other tags left of a terminating one - otherweise things will explode.

- `render`
    Terminates the sequence of tags and renders it as string (`t(render)\`abc\` == \`abc\``)
- `box(foreignTag)`
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
