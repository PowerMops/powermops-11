---
title: FAQ
layout: default
---
Create a Mini-Logo Language
---------------------------

The framework established by classes Pen and Poly allow you to create a
miniature version of the Logo language, which controls the position and
painted trail on the screen of a triangular object called a turtle
--- hence the name for this demo: Turtle.

We'll show you a few ways to get started. From there, you should be
able to develop a rather sophisticated Logo-like environment.

For this experimentation, we will be writing a customized version of
Turtle, which we'll call Logo. We'll be using an editor to modify
Turtle and save it as Logo for later loading into Mops dictionary.

If you have come to this lesson without turning off your Mac or quitting
Mops from the last lesson, then you should remove all of Turtle's code
from Mops dictionary. The fastest way to do this is to use Mops'
`FORGET` operation. `FORGET` deletes from
the current dictionary in memory all the definitions from a word you
specify. In other words, you type `FORGET` plus the first
definition of the Turtle program (Pen) to remove Turtle from memory.

To prove it, type:

`forget pen`

and then select List Words from the Utilities pull-down menu. After
several lines have printed on the screen, press any key (other than the
space key) two times. Notice that the word on the top of the dictionary
(the one at the upper left of the listing) is Angle, which is the last
definition of Sin --- the program loaded prior to Turtle.

If, on the other hand, you are starting this lesson fresh, then start up
Mops and load Sin. Our Logo program will load atop Sin.

> Note: FORGET is obsoleted in PowerMops. Surely, it is
> defined in PowerMops but its execution deletes only a part (code part)
> of the dictionary.
> 
> **So in the present case it is better to quit PowerMops once.**

## Designing the language

We start by defining in our minds what we want our mini language to
do.\<br /\> First of all, we want a turtle on the screen that will be a
triangular object from class Poly.\<br /\> Next, we want to be able to
perform a few maneuvers, such as: centering the turtle on the screen;
making it move forward in a given direction according to the number of
pixels we specify, while the turtle leaves a trail of its pen on the
screen; making it turn to the right or left according to the number of
degrees we specify.\<br /\> Finally, we'll define one shape, a square,
which the turtle will draw if we tell it how long its sides should be.

Looking through the methods available in Poly and Pen, we see that if we
draw the turtle in one location and then move it to another, the
original turtle on the screen will still be there, cluttering up the
screen. Therefore, we need to define an additional method, called
UNDRAW:, for class Pen that undraws a turtle where we tell it.

Since the UNDRAW: method will be adjusting the PenPattern (from black to
white) and redrawing the object, this method will be defined in terms of
the DRAW: method. Therefore, we can place the UNDRAW: method anywhere in
the class Poly definition after the DRAW: method.

As far as the PenPattern parameters go, you can look in the QuickDraw
chapter of **Inside Macintosh** for guidance. If there is not enough
information there to help (and sometimes there is not), you always have
the powers of Mops to help you. For example, while you are experimenting
with parameters, you can place a special method inside class Pen that
fetches the current values of the parameters from an object:

```bash
`:m INSPECT:            \ (  --  HiPat  LoPat  mode w h x y )`\
`            get: PnPatHi  get: PnPatLo  get: PnMode`\
`            get: PnSize  get: PnLoc   ;m`\
```

Send a message like:

```bash
inspect: Bic
```

Then perform a .S operation to view the parameters on the stack.
Experiment by placing other values in the parameters via a message that
calls the INIT: method. Try to draw some objects to learn the results of
the new parameters.

Back to the Logo example and UNDRAW:, the PenPattern values that make a
white pen are 0,0 while the values for a black pen are -1,-1. Place one
integer of the pair in each variable, PnPatHi and PnPatLo, draw the
object with a white pen, and then restore the pen to black.\<br /\> The
UNDRAW: method could look like this:

```bash
`:m UNDRAW:            \ Erases object before moving it and restore black pen`\
`            0 0  put: PnPatHi  put: PnPatLo  draw: self`\
`            -1 -1  put: PnPatHi  put: PnPatLo  ;m`\
```

## Implementing a Logo-like language

Here is the listing of Mops definitions added to the end of the modified
Turtle listing:

```bash
`\ Create Logo-like environment`

`poly turtle                   \ the name of our Logo object`\
`250 160 center: turtle        \ define the center of the screen`\
`10 3 size: turtle             \ set turtle's size`

`: SPOT            \ Erases old Logo command onscreen and repositions prompt`\
`            8 210 gotoxy  ;`

`: .OK  -curs  spot  15 spaces  spot  +curs  ;`

`\ Shortcut definition for later:`

`: TURN  -curs  undraw: turtle  turn: turtle  draw: turtle  .ok  ;`

`\ Logo-like commands:`

`: HOME    -curs   cls   home: turtle   up: turtle`\
`          draw: turtle  .ok  ;`

`: FORWARD            \ ( dist -- )`\
`            -curs   undraw: turtle   move: turtle`\
`            draw: turtle   .ok  ;`

`: LEFT  ( deg -- )    turn  ;`

`: RIGHT  ( deg -- )            negate  turn  ;`

`: SQUARE   { len -- }`\
`           -curs   4 0  DO  len forward  90 right   LOOP`\
`            .ok  ;`\
```

The above Mops words should be self explanatory, except perhaps for the
two that control the location of the Logo prompt. In Logo, the
traditional prompt location is near the lower left corner of the screen.
The Mops word .OK always moves the cursor to the prompt location after
the object makes its mark on the screen. The 15 SPACES operation is
added to overprint the old command for a cleaner look on the screen.

While in your editor, save the modified source as 'Logo' (perform a
Save As\... operation from the File menu). Return to the Mops window.
Select 'Echo during load' from the Mops (Utilities) menu. Then load
Logo into memory with the Load selection from the File menu or by
typing:

`// logo`

The program source code will appear on the screen, line by line, as it
is being compiled into memory. If you used a word not previously
defined, the load will stop, and a message will tell you what word you
need to define. Some other messages such as 'object not unique' may
appear as well. As long as the load doesn't stop, however, nothing
fatal is occurring in memory. When the load is complete, clear the
screen with CLS (select 'Clear Window' item of "Utilities" menu
(CMD+2) on PowerMops) and check your program.

Starting the turtle in the home location, try issuing some Logo commands
to make the turtle draw lines, turn, and draw squares of various sizes.
You'll notice that after turning the turtle to some degree measures
(especially those not multiples of 45), the turtle will not fully erase
when you issue the subsequent command. The reason is that when the
Toolbox draws the turtle at odd angles, the finishing point of the pen
may be a pixel off from the original starting point. Then, when the
UNDRAW: method is invoked, it undraws from the finishing point of the
last operation, off-register from the original motion by one pixel.

But with Mops, that should present no difficulty. Tackle this problem
yourself. Try adding another ivar to the object that remembers the
starting point of the turtle, and use that point for the UNDRAW:
operation. Then, define new Mops-Logo words that make entry of commands
easier (e.g., establish abbreviated Logo commands such as FD for
Forward). This is the playground on which to cut your teeth on the words
in the Mops glossary and class-object-message relationships.

In the remaining lessons of this tutorial, we'll be exploring some of
Mops' predefined classes more closely, with the help of an extension of
the Turtle program that adds Macintosh-like features to it, such as
scroll bars, mouse input, windows, and menus.

