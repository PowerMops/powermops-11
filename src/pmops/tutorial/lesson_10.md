---
title: Lesson 10
layout: default
---

## Defining New Words

We said earlier that you can add words to the Mops dictionary while
building a program. In fact, that is what programming in Mops is all
about. Class names, method names, and object names in your program all
become part of the dictionary as Mops words. Defining new Mops words
also lets you write your own routines and subroutines by defining one
short and simple word to take the place of several (or many) other Forth
statements. This allows you to factor a program into many small and
manageable pieces, an important programming concept and technique.

The first definition exercise will be to define a new word that takes
care of the symbols in a simple addition problem. The new word is
"`ADD`", although you could choose any word not already
in the Mops dictionary.

> Note: Actually, there is nothing stopping you from defining words
> (including classes) with names that already exist in the Mops
> dictionary. In fact, you may have discovered that Mops will not complain
> if you do this! While this is an intentional part of Mops' design, it
> is generally not a good idea to redefine words already in the dictionary
> unless you have a good idea of what you are trying to accomplish.

The safest way to check that the name of a new word you want to define
is not already in the dictionary, is to issue the "tick" command with
the name you want to test for. In Mops, as in most Forths, a tick is an
apostrophe (`'`). By typing apostrophe, space, and the name of the word
you're testing for, Mops searches the dictionary for an occurrence of
that word. If the word is in the dictionary, tick will leave a number on
the stack, which is the location in memory of the word's definition.
But if the word is not in the dictionary, the message undefined word
appears on the screen, which in this case means you're in the clear to
define a word with that name.

```bash
' window .
5241310
' twindow .

Error # -13  undefined word
' twindow .
         ^
Current object:  TW    class:  MLTEFWIND
```

You define a new Mops word by typing a colon (`:`), a
space, the name of the new word, one or more spaces or tabs, the
sequence of values and/or commands to be performed when you use that new
word, and then a final semicolon (`;`), indicating
the end of your new definition. This kind of Mops definition is called,
aptly enough, a colon definition. (Note that
`:CLASS` and `:M` are other, more special purpose
defining words.)

Here's an example that defines the new word, `ADD`,
which will perform the addition of two numbers on the stack, display the
results, and move the Mops prompt to the left margin of the next line.
(We include the stack comment here for completeness and as an example of
good practice; you need not type it in.) Recall that each line you type
must be terminated by the ENTER key:

```bash
: ADD  ( n1 n2 --  )  + . cr ;
```

The `+` operation expects to find two numbers on the
stack, so to use your new word you would type two numbers (which go onto
the stack) and then the new word:

```bash
2 6 add
8
```

A good exercise at this point would be to define new words to perform
some of the other arithmetic operations.

The Return Stack
----------------

As we have seen, a Mops program basically consists of a sequence of
words and messages sent to objects (which cause a method to be
executed). The definitions of these words and methods can contain many
other words and messages. If you think about what must happen when Mops
is executing one definition or method, you can see that when it has to
go and execute other words or methods, it will then need to come back to
where it was. It needs to mark its place in some way. The way this is
handled is with a second stack, similar in operation to the parameter
stack, called the return stack. When Mops has to execute something
somewhere else, it saves its current position as an address on the
return stack. In that other place, if it has to go yet somewhere else,
it pushes the new address on to the return stack as well. This is how
words or methods can call other words or methods which can in turn do
the same, down to a great depth. And by using a second stack, all these
return addresses on the return stack don't interfere with items on the
parameter stack.

> Note: Mops puts some other items besides return addresses on the return
> stack, and so can you. However, properly-factored object-oriented
> programs should generally not require direct manipulation of the return
> stack, so we will not cover how to do this in this Tutorial.

Normally you won't need to worry about what's going on with the return
stack, but when there is an error however, it's usually very useful to
know what the program was executing when the error occurred. Mops will
try to help you do this, however, by reporting errors as we saw in the
error message above. Let's look at it again:

```bash
' twindow .

Error # -13  undefined word
' twindow .

Current object:  TW    class:  MLTEFWIND
```

The first line of the error message tells the nature of the error that
occurred, in this case, it was an undefined word error. The second line
shows the program statement that produced the error. The third line uses
a caret (^) to indicate where in the program statement (shown on the
second line) that Mops discovered the error. The fourth line cites the
object (and its class) where the error occurred, which in this case is
object `TW` (located in the source file
`zFrontEnd` in 'System source'), which is part of the
interpretive behaviors of the Mops window.

