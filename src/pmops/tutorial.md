---
title: Tutorial
layout: default
---

* Introduction
  * [Before we begin](#before-we-begin)
  * [Backup](#backup)
  * [Using an editor](#using-an-editor)
  * [Mops - an object oriented language](#mops---an-object-oriented-language)
* [Lesson 1 - Starting Up](lesson_1)
  * [The Mops Window](lesson_1#the-mops-window)
  * [The ENTER Key](lesson_1#the-enter-key)
* [Lesson 2 - The Stack](lesson_2)
  * [Stack Arithmetic](lesson_2#stack-arithmetic)
* [Lesson 3 - Stack Notation](lesson_3)
  * [Arithmetic Operators](lesson_3#arithmetic-operators)
  * [Mastering Postfix Notation](lesson_3#mastering-postfix-notation)
* [Lesson 4 - Mops and OOP](lesson_4)
  * [Methods and Inheritance](lesson_4#methods-and-inheritance)
  * [Objects and Messages](lesson_4#objects-and-messages)
* [Lesson 5 - Mapping Class-Object Relationships](lesson_5)
  *  [Defining a Class](lesson_5#defining-a-class)
* [Lesson 6 - Objects and Their Messages](lesson_6)
  * [Summary](lesson_6#summary)
* [Lesson 7 - Modifying a Program](lesson_7)
* [Lesson 8 - Introducing QuickEdit](lesson_8)
* [Lesson 9 - Predefined Classes](lesson_9)
  * [Data Structure Classes](lesson_9#data-structure-classes)
  * [Other Predefined Classes](lesson_9#other-predefined-classes)
* [Lesson 10 - Defining New Words](lesson_10)
  * [The Return Stack](lesson_10#the-return-stack)
  * [Named Input Parameters](lesson_10#named-input-parameters)
  * [Local Variables](lesson_10#local-variables)
* [Lesson 11 - Specialized Operations](lesson_11)
  * [Displaying Text](lesson_11#displaying-text)
  * [Explicit Stack Manipulations](lesson_11#explicit-stack-manipulations)
* [Lesson 12 - Conditionals](lesson_12)
  * [Two Alternatives](lesson_12#two-alternatives)
  * [Truths, Falsehoods, and Comparisons](lesson_12#truths-falsehoods-and-comparisons)
  * [Nested Decisions](lesson_12#nested-decisions)
  * [Logical Operators](lesson_12#logical-operators)
  * [The CASE Decision](lesson_12#the-case-decision)
* [Lesson 13 - Loops](lesson_13)
  * [Definite Loops](lesson_13#definite-loops)
  * [Nested Loops](lesson_13#nested-loops)
  * [Abort Loop](lesson_13#abort-loop)
  * [Indefinite Loops](lesson_13#indefinite-loops)
  * [EXIT](lesson_13#exit)
* [Lesson 14 - Fixed-Point Arithmetic](lesson_14)
  * [Decimal, Hex, and Binary Arithmetic](lesson_14#decimal-hex-and-binary-arithmetic)
  * [Signed and Unsigned Numbers](lesson_14#signed-and-unsigned-numbers)
  * [ASCII](lesson_14#ascii)
* [Lesson 15 - Global Values](lesson_15)
* [Lesson 16 - Sine Table Demo](lesson_16)
  * [Building a Sine Table](lesson_16#building-a-sine-table)
  * [How the Sine Table Works](lesson_16#how-the-sine-table-works)
  * [What Happens On the Stack](lesson_16#what-happens-on-the-stack)
* [Lesson 17 - Building a Turtle Graphics Program](lesson_17)
  * [Experimenting With Turtle](lesson_17#experimenting-with-turtle)
* [Lesson 18 - Create a Mini-Logo Language](lesson_18)
  * [Designing the language](lesson_18#designing-the-language)
  * [Implementing a Logo-like language](lesson_18#implementing-a-logo-like-language)
* [Lesson 19 - Inside the GrDemo](lesson_19)
  * [Views](lesson_19#views)
  * [Positioning Views](lesson_19#positioning-views)
  * [Drawing Views-the DRAW: method](lesson_19#drawing-views-the-draw-method)
* [Lesson 20 - Windows](lesson_20)
  * [The GrDemo Window](lesson_20#the-grdemo-window)
  * [dWind](lesson_20#dwind)
  * [Controls](lesson_20#controls)
  * [GrDemo Controls](lesson_20#grdemo-controls)
  * [Scroll Bar Actions](lesson_20#scroll-bar-actions)
* [Lesson 21 - Menus](lesson_21)
  * [Running the Program](lesson_21#running-the-program)
  * [In Summary](lesson_21#in-summary)
* [Lesson 22 - Installing an Application](lesson_22)
  * [Where To Go From Here](lesson_22#where-to-go-from-here)

Before we begin
---------------

You can compile a floating-point enabled version of either Mops.dic or
PowerMops simply by loading the appropriate source file and saving the
result, normally as a different program. In this manual we refer to such
floating versions as MopsFP.dic and PowerMopsFP. The source files are,
reasonably enough, named `'floating point'`
for Mops-68K and `'zfloating point'` for
PowerMops, both located in the System source subfolder of the Mops
source folder.

In case you can't *intuit* your way after a little exploration of the
Mops window, instructions for compiling source and saving the results
are given a little farther on.

*Caution:* In all the following keyboard examples, Mops commands
are always terminated by `enter>`,
and `enter>` is not the same as
`<return>`. Many Mac applications
treat these two keys as equivalent, but Mops doesn't. Once you've used
Mops for a while you'll come to appreciate the usefulness of this
feature.

Backup
------

We can't emphasize enough the importance of backup. Assuming you are
using a hard disk, you should keep it regularly backed up. With
programming, especially, system crashes are commonplace! But these
shouldn't worry you, if your disk is regularly backed up.

It would also be good to keep an extra backup of the original Mops
distribution, whether it was on disk or downloaded from the internet.
Then, if you somehow destroy anything in the Mops system, you can easily
get back to a working system, without having to download everything
again.

Using an editor
---------------

Mops does not have a built-in editor, but works in close cooperation
with QuickEdit, which was developed by Doug Hoffman especially for Mops,
and is included here in the **QuickEdit &#131;** folder. If both Mops
and QE are running, they communicate via Apple Events to perform a
number of useful functions. From Mops, you can ask QE to open a
particular source file, and this will also happen automatically when an
error occurs. From QE, you can send text to be interpreted by Mops, or
request that Mops locate a source file which QE then opens. QE also
incorporates an online Mops glossary. So we do recommend you give QE a
try.

To use the online glossary in QE, just highlight a word, and choose
Glossary under the Mops menu, or hit command-Y. Also, in the Glossary
window, if you start typing the name of the word you want to look up,
you'll be taken there. You'll find further instructions for using QE
in the Readme file in the **QuickEdit &#131;** folder.

In addition, QE is a proper standalone source-text editor for Mops
programs.

Mops - an object oriented language
----------------------------------

In Mops, much programming is done by sending **messages** to
**objects**. A Mops object can be a simulation of any real-world object
you're familiar with: a rectangle, a Macintosh window, an artist's
canvas, a bank account. When a Mops program runs, a relatively small
list of instructions route program execution through the framework of
objects, and the objects come to life: a rectangle draws itself on the
screen; a window appears; a mouse-controlled brush paints on an
artist's canvas; a bank account monitors income and payments.

Mops, itself, includes many predefined types of object. With this
preexisting framework, you can create complex objects as simply as
typing two words. Let's do that right now, so you can get a taste of
what Mops has in store for you. This is just a demonstration, not a
lesson. So type (or copy & paste) along with us and observe what
happens without trying to remember each step.

(Although there is a Mops-68K, comprised of the Mops and Mops.dic files,
as well as the PPC-native PowerMops, it doesn't matter which
application you use. Procedurally they are virtually identical. The
principal difference is that to invoke Mops-68K you doubleclick on the
Mops.dic file. Everything we say here applies as well to both.)

Open the **Mops &#131;** folder. Locate the Mops.dic icon and doubleclick
it. In a moment, the Mops window appears. We'll explain the window's
contents in detail in Lesson 1, but for now, create a rectangle object
called `box` in memory by typing:

`rect box`

(Remember to hit `<enter>` at the end.)

We need to tell box where on the screen it should appear, and how big it
should be. The rectangle framework inside Mops wants these instructions
in the form of screen coordinates for two opposite corners, the top left
and bottom right. We'll choose 20, 10 for the top left, and 100, 50 for
the bottom right. Put these figures into box's memory by typing the
following line, making sure you observe the spacing between elements and
the colon:

` 20 10 100 50 put: box`

This line is called a **message**, which we just sent to box. Now we
want to send messages to box so that it will draw itself on the screen.
First, however, it will need a window to draw itself in. To set up a
window object named `ww` in memory, type:

`window ww`

Macintosh windows need a lot of information before they can be placed on
the screen, including the rectangular limits of the window, the title of
the window, the type of window, whether it is to be visible, and whether
it has a close box. Even then, the Macintosh Toolbox requires much more
information, which Mops automatically supplies. Some of the Mops
classes, including Window, have test or example methods that display an
instance of that class, with typical values. To see the window you just
created, type the following message:

`test: ww`

You will be able to resize and drag **ww** around the screen as for any
Mac window. But if you type keys while **ww** is in front, nothing will
happen this is simply because we haven't told **ww** what to do with
keys. So move **ww** out of the way, and click on the Mops window so you
can type further commands. Resize the Mops window if necessary so that
**ww** is still visible.

Now type:

`set: ww draw: box`

The message 'set: ww' tells the system that drawing is now to take
place in **ww** (but without bringing it to the front). Box
should now appear in ww, and your screen should look something like
this (of course you might have put **ww** in a different place):

![](/pmops/BoxBkgd.png "BoxBkgd.png")

(We have shrunk the window's width to expose the background
box.)

When you are finished experimenting, select Quit from the File menu, or
type

`bye`

in the Mops window to quit Mops

Now let's move on with the Tutorial, and I hope you find you enjoy
Mops.

* [Lesson 1](lesson_1)
* [Documentation](Documentation)                                     
