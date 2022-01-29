---
title: FAQ
layout: default
---
Conditionals
============

A decision (both the human and the computer kind) is little more than
the result of a test of conditions. For example: if it is true that the
light switch is ON when you leave the room, then you make a small detour
to hit the switch on your way out. In other words, you are testing for a
certain condition in the course of your normal operation. If the
condition is *true*, then you do something accordingly. If the condition
is *false*, then you carry on with your normal operation as if nothing
had happened.

This `IF`\...`THEN` decision construction
is precisely what goes on inside the computer when your program needs to
test for a specific condition --- like whether a number is odd or
even or whether the program user typed in the correct answer, etc.

In Mops (as in other Forths) the
`IF`\...`THEN` decision process is a bit
different from some other languages you may know, largely because of the
stack orientation. The formal description of the
`IF`\...`THEN` construction is as follows:

  -------------------------------- ---------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  `IF xx THEN zz`   `( n \-- )`   If '`n`' is non-zero (true), statement \<var\>xx\</var\> is executed, followed by statement \<var\>zz\</var\>\<nowiki\>;\</nowiki\> if '`n`' is zero (false) the program continues with statement \<var\>zz\</var\>.
  -------------------------------- ---------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The `IF` part of the Mops decision process takes a number
off of the stack and tests it to see if it is a non-zero (i.e., any
number but zero). If the number on the stack is indeed non-zero, it
performs the operation(s) immediately following `IF`.
Execution then proceeds to perform operations written after
`THEN`. However, if the `IF` statement
encounters a zero on the stack, it ignores all operations between
`IF` and `THEN` and only performs
operation written after the `THEN` statement. In Mops the
"`THEN`" means to proceed with the program after the
test, as in first do this, *then* do that.

You won't be able to experiment with the
`IF`\...`THEN` construction as easily as
the operations you learned so far. That's because this construction
must be compiled as part of a colon or method definition before it will
run on Mops. For this example, we'll put the code for the
`IF`\...`THEN` statement inside a colon
definition and compile it before we can run it. Type the following:

```bash
`: TEST`\
`       IF  ." There is a non-zero number on the stack."`\
`       THEN  cr ;`\
```

This defines `TEST` as a word that performs a check on
the top number on the stack. If the number is non-zero, then the
statement to that effect shows on the screen. If the top of the stack
contains a zero, then the statement does not appear. Try it by placing
various numbers (including zero and negative numbers) on the stack and
typing `TEST`. (Remember that an empty stack contains no
numbers, and the `IF` operation will cause a stack
underflow error message to appear if there are no numbers to test. A
zero, on the other hand, is indeed a number, and occupies space on the
stack.)

Two Alternatives
----------------

Some decisions, however, are more complex because they involve two
possible alternatives before proceeding. Take, for example, one of the
most difficult decisions: getting up for work in the morning. After the
alarm has gone off, and you lie in bed deciding whether you should
really get going or grab another half hour, your mind is testing certain
conditions. `IF` you get up now, `THEN`
you'll be on time for work, or `ELSE` you'll risk
losing your job. `IF` you get up now,
`THEN` you can get all the hot water, or
`ELSE` you'll have to rush through the shower to get the
few drops that are left after the rest of the family has showered.

This kind of decision construction has been included in Mops. Its formal
description is:

  ----------------------- -------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  `ELSE`   `( \-- )`   If '`n`' is non-zero (true), \<var\>xx\</var\> statement is executed, followed by \<var\>zz\</var\>\<nowiki\>; if '\</nowiki\>`n`' is zero (false), \<var\>yy\</var\> is executed, followed by \<var\>zz\</var\>.
  ----------------------- -------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

If its meaning isn't already clear to you, it is used like this:

`IF  <var>xx</var>  ELSE  <var>yy</var>  THEN  <var>zz</var>`

As with the `IF`\...`THEN` construction,
this decision process looks first to see if the number on the top of the
stack is non-zero before it makes any decision. Now redefine
`TEST` so it takes into account the `ELSE`
provision.

```bash
`: TEST`\
`       IF    ." Non-zero number on stack."`\
`       ELSE  ." Zero on stack."`\
`       THEN  cr ;`\
```

Place three numbers (1, 0, and 3) on the stack and perform three tests:

`1 0 3`

`test`\
`Non-zero number on stack.`\
`test`\
`Zero on stack.`\
`test`\
`Non-zero number on stack.`

Remember that the `IF` operation takes the top number off
the stack when it performs its check, just like most of Mops'
operations. If you will need the number that is removed by
`IF` for a subsequent operation, then execute
`DUP` before `IF`, or better still,
convert your definition to use named input parameters or local variables
to preserve the value for later calculation.

