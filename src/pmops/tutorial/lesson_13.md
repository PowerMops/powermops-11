---
title: Loops
layout: default
---

Computer programs frequently need certain operations to be repeated a
specific number of times.

For example, finding the sum of ten numbers in the stack would normally
take a stream of over nine statements. To a programmer's way of
thinking, this makes the program several steps longer than necessary. It
would be better to find a shortcut way of repeating the add operation as
many times as is needed to do the job, without increasing program size
with a long series of identical statements. That's where a loop
construct comes in.

A loop sets up a kind of merry-go-round in your program, with a
beginning and an end. At the end of the loop is an instruction that
tells the program to "loop back" to the beginning of the loop. All the
statements between the beginning and the end are repeated each time
program execution goes through the loop.

Mops has two major categories of loops: definite and indefinite. As
their names imply, each category has a different way of figuring out
when to stop going around the loop. A definite loop performs only as
many loops as the program specifies; an indefinite loop, on the other
hand, will loop (forever) until a certain condition is met.

Let's look at each kind of loop more closely.

Definite Loops
--------------

Consider the 10-number addition problem discussed above. Since you know
ahead of time that there will be exactly ten numbers on the stack before
any addition takes place, you could use a definite loop to perform nine
addition operations on the stack.

A definite loop in Mops consists of a
`DO`\...`LOOP` statement, which expects to
find two numbers on the stack before the `DO` executes.
The two numbers represent the count of the repetitions that the
`DO`\...`LOOP` statement is to make; the
second value (on the top of the stack) is incremented before the loop
begins.

  ---------------------------------------------- -------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  `DO`\...`LOOP`   `( n1 n2 \-- )`   Increments '`n2`' each time after performing operations between `DO` and `LOOP`\<nowiki\>; exits loop when\</nowiki\> '`n2`' equals '`n1`'.
  ---------------------------------------------- -------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Because loops work only in compiled statements, you will need to put
them inside colon definitions to see how they operate. Let's define a
new word that adds up 10 numbers from the stack by repeatedly performing
nine addition operations:

```bash
`: ADDTEN  ( n1 ... n10 -- sum )`\
`       9 0 DO  +  LOOP  . cr ;`\
```

During execution, this `DO`\...`LOOP`
counts up from zero to nine each time through the loop. After the ninth
time around, the loop stops; the top of the stack (the sum) is displayed
and a carriage return is executed.

You may be wondering where Mops keeps track of the loop counter if the
parameter stack is used to hold all the numbers that get added. The
answer to that involves a powerful feature called indexing, which will
play an increasingly important role the more you learn about Mops.

When you entered the 9 and the prior to the
`DO`\...`LOOP` construction in the example
above, what you couldn't see was that the two numbers were
automatically moved to another part of memory. The first number you
typed (9) is called the limit, because that number represents the limit
of how many times the loop is to be executed.

The second number (0) is called the index. This number increments by one
each time through the loop. So, the first time through the
`DO`\...`LOOP` construction in the above
example, the index number bumps up to a one; the next time to a two, and
so on. Each time the index is incremented (in `LOOP`), a
check is done to see if the index and limit numbers are equal. If so,
then the `DO`\...`LOOP` construction
"knows" that it's time to move on and will not "loop back" (to
`DO`) for another iteration.

What's interesting about this kind of indexing is that you can use the
index number as a counter while executing a loop. By setting the limit
and index numbers to integers you need to operate with inside a loop,
you can copy the index number to the parameter stack each time around
the loop and use that number for a calculation, a graphics plot point, a
multiplication factor, or whatever.

The Mops word that copies the index to the parameter stack is
"`I`":

  `I`   `( \-- n )`   Copies the current index value to the parameter stack.
  -------------------- ---------------------------- --------------------------------------------------------

Remember that this word only copies the index; it does not disturb the
index in any way. Here are a couple of examples to demonstrate.

Define a word, `FIVECOUNT`, that displays a series of
numbers from 101 to 105\<nowiki\>: \</nowiki\>

```bash
`: FIVECOUNT  106 101 DO  i .  LOOP  cr ;`\
```

Notice that the limit is set to 106. Remember that the index is
incremented when execution reaches `LOOP`. The first time
through, the index was 101, and the `I` word copied the
index to the parameter stack; the `.` command then
displayed it on the screen. On the fifth execution, 105 was the index.
When execution reached `LOOP`, the index was incremented
to 106, at which point it the index is now equal to the index so
execution broke out of the loop.

