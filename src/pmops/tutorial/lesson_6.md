---
title: Objects and Their Messages
layout: default
---

Now we come to creating an object of class `Rect` and
sending messages to that object so it can select the methods to execute.
To create an object of class `Rect`, the syntax is simply
the name of the class followed by the name you want to assign to the
object. For an object named "`Box1`" of class
`Rect`, the statement would be:

`Rect Box1`

That's all there is to it! By creating this object, you have added a
new Mops word, "`Box1`" to the dictionary in memory.
Recalling our definition of `Rect` from the previous
lesson, you can visualize the object in memory to look like:

![](/pmops/CreateObject.png "CreateObject.png")

Zeros are placed in the instance variable cells when the object is
created, and they are holding space for numbers whenever the object
receives a message to put data there.

When you type a Mops message in a program, it has three parts to it: the
parameters, selector, and receiver.

Parameters are the numbers to be passed to the operation. They are
placed on the parameter stack just like parameters in
\[Chapter1.html\#Enter Lesson 1\]. Not all messages have parameters, of
course. Some operations don't require any numbers be passed to them.

The second part, the selector, is actually the name of the method
containing the operation you want the object to perform. In other words,
the object "selects" which method of its class is to be put to work;
the object matches the message's selector with the method in the
object's class (or up the superclass hierarchy if there is no match in
the immediate class).

The last part of a message, the receiver, must be the name of an object.
It is the "thing" on which you want to perform the operation specified
by the selector. In the accountant metaphor used in the preceding
lessons, the receiver is the name of the accountant who is to prepare
the returns.

Since `Box1` is an object of our rectangle class, you can
send a message to it that selects one of the methods defined in class
`Rect`. If you send the message

`300 20 400 100 put: Box1`

you put the coordinates 300,20 and 400,100 into the data cells reserved
for `TopLeft` and `BotRight` in the
`Box1` object. After all, that's what the
`PUT:` method in `Box1`'s class does: it
places two sets of two parameters into an object's data cells.

If, at some future time, you create a new object of class
`Rect`, called "`Box5`",
`Box5`'s data cells would be empty at first. A separate
`PUT:` message would have to be sent to
`Box5` to place `Box5`'s coordinates in
that object's data cells. This is how objects maintain *private data*.

Now, to draw the objects on the screen with `Box1`, you
need to send another message, one that calls upon the
`DRAW:` method of class `Rect`. The
message would be:

`draw: Box1`

If you were defining class `Rect` from scratch, you could
also define a new method that combines the functions of two methods into
one. Then, a single message would take care of both the
`PUT:` and `DRAW:` methods. For this to
happen, you need a way for the new method to look up the methods in the
same class. That's where a message receiver called
`SELF` comes in handy. With the new method
(`DISP:`) the class looks like this:

```bash
`:class  RECT  super{ object }`\
`record`\
`{      point     TopLeft`\
`       point     BotRight`\
`}`

`:m PUT:                put: BotRight   put: TopLeft  ;m  ( l t r b -- )`

`:m DRAW:       ^base  FrameRect  ;m`

`:m DISP:       put: self  draw: self  ;m`

`;class`\
```

The `DISP:` method contains the messages, '`put:
self`' and '`draw: self`'. The '`put:
self`' message is saying, Do to the current object everything
that the `PUT:` method in this class does. The same goes
for '`draw: self`'. If you had intended one of these
messages to look up a method in `Rect`'s superclass, the
receiver would have been `SUPER` (as in '`put:
super`').

Something important happens when you have the '`put:
self` message inside the `DISP:` method. The
`DISP:` method now expects to find four integers passed
along with any message bearing its selector, just like the actual
`PUT:` method that executes the storage command requires
four integers. Therefore, to both locate and draw `Box1`
on the screen, you would send the message:

`12 10 100 50 disp: Box1`

If you want to try this, you'll have to have a window to display
`Box1` in, as you did in the \[../Overview/Chapter1.html
Introduction\]. So first copy the `Rect` definition
(above) to the Mops window (either by typing it in or by copying and
pasting it). Then *select* the whole of the definition (by dragging with
the mouse). Then hit the ENTER key. This will cause all the selected
text to be executed. In this case, since the code is a class definition,
the result of executing the code will simply be to define the class
`Rect`. Nothing will seem to happen, but the definition
for `Rect` will have been entered into Mops' dictionary
and will be ready to do your bidding.

Now type and execute this:

`Window ww`\
`test: ww`

Click back on the Mops window and move things around so you can see both
the Mops window and `ww`, then type and execute

`Rect Box1`

`set: ww`\
`12 10 100 50 disp: Box1`

and your `Rect` instance (`Box1`) should
appear in the window `ww`.

\[\#Summary Summary\]
---------------------

Before taking one more step, let's summarize. Creating a Mops program
entails the following steps: defining classes; creating objects that are
instances of those classes; and then sending messages to those objects.
Building a hierarchy of classes starts with the broadest class and works
toward the more specific classes, with subclasses inheriting the
characteristics of their superclasses.

The following diagram will help you visualize the structure of the
program example detailed in this chapter. It graphically portrays the
relationships between the classes and objects discussed above.

![](/pmops/ObjectStructure.png "ObjectStructure.png")

Given this framework, when you issue the message '`12 10 100 50
disp: Box1`', the parameters fill `Box1`'s data
cells held in reserve when `Box1` was created.

The characteristics of the data had already been determined by the ivars
`TopLeft` and `BotRight`\<nowiki\>; the
characteristics of each those ivars had been likewise determined by the
ivars \</nowiki\>`X` and `Y`, which, in
turn, had been defined by the methods of their defining class, class
`Int`.

Therefore, you probably recognize that the relationships in Mops classes
and objects are on multiple levels. On the one hand, you have the
relationships between superclasses and subclasses. On the other hand,
you have the relationships between ivars and their defining classes.
Both relationships cascade through the hierarchy of a Mops program
independently of each other. That will become even clearer as we make
one further extension to the example above.

------------------------------------------------------------------------

  ------------------------------------------- --------------------------------- ---------------------------------
  [Lesson 5](Lesson_5)             [Tutorial](Tutorial)   [Lesson 7](Lesson_7)
  [Documentation](Documentation)                                     
  ------------------------------------------- --------------------------------- ---------------------------------