Truths, Falsehoods, and Comparisons
-----------------------------------

You may be wondering how the
`IF`\...`THEN` construction can be useful
if it can only determine whether or not the number on the stack is zero.
You might think that this kind of test would be rather limiting in light
of the "real-world" decisions that a program may have to make, such as
whether two integers are equal to each other, whether one is larger than
the other, or whether a number is positive or negative. Actually, the
`IF`\...`THEN` construction frequently
operates at the tail end of a fuller decision procedure that makes the
real-world decisions possible. The first part of the procedure consists
of one or more comparison operators whose results are either a zero or
non-zero, depending on the outcome of the comparison.

To simplify the zero and nonzero terminology, Mops adheres to a
programming language convention revolving around the terms TRUE and
FALSE. These are also Mops words, and represent the values that appear
in the stack as a result of the comparison operations.
`FALSE` represents a zero in the stack;
`TRUE` represents any non-zero number in the stack,
including negative numbers. The Mops word `TRUE` returns
a non-zero number, that is, it returns a number which is all ones (in
binary). As we'll see a bit later, this corresponds to the value -1.

Type these words now:

`true false`

You'll see from the stack display that `FALSE` is the
same as (zero), and `TRUE` is -1.

Since these words --- or rather the numbers they represent ---
are actually symbolic of a condition that has just been tested, they are
sometimes referred to as flags. Flags in programs are something like
markers planted in key places that symbolize a certain condition. A
"true" flag signifies that a non-zero number is on the stack; a
"false" flag signifies that a zero is on the stack. (Another term that
is used is boolean&\#148;this really means the same as "flag".)

To help ingrain this difference between `TRUE` and
`FALSE` n your mind, redefine `test` yet
again so that it reinforces the way the
`IF`\...`THEN`\...`ELSE`
construction responds to `TRUE` and
`FALSE` flags existing in the stack.

```bash
`: TEST`\
`       IF    ." True!"`\
`       ELSE  ." False!"`\
`       THEN  cr ;`\
```

Now, place the numbers (zero) and 4 on the stack, leaving the the true
and false flags from before underneath them on the stack. Then run the
test four times:

```bash
0 4`

test
True!
test
False!
test
False!
test
True!
```

Below is a list of comparison operations that test the values of one or
more numbers on the stack and leave either `TRUE` or
`FALSE` flags on the stack. It is operations like these
that you would perform on real-world integers before performing decision
operations like
`IF`\...`THEN`\...`ELSE`. A
new term appears in the stack notations below:
'`boolean`'. This means that the result is
either `TRUE` or `FALSE` flag on the
stack. (The term boolean is named after George Boole, who developed a
logic system based on `TRUE` and `FALSE`
values.)

  `0<`       `( n \-- boolean )`       Leaves a `TRUE` flag on the stack if '`n`' is less than zero, otherwise leaves a `FALSE` flag.
  `0=`          `( n \-- boolean )`       Leaves a `TRUE` flag on the stack if '`n`' equals zero, otherwise leaves a `FALSE` flag.
  `0<>`   `( n \-- boolean )`       Leaves a `TRUE` flag on the stack if '`n`' does not equal zero, otherwise leaves a `FALSE` flag.
  `0>`       `( n \-- boolean )`       Leaves a `TRUE` flag on the stack if &\#152;`n`' is greater than zero, otherwise leaves a `FALSE` flag.
  `<`        `( n1 n2 \-- boolean )`   Leaves a `TRUE` flag on the stack if '`n1`' is less than '`n2`', otherwise leaves a `FALSE` flag.
  `<=`       `( n1 n2 \-- boolean )`   Leaves a `TRUE` flag on the stack if '`n1`' is less than or equal to '`n2`', otherwise leaves a `FALSE` flag.
  `<>`                     `( n1 n2 \-- boolean )`   Leaves a `TRUE` flag on the stack if '`n1`' does not equal '`n2`', otherwise leaves a `FALSE` flag.
  `=`           `( n1 n2 \-- boolean )`   Leaves a `TRUE` flag on the stack if '`n1`' equals '`n2`', otherwise leaves a `FALSE` flag.
  `>`        `( n1 n2 \-- boolean )`   Leaves a `TRUE` flag on the stack if '`n1`' is greater than '`n2`', otherwise leaves a `FALSE` flag.
  `>=`       `( n1 n2 \-- boolean )`   Leaves a `TRUE` flag on the stack if '`n1`' is greater than or equal to '`n2`', otherwise leaves a `FALSE` flag.

All the math in these comparison operations should be familiar to you.
Remember that these operations, like the simple arithmetic ones, are set
up in postfix notation. To remember which order to put numbers on the
stack, simply reconstruct in your mind how the formula would look in
algebraic notation. For example, to find out if
'`n1`' is greater than
'`n2`', the algebraic test would be:

`<var>n1</var> > <var>n2</var>`

In Mops, you simply move the operation sign to the right:

`<var>n1</var> <var>n2</var> >`

But in this case, Mops is testing the validity of the statement. The
numbers are taken from the stack when they are tested. If the statement
is true, then a `TRUE` flag goes to the stack; otherwise,
a `FALSE` flag goes there. Then an
`IF`&brvbar;`THEN` or
`IF`\...`THEN`\...`ELSE`
decision can be made on the number(s) in question.

Nested Decisions
----------------

It is also possible to have more than one
`IF`\...`THEN`\...`ELSE`
decision working at one time within a single definition. To accomplish
this, you place
`IF`\...`THEN`\...`ELSE`
inside one another. For example, you can set up a series of decision
operations that will examine a number in the stack, test it for several
conditions, and then announce on the screen what condition that number
meets. To do this, you'll nest several
`IF`\...`THEN` statements inside one
another:

```bash
`: IFTEST  { n -- }`\
`       n 0<`\
`       IF    ." less than "`\
`       ELSE  n 0>`\
`               IF  ." greater than "`\
`               THEN`\
`       THEN  ." zero." cr ;`\
```

`IFTEST` is defined to check whether a number is
positive, negative, or zero. Enter a number in the stack and then
perform an `IFTEST` on it. Try positive and negative
numbers, as well as zero.

In the definition, the number is assigned to a named input parameter
('`n`') to preserve the value in case it is
tested by both `IF` statements; the first
`IF` removes the number from the stack, which otherwise
would leave nothing for the second `IF` to test. The
number is then tested whether it is less than zero. If so, less than
zero. is displayed (because the program jumps ahead to the second
`THEN`). If the number is not negative, it is next
compared to see if it is greater than zero in the second, nested
`IF`\...`THEN` construction. If the number
is greater than zero, then the `TRUE` flag is noted by
the second `IF` statement, and greater than zero. is
displayed. If the number (which has already proven to be not less than
zero) is not greater than zero, then it must be zero, and only zero. is
displayed on the screen.

The key point to remember when nesting
`IF`\...`THEN` constructions is that every
`IF` must have a corresponding `THEN`
somewhere in the same colon definition. They are nested much in the same
way that parenthetical delimiters in math formulas are nested:

`( a / ( a - ( b * c ) ) + c )`

So, each `THEN` matches the `IF` with
which it is lined up. Formatting your code this way,

`IF  <var>xx</var>`\
`       IF  <var>ww</var>`\
`               IF  <var>uu</var>`\
`               ELSE  <var>zz</var>`\
`               THEN`\
`       THEN  <var>qq</var>`\
`THEN  <var>yy</var>`

with corresponding `IF`s, `ELSE`s and
`THEN`s lining up, is a good idea for readability, not to
mention subsequent debugging should you run into a snag.

Logical Operators
-----------------

There will probably be occasions in your future programs in which you
will have performed two comparison operations, and the resulting flags
from those operations will be sitting on top of the stack. How the
program proceeds from there depends on the state of those two flags. If
one flag is `TRUE` and the other `FALSE`,
they may meet the prerequisite that only one of the comparisons needs to
be true for a certain operation to take place (e.g.,
'`n1`' is less than
'`n2`', but '`n1`'
is not less than zero). Conversely, you may need both flags to be
`TRUE` for a certain operation to take place
('`n1`' is both less than
'`n2`' *and* less than zero). In these
special cases, you can use the logical operators, `AND`
and `OR`\<nowiki\>:\</nowiki\>

  ---------------------- ----------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------
  `AND`   `( n1 n2 \-- n3 )`   Performs a bit-wise AND of '`n1`' and '`n2`' and leaves the result on the stack.
  `OR`    `( n1 n2 \-- n3 )`   Performs a bit-wise OR of '`n1`' and '`n2`' and leaves the result on the stack.
  ---------------------- ----------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------

Both of these operations look at the binary makeup of two numbers and
produce a result. For `AND`, the result will have a 1 in
each position where both the first *and* the second numbers have a 1.
For `OR`, the result will have a 1 in each position where
either the first *or* the second numbers (or both numbers) have a
`1`.

For example, let's what happens when we `AND` and
`OR` the numbers 1 and 3\<nowiki\>:\</nowiki\>

`1 3 and . cr`\
`1`

`1 3 or . cr`\
`3`

Remember that `AND` and `OR` perform these
operations on the *binary* equivalents of the integers 1 and 3. The
binary form of 1 is

`0001`

and the binary form of 3 is

`0011`

When we perform an `AND` on these numbers, the result is:

`0001`

because the `AND` operation returns a 1 (TRUE) for the
rightmost column of bits in these binary numbers because both bits are 1
(TRUE).

For the same two numbers, when we perform an `OR`
operation (instead of an `AND`), the result is:

`0011`

because the `OR` operation above returns a 1 for the two
rightmost column of bits in the binary numbers because one or both bits
in each column are 1.

> The names for these operations, `AND` and
> `OR`, are sometimes used as verbs, as in I want to AND 1
> and 3.

There is one last logical operator you should know about, the word
`XOR` (pronounced "exclusive-or"). Here is the formal
description:

  ---------------------- ----------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------
  `XOR`   `( n1 n2 \-- n3 )`   Performs a bit-wise XOR of '`n1`' and '`n2`' and leaves the result on the stack.
  ---------------------- ----------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------

As you can see, you use it exactly like you would use
`AND` or `OR`. Try this:

`1 3 xor . cr`\
`2`

However, unlike a "normal" `OR` operation (sometimes
referred to as "inclusive-or"), the `XOR` operation
returns (FALSE) where both respective bit columns in each number are 1
(TRUE). (In other words, we can have one or the other, but not *both*.)

This is the binary form of our answer, 2\<nowiki\>:\</nowiki\>

`0010`

In the second rightmost column, only one of our two integers was 1
(TRUE), so the answer in that column is 1 (TRUE), just like a "normal"
`OR`. However, the rightmost bit column of our answer is
(FALSE) because the rightmost columns of both of our two integers (1 and
3) is 1 (TRUE), *unlike* a "normal" `OR`.

Experiment a little bit with `AND`, `OR`,
and `XOR` in this fashion. Remember that these operations
are working on the binary equivalent of the decimal numbers you type
into the stack. If you have difficulty understanding an answer, try
working out the problem on paper by converting each number to binary and
then performing the AND, OR, or XOR arithmetic on the numbers as shown
above. Once you understand the concept, you can trust Mops to do these
operations correctly for you at all times.

The CASE Decision
-----------------

It's not uncommon to have an instance in a program in which the next
step could be one of several possibilities, depending on the actual
number on the stack --- not just whether it's TRUE (non-zero) or
FALSE (zero). For example, a program may ask you to type a number from
zero to nine. For most of the numbers, the subsequent step is the same,
but for numbers 2, 6, and 7, the outcome is different. In other words,
if it is the case of a 2 on the stack, then a unique operation takes
place. Sure, you could run a series of comparison operations and nested
`IF`\...`THEN` constructions on the number
to narrow it down (e.g., testing if the number is not less than two nor
greater than two), but that gets cumbersome when you're testing for
many numbers.

Mops' shortcut for this multiple-decision making is the
`CASE` structure. Using the example above, you could
define a word like this:

```bash
`: CASETEST  ( n --  )  \ Print TWO, SIX, SEVEN, or OTHER`\
`       CASE`\
`               2  OF  ." TWO"    ENDOF`\
`               6  OF  ." SIX"    ENDOF`\
`               7  OF  ." SEVEN"  ENDOF`\
`               ." OTHER"`\
`       ENDCASE  cr ;`\
```

This word takes the number on the stack and checks whether it is a
`CASE` OF 2, 6, or 7. If a particular
`CASE` is valid, then the branch executes statements
until it encounters an `ENDOF` delimiter. At that point,
execution jumps to `ENDCASE`, ignoring all other
statements within the `CASE` construct. If none of the
cases are valid, then execution continues toward the
`ENDCASE` delimiter.

If a statement is inserted before `ENDCASE` (like
'`." OTHER"`' in the example), then it is
executed whenever the test of all cases fail. This statement is known as
the default statement, since it's the statementwhich gets executed by
default if nothing else does.

> Note: The `CASE` test retains the test value on the
> stack, and it is dropped at the end by the `ENDCASE`. In
> the default statement, particularly, you might want to make use of the
> test value. But if you're going to use it (take it off the stack),
> remember to `DUP` it first (or just put a dummy value on
> the stack) to be dropped by the `ENDCASE`.


