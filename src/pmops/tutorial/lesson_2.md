---
title: The Stack
layout: default
---

Type the numbers 7, 4, and 1 on one line with a space between them:

```bash
7 4 1<ENTER>
```

After you press ENTER, the stack display should now look like this:

```bash
 Stack:  depth 3
 1
 4
 7
```

The space (or delimiter) you typed between the three digits told Mops that you intended those three digits to be three different numbers. (You are not limited to one space. You may use two or more spaces, as well as the TAB key.) If you had typed 741 instead, then the single number 741 would have been put on the stack. It is important that you understand how numbers (such as these) are entered and stored on the stack.

The best way to demonstrate how a stack works is to use the oft-cited analogy of the spring-loaded pile of dishes you encounter in a cafeteria line. If you place one plate on the spring, it will obviously be the first one that will come off the top. But if you place a second plate on top of the first plate, the weight of the second plate pushes the first one down one step, and the second plate is the one that will be picked up off the top by the next customer in line. In other words, the last one put on the stack is the first one to be taken off the stack. (LIFO, in computer jargon, meaning "Last In, First Out".)

![Stack](/pmops/Stack.png)

You can see that this principle applies to the Mops stack, since the number 7, which you entered first, is at the bottom of the stack, while the number 1, which is the most recent entry, is at the top.

How can you remove numbers from the stack? One way is to use the Mops word that does the reverse of what you did when you entered a number&#148;it takes a number off the stack, and "types" (or prints) it at position of the flashing cursor in the lower part of the screen. That word is a simple `.` (a period, pronounced "dot"). Try typing this:

```bash
.<ENTER>
 1
```

What happened here was that the dot (type to screen) command pulled the 1 off the top of the stack and "typed" it. The stack display will show that two numbers (4 and 7) are still on the stack.

In other words, whenever you perform a dot operation on a number in the stack, the number is removed from the stack and "typed"&#148;that is, displayed in the current window. If the Mops window is the current window (as it is in this example), any number "typed" will appear at the cursor position, just as if you had typed it at the keyboard yourself.

To bring the Mops prompt to the left margin, where it will be less confusing, simply press RETURN (''not'' ENTER!) once. (Carriage returns are not automatically printed, unless you, as the programmer, tell Mops to print one. We'll show how to do that very shortly.)

Now type two periods, with a space in between, and press ENTER.

```bash
. .<ENTER>
4 7
```

Mops has now printed the two remaining numbers in the order in which they came off the stack. Remember that the 7 was at the bottom of the stack; it was therefore the last number off the stack, and was displayed on the screen as the final item before the Mops prompt (the flashing cursor) reappeared. As you can see, multiple dot commands leave a trail of numbers coming off the top of the stack, printing them from left to right across the screen. And notice, too, that nothing remains in the stack when the last dot command was executed.

Mops also has a word, `.S` (pronounced "dot-ess"), that displays a list of all numbers on the stack without removing them. This can be useful during the running of a program, since you may not want to stop the program to see the stack displayed at the top of the window. Also, there may be more items on the stack than can fit in the stack display. The stack can hold far more items than we have room to display in the upper part of the Mops window, but if you use `.S`, ''all'' the stack items will be typed in the lower part of the window.

To see how it works, place the same three numbers that we used before on the stack (don't forget the spaces):

```bash
7 4 1
```

And when you type `.S`, your screen will look similar to this:

```bash
.S<ENTER>
Stack: depth 3 
        1  $     1
        4  $     4
        7  $     7
```

The numbers to the left of the dollar sign ($) are the decimal values, while the numbers to the right are the hexadecimal values. The dollar sign in this list is a hex indicator. In this case, it happens that the stack numbers in both bases are the same. Note also that the Mops prompt at the end shows that the three numbers are still on the stack. The regular `.` command displays and removes one number at a time, while `.S` displays all numbers on the stack without removing any of them.

Experiment with the operation of the stack by putting numbers on the stack, viewing them with the `.S` operation, and taking them off by printing them to the screen, either one-by-one or in a series. As an added shortcut, you can use the `CR` command, which is short for "Carriage Return", after a dot command. If you type a `CR` as a command after one or more `.` commands (remember to type a space between the last period and the `CR`), the Mops prompt returns to the left margin of the next line.

For example:

```bash
1 10 100<ENTER>
. . . cr<ENTER>
100 10 1 
```

If you accidentally issue one more `.` command than you have entries on the stack, Mops will send you a message (along with the alert beep) that the stack is empty. Try it, no harm will occur.

```bash
1 10 100<ENTER>
. . . . cr<ENTER>
-1 

Error # -4  stack underflow
. . . . cr
       ^

Current object:  TW    class:  MLTEFWIND
```

The stack is also called the parameter stack (sometimes referred to as the data stack), because a good many operations in Mops require that one or more values be present on the stack before an operation can be performed. These values, in computer jargon, are called parameters, and they are said to be ''' passed''', or handed to, an operation. Actually, the operation looks to the stack for the number(s) it needs, and pulls them off.

You saw a glimpse in the last section of how parameters work, when the parameter stack held values that were to be printed to the screen. The parameter stack, in other words, is a kind of container for values that many operations rely on. This concept will become clearer as we now discuss how Mops performs arithmetic.

## Stack Arithmetic

If you've ever used a [Hewlett-Packard RPN Calculator](http://hpmuseum.org/), you are already familiar with keying in two values and then pressing the key that bears the symbol of the desired operation, such as `+` for addition or `*` for multiplication. You're actually utilizing a stack-type computer when you do this.

For those who have never used one of HP's RPN calculators, the steps to add numbers like 2 and 7 go like this:

1. Press the 7 key. The 7 is placed on the top of the stack and printed on the display.
2. Press the ENTER key. This pushes the 7 one cell deeper into the HP calculator's stack, a place in the calculator's memory where values are temporarily held until they are needed for an operation.
3. Then press the 2 key, which places the 2 on the top of the stack.
4. Finally, press the + key, which reads each value from the stack (first the 2, then the 7) and adds them together.
5. The answer, 9, appears both in the display and on the top of the stack, ready for further operations, if desired.

Mops works in very much the same way.

The step-by-step approach to add two numbers would be to put each number on the stack one at a time, and then press the + key as follows:

```bash
7
2
+
. cr
```

(We don't need to keep reminding you to type ENTER after each line of input, do we?)

Let's follow what happened here.

You should already understand how the stack counter increments each time you type a number and press ENTER. In the third line, you type the operation, the `+` sign for addition. When you press ENTER, the computer calculates the sum of the top two numbers on the stack for you, storing the sum on the stack. (Hence the stack display shows one value on the stack.) Note, too, that the original numbers were taken off the stack by the addition operation. Or rather, in a split instant, there was nothing on the stack as the two numbers were being added inside the computer. To display the contents of the stack (in this case, the result of your addition), you must issue the `.` ("dot") command. Sure enough, the answer, 9, was on the stack.

Mops lets you perform all these manipulations in a simpler form as a single line of instructions, as long as there is at least one space between each element. Here's how it looks:

```bash
7 2 + . cr
9
```

The line of instructions contains the same commands as the step-by-step method, but is much easier to type in. The only thing you miss along the way is a step-by-step readout of the stack display. But after all, it's the answer that should be important, not the momentary contents of the stack.