You can similarly use the index number to perform operations on a number
passed on the parameter stack prior to execution. Consider the following
definition:

```bash
`: TIMESTABLES  { n -- }`\
`       13 1 DO  n i *  .  LOOP  cr ;`\
```

If you then type '`5 timestables`', the program goes
through twelve loops of multiplying 5 times the incrementing index
number, one through twelve.

You have the flexibility in Mops to place all kinds of statements within
a `DO`\...`LOOP` construction, including
all those conditional decision constructs we covered earlier.

There will be times when you'll want to use a
`DO`\...`LOOP` for the sake of
compactness, but the increment you might wish to use is something other
than the one automatically performed by `LOOP` (which can
only increment by 1). For those occasions, you have the optional loop
ending, `+LOOP`. Whatever number you place in front of
the `+LOOP` ending will be the increment that the
`DO`\...`LOOP` uses to adjust the index.
You can even use a negative number if you wish the loop to decrement.

  ------------------------ ------------------------------------------------------ ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  `+LOOP`   class="STACK" nowrap \| `( n \-- )`   Alternative word for `LOOP`. Increments the loop index by '`n`' and returns execution to the nearest `DO` if the index and the limit are equal.
  ------------------------ ------------------------------------------------------ ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Here's how you would use `+LOOP` to manage a countdown:

```bash
`: COUNTDOWN`\
`       1 10 DO  i . cr  -1 +LOOP`\
`       ." Ignition...Liftoff!" cr ;`\
```

Notice that in this case, since the program loop is counting backwards,
the limit is 1 and the index is 10. Each time through the loop, the
index is decremented by -1. Also notice that the limit value 1 gets
typed by the program. When the index is counted down and becomes equal
to the limit, the loop continues and doesn't stop until the index is
counted down to the limit minus 1, unlike the situation when the index
is being incremented (where the loop stops when the index equals the
limit). The best way to think about this is as if there is a "fence"
in between the limit and one minus the limit. Whenever the index crosses
the fence, in either direction, the loop stops. This will be true even
if you write a program in which the increment value changes sign during
the running of the loop, i.e., goes from negative to positive.

Nested Loops
------------

It is also sometimes desirable to have more than one
`DO`\...`LOOP` going on simultaneously. As
with `IF`\...`THEN` constructions,
`DO`\...`LOOP` operations can be nested
inside one another. All you have to remember is to supply one
`LOOP` (or `+LOOP`) for each
`DO` within the colon definition.

```bash
`: NESTEDLOOP`\
`       1 10 DO`\
`               ." Loop: " i . cr`\
`                       4 0 DO`\
`                               ." Nested Loop: " i . cr`\
`                       LOOP`\
`       -1 +LOOP cr ;`\
```

Type `NESTEDLOOP` and watch how the inner loop iterates
until completion for *each* iteration of the outer loop.

If you are in a nested loop and need access to the outer index, Mops has
a predefined word that allows you to copy that number to the parameter
stack, just like `I` copies the current loop index number
to the stack. That word is `J`.

  `J`   class="STACK" nowrap \| `( \-- n )`   Copies to the parameter stack the index of the next outer loop from within a nested `DO`\...`LOOP` construct.
  -------------------- ------------------------------------------------------ ---------------------------------------------------------------------------------------------------------------------------------------------

In other words, `J` looks up the index of the loop just
outside the current `DO`\...`LOOP`
construction and copies that number to the parameter stack.

```bash
`: NESTEDLOOP2`\
`       1 10 DO`\
`               ." Loop " i . cr`\
`                       4 0 DO`\
`                               ." Loop " i .`\
`                               ." within Loop " j .`\
`                               cr`\
`                       LOOP`\
`       -1 +LOOP cr ;`\
```

> Note: If you factor out an inner loop into another definition, you
> can't use `J` --- you won't get the right value.
> `J` only works with nested loops within the current
> definition.

## Abort Loop

You may have a situation in which you need to bail out of a
`DO`\...`LOOP` before its normal
completion&\#148;perhaps because of some special case situation. The
word `LEAVE` is available for this purpose.

  ------------------------ -------------------------- -------------------------------------
  `LEAVE`   `( \-- )`   Exits the current loop immediately.
  ------------------------ -------------------------- -------------------------------------