We cannot display the name of the method that the error occurred because
method names are not stored in a readable form. However, seeing the
program statements where the words occurred is usually enough to track
down the location of an error.

## Named Input Parameters

Mops can make things a little easier for you by reducing concern about
the order in which data are stored on, and recalled from, the parameter
stack. Whenever you define a new Mops word, Mops lets you assign names
to the parameters that are passed to it. After that, you needn't worry
about the stack or the order of the data. When you need a datum for an
operation, simply refer to it by the name you have assigned to it.

As an example, we will use the multiply-then-divide problem described in
[Lesson 3](Lesson_3). If you
recall, the operation was presented as:

```bash
 5 * 12 * 50
-------------
     40
```

To calculate this without named input parameters, just as we did in that
lesson, you had to multiply the three numbers in the numerator, and then
place the denominator on the stack before dividing. See how this is
simplified in a definition that performs the math with named input
parameters:

```bash
: FORMULA  { denom n1 n2 n3 -- solution }
           n1 n2 n3 * * denom /  ;
```
The magic of named input parameters takes place inside the braces (`{` and
`}`, also called curly brackets). The syntax is deliberately similar to a
stack comment, because it is in fact a kind of stack description. So in
this case, whenever the word `FORMULA` is executed, like
this:

```bash
40 5 12 50 formula .
75
```

the first thing that happens is that the values are taken (removed) from
the stack and put in a special area of memory where they are associated
with the names in the curly brackets **in the same order as they were
put on the stack**. Once that happens, their order is no longer
important. Their names are used to fill in the values in the
calculation.

But note that the `solution` parameter is
actually a comment --- anything between the `--` and the `}` is treated
as a comment. You should use this comment area to indicate what your
definition leaves on the stack, exactly as in a normal stack comment.

It is important to bear in mind that the names and values you assign to
named input parameters are valid *only within their own colon
definition*. You could use the same names with the same or different
values in other colon definitions without any interference.

Named input parameters become very powerful in the way you can adjust
their values in the course of a colon definition. Consider for example,
this formula:

`a^2 + b^2`

Since the computer can compute only one square at a time, it needs to
hold the result of one square while it calculates the second before it
can add the two squares. A definition for a word equivalent to this
formula would be:

```bash
: FORMULA1  { a  b -- solution }
            a  a  *  -> a
            b  b  *
            a  +    .  cr  ;
```

The "arrow" (gazinta) operation, `->`, stores the
value currently on the stack (the result of a-squared) into the named
parameter, `a`. This overwrites the original value in
`a`, which came from the stack in the opening instant of
this definition's execution. Near the end of execution,
`a` is recalled to be added to the results of
`b` times `b`. To solve the same formula
without named input parameters would require several stack manipulations
that sometimes trip up even the experts.

Incidentally, there are other operations you can perform on a number
stored as a named input parameter. You can add a number to what is
there, or subtract a number from what is there, with the
`++>` and `-->` operations. For
example, doing

`10 ++> denom`

inside a colon definition adds ten to a value stored in a hypothetical
named input parameter named `denom`.

Local Variables
---------------

While we're at it, we'll also introduce you to a similar concept,
called local variables. They too, appear inside curly brackets within a
colon definition, but instead let you assign names to intermediate
results that can occur inside such a definition. Local variables are
preceded by a backslash. Take this formula, for instance:

```bash
 ( a + b - 3c )
----------------
   ( b + 2c )
```

The word definition would be:

```bash
: FORMULA2  { a  b  c  \  num den -- result }
            a  b  +  3  c  *  -  -> num
            2  c  *  b  +        -> den
            num  den  /  ;
```

In this example, `a`, `b`, and
`c` in the curly brackets are named input parameters that
take on the values on the stack. Names *after* the backslash (\\) but
*before* the "--"), are local variables that will be called into
action within the definition. In the example, the numerator and
denominator are calculated separately and stored
(`->`) in their respective local variables. Then, the
local variables are recalled in the proper order for the division
operation to produce the result.

> Note: You do not need to "initialize" a local variable before using
> it. You can rely on local variables being initialized to zero at the
> beginning of a definition.


