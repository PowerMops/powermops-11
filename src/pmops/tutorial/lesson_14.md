---
title: Fixed-Point Arithmetic
layout: default
---

The version of Mops that you've been using in this tutorial utilizes
fixed-point arithmetic (also called integer arithmetic) instead of
floating-point arithmetic. The primary difference between the two is
that fixed-point arithmetic functions only with integers. You had a hint
of that when you started experimenting with division in [Lesson
3](Lesson_3#Arithmetic_Operators): the answer on
the stack was either an integer quotient or a quotient-plus-remainder
(both of which were integers). Floating point arithmetic, on the other
hand, allows you to enter numbers with digits to the right of the
decimal.

Floating-point arithmetic is convenient in many instances, especially
when results of operations traditionally are other than whole numbers:
financial calculations, for example, which have cents to the right of
the decimal point. But floating-point also has some drawbacks, which
should be particularly important to you as a Mops programmer.

One drawback is that floating-point arithmetic takes up more memory in
the computer, increasing the size of the Mops kernel. This is not as
significant now as it was a even few years ago, when memory was much
more expensive.

Second, floating-point arithmetic usually takes more time to calculate
than fixed-point. Depending on the computer and the language, a
floating-point calculation can take up to ten (or in some cases, even a
hundred) times as long as the same calculation performed with
fixed-point arithmetic.

And third, floating-point arithmetic can be less accurate than
fixed-point in some calculations. You cannot, for example, multiply a
number by precisely by the fraction one-third in floating-point
arithmetic; you must multiply by 0.33333... . And there will always be
some error in the calculation, which can compound itself after a couple
of further calculations based on this approximation of one-third.

Actually, most programs have no need for floating-point arithmetic at
all. For this reason, the basic Mops system has only the smaller and
faster fixed-point support, with floating-point available as an option
for those who need it.

But fixed-point arithmetic presents a problem of its own, because you
may be accustomed to dealing with numbers other than integers, numbers
like &pi; (pi) or percentages. To accommodate such numbers, Mops
requires that you use scalars, or operations that appear to convert
floating-point numbers into fixed-point numbers.

Two of the most used scalars are those that are actually special-case
combinations of familiar arithmetic operations:

  ---------------------------------------------- ------------------------------------------------------------------------------ ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  `*/`      `( n1 n2 n3 -- result )`             Multiplies `n1` times `n2` and then divides that result by `n3`, leaving the final result on the stack.
  `*/MOD`   `( n1 n2 n3 -- remainder result )`   Same as `*/` but leaves both the result and the remainder on the stack.
  ---------------------------------------------- ------------------------------------------------------------------------------ ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Notice carefully the order of the items on the stack and how they are
treated by the arithmetic operations, because they are not as you would
expect in a regular combination of Mops arithmetic operations. But the
order allows you to better visualize the process by changing the
algebraic infix notation of a problem to Mops' postfix notation. For
example, to multiply 100 times the fraction two-thirds, the
paper-and-pencil equation

`100 * 2 / 3`

then becomes

`100 2 3 */`

Similar operations can be used to work with percentages. Simply put a
100 in place of the '`n3`' in the description
above and the percentage figure in place of
'`n2`'.

Decimal, Hex, and Binary Arithmetic
-----------------------------------

When Mops works with numbers "under the hood", it often uses numbering
systems other than the traditional decimal (base-10) system. The two
most often used non-decimal numbering systems are the hexadecimal and
binary numbering systems. Each has very different characteristics.

The hexadecimal numbering system is a base-16 system. That is, instead
of numbers increasing say, from one to two digits after the "ones"
digit has cycled from zero through nine, it cycles after fifteen digits.
To denote the digits after 9, hexadecimal notation uses the first
several letters of the alphabet. Corresponding to decimal 10 is
hexadecimal A; decimal 11 is hexadecimal
B; and so on through hexadecimal F. A hexadecimal
(sometimes shorted to "hex") number is usually preceded by a special
sign (\$) so you know that \$24 is hexadecimal 24 (decimal 36) instead
of the decimal 24.

The binary numbering system, at the other extreme, has only two digits,
a zero and a one. This system may not seem very useful in light of
decimal and hexadecimal systems, but as you get further into the
programming with the Mac, You'll find times when binary math is
absolutely essential for ease of designing elements such as cursors,
text fonts, and icons.

To show you the differences among the three bases, here is a table of
the first twenty numbers in each base:

  Decimal   Hexadecimal   Binary
  --------- ------------- -----------
  0         0             0000 0000
  1         1             0000 0001
  2         2             0000 0010
  3         3             0000 0011
  4         4             0000 0100
  5         5             0000 0101
  6         6             0000 0110
  7         7             0000 0111
  8         8             0000 1000
  9         9             0000 1001
  10        A             0000 1010
  11        B             0000 1011
  12        C             0000 1100
  13        D             0000 1101
  14        E             0000 1110
  15        F             0000 1111
  16        10            0001 0000
  17        11            0001 0001
  18        12            0001 0010
  19        13            0001 0011
  20        14            0001 0100

You might have noticed in this list that there is a special relationship
between binary and hexadecimal; each time one place of the hexadecimal
number reaches the maximum (F), four consecutive places of a binary
number reach their maximum (1111). This relationship will prove more
important later on.

Although the binary numbers shown in the above list are eight bits wide
(each binary digit, that is, a or 1, is called a bit), Mops actually
stores numbers on the stack as thirty-two bit binary numbers. Therefore,
even though you type the number 10 (decimal) into the stack, the number
is actually stored as:

`0000 0000 0000 0000 0000 0000 0000 1010`

If you were to calculate how many numbers you could describe within a
thirty-two bit binary number, it would come out to 4294967296, that's
over four-billion. Plenty big for just about every job you'll put your
Mac to.

> Note: You've probably noticed that we space out binary numbers in
> groups of four bits. In a computer's memory, bits are stored
> consecutively, one after the other, but we use this convention to
> improve readability. For example, is 10000010110001000000 the same
> number as 10000101100001000000? When you group them in fours, it would
> be easy to see without hesitating or getting cross-eyed that they are
> *not* the same numbers.

But, that's four-billion *positive* numbers. How do you work with
negative numbers?

## Signed and Unsigned Numbers

The answer lies in a special technique of Mops that takes the unsigned
(positive only) range of four-billion and divides it into two halves,
each slightly more than two-billion numbers. One half is assigned to the
positive range, the other half to the negative. In other words, the
range of these signed (positive or negative) numbers is plus-or-minus
2147483647.

What distinguishes a signed from an unsigned number is the way you
perform operations on them. For example, if you enter a negative number
onto the stack, the minus sign (-) shows Mops that you intend to use a
signed number. If, on the other hand, you were to enter the number three
billion onto the stack, Mops would know that you mean it to be an
unsigned number, since anything above the plus-or-minus 2-billion range
can only be an unsigned number.

But you can force the issue if you want, and convert the designation of
a number on the stack for use in arithmetic operations and display
purposes.

To understand this process, imagine that you are using a tape recorder
that has a digital tape counter that counts in binary. If you set the
counter to 0000 0000 and start to rewind the tape, the first thing that
shows up on the counter is 1111 1111, which is actually -1 with respect
to zero. But if you were to fast-forward the tape, the counter's
maximum number would also be 1111 1111. That high number would
correspond to the four-billion number of an unsigned number. But as a
signed number, 1111 1111 represents the start of counting backwards from
zero, that is, -1.

For some hands-on experience with this concept, consider first that the
`.` (dot) command you learned in the early sections of
this manual was actually a command to display the signed number
equivalent of the number on the stack. That means that it can display
numbers only within the plus-or-minus two-billion range. Prove it now by
entering three-billion (a 3 and nine zeros) on the stack. Sure enough,
the stack display will show:

```bash
Stack:  depth 1
-1294967296
```

which is a signed number equivalent, a negative number near one-billion.

Conversely, let's enter a -1 (a signed number) onto the stack. This
time, however, you want to display it as an unsigned number. To do this,
you use the word `U.`, which first converts the number to
an unsigned number and then types it to the screen.

  ------------------------ ------------------------------------------------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  `U.`      `( n \-- )`               Prints the number on the top of the stack to the screen as an unsigned, single-precision number.
  `U<`      `( u1 u2 \-- boolean )`   Compares two unsigned single-precision numbers. If '`u1`' is less than '`u2`', then leaves TRUE on the stack; otherwise, leaves FALSE.
  `U>`     `( u1 u2 \-- boolean )`   Compares two unsigned single-precision numbers. If '`u1`' is greater than '`u2`', then leaves TRUE on the stack; otherwise, leaves FALSE.
  ------------------------ ------------------------------------------------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Try this sequence and watch what happens:

`-1 U. cr`\
`4294967295 `

Just to reinforce the difference, now try the same example with -1 using
`.` instead of `U.`.

## One Last Set of Numbers; ASCII

You've already had a preview of a set of numbers called ASCII codes.
These are numbers that were assigned by an industry standards group to
every number, letter, and symbol on the computer keyboard, plus many
control codes that computers use to communicate with each other and with
peripherals they use (such as printers). ASCII (pronounced "as-key")
is an acronym for American Standard Code for Information Interchange. It
is this standard that allows computers to communicate so effectively
over telephone lines and even network connections.

> Note: Actually, Mops itself supports Unicode, which is a vastly larger
> standard that encompasses many languages around the world, as well as
> formal rules for encoding, manipulating, and displaying those languages.
> The good news is that you won't generally need to be aware of this
> difference, since all the characters in the ASCII standard have been
> included as a subset of the of the Unicode standard. In this manual,
> consider our use of the term ASCII to be synonymous with that subset of
> the Unicode standard made up of characters found in the ASCII character
> set.

When you press the letter 'a' on the keyboard, the computer recognizes
the character only as the number 97 (decimal). Because each letter and
symbol has a unique number, it is possible to make comparisons of a key
pressed and manipulate characters on the screen with the many number
crunching tools you've already learned. If you know, for example, that
all capital letters of the alphabet are numbered from 65 to 90, it is
possible to create a `DO`\...`LOOP` that
instantly prints those letters on the screen:

```bash
`: ALPHABET  91 65 DO  i emit cr  LOOP ;`\
```

`EMIT` is a Mops word that displays on the screen the
character that is referenced by its ASCII number. If you want to put a
particular ASCII character value on the stack, you can use the Mops word
`&` ("ampersand"). Try typing:

```bash
& c . cr
99
```

and you'll see that the stack display shows 99, which is the ASCII
value for 'c'. Other Mops words that might go along with
`EMIT` and `&` are:

  ------------------------- ------------------------------------------------------ --------------------------------------------------------------------------------------
  `EMIT`     `( n \-- )`   Displays the character referenced by ASCII number, '`n`'.
  `SPACE`    `( \-- )`     Displays a blank space on the screen.
  `SPACES`   `( n \-- )`   Displays '`n`' blank spaces on the screen.
  ------------------------- ------------------------------------------------------ --------------------------------------------------------------------------------------

Here's a use of `SPACES` in a modified alphabet
definition to demonstrate its power:

```bash
: ALPHABET2  91 65 DO  i dup  64 -  spaces  emit cr  LOOP ;
```

It is also convenient to remember that upper- and lower-case letters are
separated by a factor of 32, regardless of the letter. This may come in
handy when you need to convert upper to lower cases or vice versa.


