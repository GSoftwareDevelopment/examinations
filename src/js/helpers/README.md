This document has been translated by Google Translate

[Polish version](README-PL.md)

# Handlebars helpers by GSD

Handlebars is one of the most interesting template creation tools, thanks to the ability to create your own "helpers".

## Conditional

The basic 'if' condition in Handlebars was very modest and did not allow for a more precise definition of the condition.
Below, I have described a few helpers who are limited tolerable.

**NOTE:** Please note that the following functions compare according to the argument types. If the types do not match, the result will be `false`.

### `eq {arg1} {arg2} `

It will return `true` if the given arguments (`arg1` and `arg2`) are equal. Otherwise, it returns `false`.

**Example:**

```hbs
{{#if (eq page 0)}}
    <div> This is the beginning of the article </div>
{{/if}}
```

### `neq {arg1} {arg2}`

This is the opposite of the `eq` function.

**Example:**

```hbs
{{#if (neq page 0)}}
    <div> This is not the beginning of the article </div>
{{/if}}
```

A similar result can be obtained by using the logical operation `not`, e.g.

```hbs
{{#if (not (eq page 0))}}
    <div> This is not the beginning of the article </div>
{{/if}}
```

### `lt {arg1} {arg2}`

Returns `true` if `arg1` is less than `arg2`

### `eqlt {arg1} {arg2} `

Returns `true` if `arg1` is less than or equal to `arg2`

### `gt {arg1} {arg2}`

Returns `true` if `arg1` is greater than `arg2`

### `eqgt {arg1} {arg2} `

Returns `true` if `arg1` is greater than or equal to `arg2`

## Logical operations

### `and {arg1} {arg2} `

Returns the result of an AND logic operation
```
+-------+-------+--------+
| arg1  | arg2  | Result |
+-------+-------+--------+
| false | false | false  |
| false | true  | false  |
| true  | false | false  |
| true  | true  | true   |
+-------+-------+--------+
```

### `or {arg1} {arg2} `

Returns the results of an OR logical operation

```
+-------+-------+--------+
| arg1  | arg2  | Result |
+-------+-------+--------+
| false | false | false  |
| false | true  | true   |
| true  | false | true   |
| true  | true  | true   |
+-------+-------+--------+
```

### `not {arg}`

Logical negation (NOT)

```
+-------+--------+
| arg1  | Result |
+-------+--------+
| false | true   |
| true  | false  |
+-------+--------+
```

## Type checking

I have defined a few helpers to be able to check the type of a variable, there are five of them:
- `isUndefined`,
- `isNull`,
- `isNumber`,
- `isString`,
- `isObject`.

Each function takes one argument and returns either `true` or `false`, respectively, depending on whether the argument is of the type indicated by the function name.

### Building conditions in HBS

Creating conditions using Handlebars syntax is (to put it mildly) a pain, but it is not impossible.
If you've tried to create complex conditions in Excel, it may remind you of this syntax.

Here is a simple example:

**JavaScript notation:**
``` js
if ((count> 0) and (count <10)) {
    console.log ('The value of the variable is in the range 1 to 9');
}
```

**HBS Notation:**
```hbs
{{#if (and (gt count 0) (lt count 10))}}
The value of the variable is in the range 1 to 9
{{/if}}
```

A little practice and you can build complicated conditions.

**TIP:** Editor plugins that automatically close parentheses can help.

## Counters

Counters are a kind of equivalent of variables. They have a global scope, more precisely, they are not dependent on the calling context.

### `set "name" {value}`

Sets a numeric named `name` to value `value`.

**Example:**

```hbs
{{set "count" 0}}
```

Set the counter named "count" to zero (0)

```hbs
{{set "count" pages}}
```

This sets a counter named "count" to the value indicated in the `pages` variable passed to the template.


### `get "name"`

Returns the state of the counter named `name`

**Example:**

```hbs
{{get "count"}}
```

It will take the value of the counter named "count" and pass it to the template - in effect, the template will show a number.

```hbs
{{#if (eq (get "count") 0)}}
Counter is zero
{{/if}}
```

An example of using a numerator in a condition. The condition will be met when the numerator is equal to zero (0).

### `inc | dec "name" `

Do an increment of `inc` or decrement `dec` of the numerator of` name` by 1.

### `isZero "name"`

Returns `true` if the numerator `name` is zero (0).

**Example:**

```hbs
{{#if (isZero "count")}}
Counter is zero
{{/if}}
```

As in the example of the `get` function, the condition will be met when the numerator is zero (0).

# Iterations

### `#loop {from} {to}`

Processing the block contained within the specified number of times. The scope is determined by the parameters `from` and `to`. It should be noted that the `to` parameter is tested with the `<` (less than) condition, which means that the number of iterations is always smaller by one.

In the loop, you can get information about the current step using the variable `@index`. Additionally, it is possible to check whether the loop is at the beginning or at the end of the execution.
This information is provided by the variables `@first` and `@last`.

**Example:**

```hbs
{{#loop 1 10}}
    <div> Step {{@index}} </div>
{{/loop}}
```

The loop will result in nine `<div>` block elements containing the numbers 1 through 9, in sequence.

# Math

### `add | sub | mul | div {arg1} {arg2} `

Basic math operations on the arguments `arg1` and `arg2`. Respectively:
- `add` - adding
- `sub` - subtraction
- `mul` - multiplication
- `div` - divide

The name of the counter may also be given as an argument. For this, the name must be enclosed in quotation marks.

### `isEven | isOdd {arg}`

Functions that check the parity of the `arg` argument.