Here's our countdown example again, appropriately modified:

```bash
`: COUNTDOWN2`\
`       1 10 DO`\
`               i . cr`\
`               i 7 = IF  ." Aborted!!" cr LEAVE  THEN`\
`       -1 +LOOP ;`\
```

We had to remove the Ignition\...Liftoff! message, otherwise it would
have appeared after the countdown was aborted (which really isn't what
we wanted). We'll show a better way of handling this shortly.

## Indefinite Loops

An indefinite loop is another kind of loop you'll use often in a Mops
program. As its name implies, an indefinite loop keeps going in circles
until a certain condition exists. It can go around one time, or many
thousands of times while waiting for that condition to occur. (And would
continue indefinitely if allowed to.) In Mops, that condition is the
presence of a flag on top of the stack.

  ------------------------ ------------------------------------------------------ -------------------------------------------------------------------------------------------------------------------------------------------------------------
  `BEGIN`   `( \-- )`                               Marks the beginning of an indefinite loop.
  `UNTIL`   class="STACK" nowrap \| `( n \-- )`   Breaks out of an indefinite loop if '`n`' is non-zero (TRUE); otherwise returns execution to the nearest `BEGIN`.
  ------------------------ ------------------------------------------------------ -------------------------------------------------------------------------------------------------------------------------------------------------------------

Indefinite loops with `BEGIN`\...`UNTIL`
can be used like this:

`BEGIN  <var>xxx</var>  UNTIL`

Operation(s) \<var\>xxx\</var\> will be performed repeatedly (with no
end in sight) until a TRUE flag exists on the stack for
`UNTIL`.

A useful variation of this construct uses the word
`NUNTIL`\<nowiki\>:\</nowiki\>

  ------------------------- ------------------------------------------------------ -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  `NUNTIL`   class="STACK" nowrap \| `( n \-- )`   Alternative word for `UNTIL`. Breaks out of an indefinite loop if '`n`' is zero (FALSE); otherwise returns execution to the nearest `BEGIN`.
  ------------------------- ------------------------------------------------------ -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

It used in the place of `UNTIL` in the previous example:

`BEGIN  <var>xxx</var>  NUNTIL`

As before, operation(s) \<var\>xxx\</var\> will be performed repeatedly,
but this time the loop won't stop until a FALSE flag exists on the
stack.

Here's an example of how you might use a
`BEGIN`\...`UNTIL` construction. In this
case, the indefinite loop will be waiting for you to enter a lower-case
letter 'a' on the keyboard. The `KEY` operation pauses
the program until you press a key, and then it pushes onto the stack a
standard, equivalent code number (called an ASCII code---explained
later) for the character keyed in. If the number on the stack is 97
decimal (the ASCII code number for the lower-case 'a'), then a 1 (TRUE
flag) is placed on the stack, and the loop ends. Otherwise, a FALSE flag
is placed on the stack, and execution returns to the beginning of the
loop.

```bash
`: BEGINTEST`\
`       BEGIN  key 97 =  UNTIL`\
`       ." Loop broken." cr ;`\
```

Now, type `BEGINTEST`, and tap all kinds of letters on
the keyboard. Until you type a lower-case letter 'a' the program keeps
going around in circles.

It turns out that `BEGIN` also marks the beginning of
another kind of infinite loop. These are the new words:

  ------------------------- ------------------------------------------------------ ---------------------------------------------------------------------------------------------------
  `REPEAT`   `( \-- )`                               Returns execution unconditionally to the nearest `BEGIN`.
  `WHILE`    class="STACK" nowrap \| `( n \-- )`   Execution continues within a loop as long as '`n`' is non-zero (TRUE).
  ------------------------- ------------------------------------------------------ ---------------------------------------------------------------------------------------------------

With all three words taken together, it is called a
`BEGIN`\...`WHILE`\...`REPEAT`
loop, and naturally enough, it is used like this:

`BEGIN <var>xxx</var>  WHILE  <var>yyy</var>  REPEAT`

This statement will executes \<var\>xxx\</var\> each time through the
loop, and executes \<var\>yyy\</var\> only if a non-zero number (TRUE)
is on top of the stack when execution reaches the
`WHILE`. If the flag at `WHILE` is zero,
the loop is broken and \<var\>yyy\</var\> is not executed again.

