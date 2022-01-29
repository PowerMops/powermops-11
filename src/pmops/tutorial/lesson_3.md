---
title: Stack Notation
layout: default
---

Before we go further, you should become acquainted with a special
notation that tells someone reading your program listing what's
happening on the stack before and after a command. The format is:

`( before -- after )`

The arrangement of values on the stack is shown both before and after
the operation (note the space between the opening parenthesis and the
start of the description). The actual operation is implied by the
double-hyphen (--). Therefore, in an addition operation (just the
`+` operation, not the extra stuff to display it and move
the Mops prompt) you have two numbers on the stack *before* the
operation, and you end up with a single number, the sum of those
numbers, on the stack *after* the operation. That is, you start with
your first and second numbers on the stack and end with the sum on the
stack. The stack notation looks like this:

`( n1 n2 -- sum )`

This, therefore, is the description for the addition operation.

For the dot command, the description is:

`( n -- )`

because this command takes the topmost value from the stack and displays
it on the screen. The value is removed from the stack in the process,
leaving no trace of it on the stack after the operation.

In the `CR` command there is nothing happening to values
in the stack, it simply moves the prompt to the left margin of the next
line. Because no stack operations are involved, the `CR`
command's notation is:

`( -- )`

The definition of every Mops word you define in a program should be
accompanied by its stack notation. Our convention is that we may omit
the stack notation if it is `( -- )`,
but only in this situation.

Peruse the [Classes section of this manual](Classes) to
see how we have noted the stack actions of all the words in the Mops
dictionary. While the notation will at first help you learn how Mops
words work, it will also help you later when you start writing programs
in an editor. The words and numbers in parentheses (with at least one
space after the opening parenthesis) are not compiled into the program,
so they won't add even one byte to the size of your final program. The
notations are there to aid you in tracing your program if you run into a
snafu during program development.

All in all, the stack notation is a handy shortcut to documenting your
programs.

> Note: Since anything in parentheses (i.e., starting with an open
> parenthesis followed by one or more spaces) is ignored by Mops, you
> don't have to type stack notation for words you define at the Mops
> prompt. Stack notation is strictly an aid for reading source code. In
> this tutorial, we often show the stack notation for words you define.
> The notation is presented to help you better understand the definition
> and show you how your definitions should look once you begin writing
> your own programs in an editor.

## Arithmetic Operators

Here are Mops stack descriptions of the four basic arithmetic
operations:

  `+`                         `( n1 n2 \-- sum )`    Adds 'n1' and 'n2' and leaves the sum on the stack.
  ------------------------------------------ ------------------------------------- -------------------------------------------------------------------------------
  `-`                         `( n1 n2 \-- diff )`   Subtracts 'n1' and 'n2' and leaves the difference on the stack.
  `\<nowiki\>*\</nowiki\>`   `( n1 n2 \-- prod )`   Multiplies 'n1' and 'n2' and leaves the product on the stack.
  `/`                         `( n1 n2 \-- quot )`   Divides 'n1' and 'n2' and leaves the quotient on the stack.

To newcomers, the stack order (the way in which numbers come out in the
reverse order) may be confusing when it comes to subtraction and
division, because the *order* of the numbers is critical to those
operations. If you want to subtract 4 from 10, you want to make sure
that those numbers come out of the stack in the correct order for the
subtraction operation to work on them. Fortunately, Mops saves you from
performing all kinds of mental gymnastics in the process.

In the kind of arithmetic notation you probably learned in school, you
write the problem like this:

`10 - 4`

and get the desired answer, 6. In Mops arithmetic, the order of the
numbers going on the stack is the same. All you do is move the operation
sign to the right.

In this case, the problem becomes:

`10 4 -`

The same goes for division. The formula for dividing 200 by 25 changes
from

`200 / 25`

into

`200 25 /`

The four basic arithmetic operations are usable only on integers, that
is, whole numbers like -2, , 3, -453, and 1002. Numbers with digits to
the right of the decimal don't count. Don't worry, however, because
Mops has plenty of ways to handle all kinds of numbers, as you'll see
later on.

Experiment using the four simple arithmetic operations. Place one, two,
three, and four integers (or more if you like) in the stack to
understand how the operations make use of the numbers in the stack. Try
them out now, and pay special attention to answers to division problems.

If you tried it, everything should have worked well, except when you
divided numbers that were not even multiples of each other. For example,
if you divide 10 by 3, the Mops answer is 3.

`10 3 / . CR`\
`3`

When you use the divide operation (`/`) in Mops, the
remainder is lost forever. But Mops has two other operations that take
care of the remainder for you:

  `/MOD`   `( n1 n2 \-- rem quot )`   Divides 'n1' by 'n2' and then places the quotient and remainder on the stack.
  `MOD`    `( n1 n2 \-- rem )`        Divides 'n1' by 'n2' and then places only the remainder on the stack.

Let's try dividing 10 by 3 again, but this time using the
`/MOD` operation instead of straight division
(`/`). (Remember! Mops is case-insensitive.)

`10 3 /mod . . cr`\
`3 1`

Notice now that both the quotient (3) and remainder (1) were returned to
the stack (and subsequently printed out by two dot commands). Notice
also the order of the two answers as they came out of the stack and how
the order compares with the order of the `/MOD` stack
notation above. The rightmost value in the stack definition, the
quotient, was on the top of the stack and was therefore the first one to
be printed out on the display.

Division involving negative numbers can be done in two different ways.
In Mops we use the convention used by the Apple hardware, namely
"towards zero" division (often referred to as symmetric division). If
the exact quotient isn't an integer, the quotient that the division
operation gives will be the next integer towards zero. For example, -10
divided by 7 will give a quotient of -1, with a remainder of -3. (The
remainder will always have the same sign as the first operand, the
dividend, unless it is zero.)

## Mastering Postfix Notation

If you're not particularly well versed in this reverse notation, called
postfix notation (also known as reverse Polish notation), then it is
important to recognize that complex math formulas need to be analyzed
before they can be entered into Mops's postfix, integer arithmetic
environment. For example, you may find yourself confronted with having
to include the following formula in a Mops program:

```bash
1.25 * 12 * 50
----------------
      10
```

If so, then Mops' integer arithmetic might seem like a stumbling block,
and its postfix notation may seem worthless. But call upon simple
algebra to convert everything to integers, and break up the complex
formula into the same steps you would use to solve it with a pencil and
paper.

The Mops equivalent of this formula is:

`5 12 50 * * 40 /`

It's worth following what happens to the stack during a complex formula
like this. First of all, to make the 1.25 an integer, multiply it and
the denominator (10) by four. Then put all three numbers to be
multiplied into the stack. The first multiplication operation multiplies
the topmost two numbers (50 times 12) leaving the result (600) on the
stack. That leaves 600 on the top of the stack, and 5 just below it. The
second multiplication operation multiplies the two numbers remaining on
the stack (600 times 5) and leaves the result (3000) on the stack. This
result is the dividend (numerator) of the division about to take place.
Now it's time to put the divisor (denominator), 40, on top of the
stack. Then the final operation, the division, divides the two numbers
in the stack.

Don't be discouraged by all this concern over the stack! You'll learn
in Lesson 10 that Mops provides you with two powerful tools, [ named
input parameters](Lesson_10#Named_Input_Parameters) and [
local variables](Lesson_10#Local_Variables), that let you
substitute readily identifiable names for the values on the stack and
use them at will. The stack will become almost invisible to you. It is
important, however, to understand the stack fundamentals just the same.