There's also a variation on `WHILE` called
`NWHILE`, which only breaks execution if the flag on the
stack is zero (FALSE):

  ------------------------- ------------------------------------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  `NWHILE`   class="STACK" nowrap \| `( n \-- )`   Alternative word for `WHILE`. Execution continues within a `BEGIN`\...`REPEAT` loop as long as '`n`' is zero (FALSE).
  ------------------------- ------------------------------------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Here is a variation on our `BEGINTEST` example to show
the new construct at work:

```bash
`: BEGINTEST2`\
`       ." Type a lower-case letter 'a', please." cr`\
`       BEGIN`\
`               key 97 =`\
`       NWHILE`\
`               ." Wrong key!" cr`\
`       REPEAT`\
`       ." Thank you. Loop broken." cr ;`\
```

This example begins by printing a message prompting the user to type the
letter 'a'. Unlike our first `BEGINTEST`, this version
provides feedback to the user when they push the wrong key. If they push
the right key, execution will not continue past `NWHILE`
and print the error message, because the `=` will leave a
TRUE on the stack (indicating that the ASCII code number of the key
pushed by the user was equal to 97), and execution will break out of the
loop entirely and proceed to print the final message at the end of the
definition.

EXIT
----

While not necessarily a loop construct, this is a good place to mention
another very useful operation, `EXIT`.

  ----------------------- -------------------------- -------------------------------------------------------
  `EXIT`   `( \-- )`   Terminates execution of the current word (or method).
  ----------------------- -------------------------- -------------------------------------------------------

Unlike `LEAVE`, `EXIT` exits the
*definition* entirely. Here's a modified version of the our first
`BEGINTEST` example that uses
`EXIT`\<nowiki\>:\</nowiki\>

```bash
`: BEGINTEST`\
`       BEGIN`\
`               key 97 = IF EXIT THEN`\
`               key 98 =`\
`       UNTIL ;`\
```

This definion will keep running until you type either an 'a' (ASCII
code number 97) or a 'b' (ASCII code number 98). You can also write:

```bash
`: BEGINTEST`\
`       BEGIN`\
`               key 97 = IF EXIT THEN`\
`               key 98 = IF EXIT THEN`\
`       AGAIN ;`\
```

Yes, we sneaked in yet another indefinite loop that uses
`BEGIN`.

  ------------------------ -------------------------- --------------------------------------------------------------------------
  `AGAIN`   `( \-- )`   Returns execution unconditionally to the nearest `BEGIN`.
  ------------------------ -------------------------- --------------------------------------------------------------------------

Of course, if you write a
`BEGIN`\...`AGAIN` loop, the loop must
have some other way of terminating, such as `EXIT`.

If you write `EXIT` within a
`DO`\...`LOOP`, you have to remember one
more thing---Mops (as with any kind of Forth) keeps some extra
information around to perform the
`DO`\...`LOOP`, and you have to remove
this information if you are going to end a
`DO`\...`LOOP` in some unusual way (that
is, not via `LOOP`, `+LOOP` or
`LEAVE`). The word to use is `UNLOOP`.

  ------------------------- ---------------------------------------------------- -------------------------------------------------------------------------------------------------------------------------------------------
  `UNLOOP`   class="STACK" nowrap \| `( \-- )`   This word will safely remove all loop information from the return stack when exiting from a `DO`\...`LOOP`.
  ------------------------- ---------------------------------------------------- -------------------------------------------------------------------------------------------------------------------------------------------

We'll illustrate this with the countdown example again:

```bash
`: COUNTDOWN3`\
`       1 10 DO`\
`               i . cr`\
`               i 7 = IF  ." Aborted!!" cr UNLOOP EXIT  THEN`\
`       -1 +LOOP`\
`       ." Ignition...Liftoff!" cr ;`\
```

You'll notice that we've been able to reinstate the
Ignition\...Liftoff! message, but by aborting the loop via
`UNLOOP` and `EXIT` we bypass them
entirely.

> Warning: When you're designing loops, it is sometimes possible for an
> infinite loop to slip in accidentally. Try to avoid them! Double-check
> the stack operations of your indefinite loops to make sure that there is
> always at least one condition that will allow you or your program to
> terminate the loop. Otherwise, your program will appear to "lock up"
> and may be unresponsive to your keyboard input. If this happens, you'll
> have to force quit the Mops application.


