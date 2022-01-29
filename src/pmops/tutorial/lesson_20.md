---
title: FAQ
layout: default
---
# Windows

Let's now return to the listing for grDemo. After we set the bounds and
justifications for the `dPane` and the three
`Indicators`, we declare `dView`, which is
to be the contView of our window. This can be a plain View, since it
doesn't need to have any other special properties.

Five values are created next. The first pair are the coordinate point on
the Mac screen of the top left corner of the window that the program
will occupy: coordinates 40,60. The next two are the coordinates for the
right bottom corner of the program window. These values will be suitable
for the small Mac screen (on e.g. a Classic), but should look all right
on any Mac screen. These figures will be recalled later when it comes
time to create the window for the program.

Next we come to a class that defines a special kind of
window: one that has controls in it and has an area where
graphics will be drawn.

The Macintosh Toolbox contains six predefined windows, each
with a unique **window definition ID** number.
The six windows, their names, and their IDs are illustrated
here:

![](/pmops/WindowVariant.png)

To avoid possible later confusion, you should note that the first window
actually has ID = 8, because it has a **zoom box**, the small square in
the top right hand corner. Mops' Window+ class adds the zoom box
because of the line:

`true setZoom: self \ zoomable`

When the window is created, Window+ adds 8 to the procID if zoom is set
true. Hence a `docWind` (0) becomes a ZoomdocWind (8),
and non-growable doc window (ID=4) would become a ZoomNoGrow (12). Not
all windows can have zoom boxes, though' so don't set Zoom TRUE if you
are using, for example, a rndWind.

Whenever you define a new window, choose one of the window types by
number. Mops has established three constants --- docWind, dlgWind,
and rndWind --- that you can substitute in place of the number, in
case it's easier for you to remember names than numbers. The Mops
constant names are shown in Figure I-18.

In **Carbon** window manager, the type of a Macintosh window is
determined by two parameters, Window Class and Window Attributes. An
instance of Window class in PowerMops is of Carbon document window class
by default. You can change the default by setting the value of a public
ivar `WindowClass` of the window object before sending
`NEW:` message. For example, when you need a floating
window, you may do like following:

`konst kFloatingWindowClass put: ivar> WindowClass in aWindowObj ...  new: aWindowObj`

As for public ivars, see [Reference 4](Reference_4) (Part
II) of this manual.

Window attributes include close box, zoomability, resizability, etc..
These attributes will be passed as the "window-definition-ID"
parameter with `new:` message. At present two constants,
`docWind` and `NoCloseDocWind`, are defined in PowerMops.

This Mops demo graphics program uses `docWind`, since
[Apple's Human Interface
Guidelines](http://developer.apple.com/documentation/UserExperience/Conceptual/OSXHIGuidelines/index.html)
recommend we use this for a standard growable window. But note,
`docWind` paramneter in PowerMops means that the window
should have all normal window attributes appropriate for a standard
document window. That is, `docWind` does NOT stand for
Document Window Class there. As for details of window classes and window
attributes, consult [Carbon Window Manager
Documentation](http://developer.apple.com/documentation/Carbon/Reference/Window_Manager/index.html).

Even plain windows are relatively complex objects inside the Macintosh
Toolbox. To give you an idea of their complexity, look at the long list
of instance variables in the predefined class, Window (in the file
WindowMod.txt in the folder 'Module source').\<br /\> Among the items
you can control --- and sometimes **must** control --- in a
window are:

- the kind of window (see above)
- the rectangular area on the screen to enclose the window
- whether a window is growable
- the area on the screen within which a window can grow
- whether a window is draggable
- the area on the screen within which a window can be dragged
- how it is to respond to key-down and mouse-down events

## The GrDemo Window

Class grWind, a subclass of `Window+` (itself a subclass
of Window) lays the framework for the window of this graphics
demonstration. As we have seen in the last lesson, all
`Window+` objects contain a view, the **contView**, which
simply covers the whole area of the window. The window knows which view
is its `contView`, since this is specified when the
`NEW:` message is sent to the window object to fire it
up. In our example, the contView of our grWind window is called
`dView`.

Giving the window enough parameters to present itself on the screen is
simplified in this program in the `NEW:` method, which is
an extension of the `NEW:` method of class
`Window+`. The only parameters needed are the address and
length of the title of the window, and the address of the contView. The
other pieces, the address of the window's rectangular bounds, the type
of window (rndWind), and flags for being visible on the screen and
having no close box are supplied within the method or as constants
already defined. Once all the items are on the stack in the proper
order, the method calls the superclass' `NEW:` method.

One of the actions performed by the `NEW:` method in
class `Window+` is to send `NEW:` to the
contView. This will cause `NEW:` to also be sent to every
view in the window, since one of the actions of `NEW:` in
class `View` is to send `NEW:` to all its
child views.

Once the window and all its views have been fired up, the views will
draw themselves. As we have seen, views draw themselves when they get a
`DRAW:` message. And what do we have to do to start this
process off? You may remember we mentioned this in the last lesson, but
by now you might be able to guess it anyway. The answer: we have to send
`DRAW:` to the contView!

On the Mac, drawing in a window normally takes place when a window is
**updated**. Drag the grDemo window to the bottom of the screen so part
of it runs off the screen. Release the mouse button. Now drag it back
near the center of the screen. For everything in the window to be
visible again requires updating. When the Mac system recognizes that a
window has to be updated, it sends an **update event** to the
application which owns the window. You don't need to worry about the
details at this stage, but Mops catches this update event and sends a
`DRAW:` message to the window.

And this is how the contView gets the `DRAW:` message
that will cause all the views to be drawn. The `DRAW:`
method in the `Window+` class basically just sends
`DRAW:` to the contView. Easy!

## dWind

Continuing with the grDemo listing, straight after our definition of the
grWind class, we define our window, `dWind`, which is an
object of the class grWind we just defined.

A new definition, `\@DPARMS`, gets things ready for the
drawing of the graphics in the view `dPane`. This
definition is a shortcut that allows us to use one word to do work which
is needed for each of the four following definitions.

The first thing we have to do is erase whatever was in the view area
before, and then we have to draw a rectangle as a border around the
view, Now remember that the graphic drawing will be done as a result of
a `DRAW:` message being sent to `dPane`,
and that at this time the rectangle `tempRect` will have
been set to the border of the view. This makes our job easy --- we
simply write `clear: tempRect draw: tempRect`.

The other task for `\@DPARMS` is to fetch the current
readings of each control.

The words of the four following definitions should look familiar. The
definitions are extensions of the spiral, spin, lj, and dragon curves
defined in Turtle. Here, however, they have been modified to fetch three
control parameters, place those numbers as ivars of the drawing device
(the pen or poly, as the case may be), and draw the graphics
accordingly.

You will notice that instead of using `:` and
`;` in these definitions, we have used
`:a` and `;a`. We did this because these
words are action handlers --- their addresses will later be stored
in a Menu object, to define the actions that are to take place when the
user makes a menu selection. We will see in a later section when
discussing modules that action handlers in modules need to be declared
with `:a` and `;a`. This is not strictly
necessary in the main dictionary, where we are now, but it does no harm
either. It is therefore a good idea to always use :a and ;a for action
handlers, as it will make your programs clearer and also make it easier
for you if you later move code into modules.

Because each of the drawing types has a different range of parameters,
the !ranges definition lets us set the maximum number for each control,
depending on which graphics type we select from the menu. The minimum
values are always one. (We will discuss controls in more detail
shortly).

In the next three lines of code, the text of the message that appears on
the screen in response to the 'About Curves' menu items is assigned to
two string constants, AB1 and AB2. Following that come three program
lines that define what is to happen when that selection is made. It
selects the font Times in 14-point (Times has font number 20), positions
the cursor at point 28,40, and 'types' the two strings on the screen.
It then calls the word `WaitClick`, which will just wait
for the user to click the mouse or type a key. Then it sends an
`UPDATE:` message to `dWind` to cause it
to redraw itself, erasing the text we 'typed'.

Next, both the pen `Bic` and the polygon
`Anna` are told where the center point of the graphics
rectangle is located. Importantly, the coordinates given are relative to
the top left corner of the view `dPane`, since that is
where the origin will be whenever `dPane` receives a
`DRAW:` message.

## Controls

In the Macintosh environment, a control is a screen object that responds
to interaction from the mouse in such a way that the mouse causes either
instant action or a change in function for a later operation. A good
example of the 'instant action' kind of control is the elevator knob
on the volume control in the Sound Control Panel. By adjusting the knob
with the mouse, you immediately adjust the volume of the sound played by
the Mac through its speaker.\<br /\> Likewise, when you click an 'OK'
button in a dialog box, you are working with a control for immediate
action. A 'delayed action' control would be something like the check
box inside a Get Info dialog window that locks or unlocks documents for
dragging to the trash. When you click the mouse pointer in an empty box,
an 'X' fills in the box, and the document is locked, but no particular
action occurs in response. Click the pointer again, and the X
disappears, so you can go ahead and trash the document.

In Mops, controls are View subclasses. Thus, they are sized and
positioned via the justification and bounds quantities we talked about
in the last lesson, and they are drawn when they get a
`DRAW:` message. But, as well as this, they have a number
of interactions with the Mac system.

A scroll bar is one of the most common kind of control. It consists of
five parts, each of which responds differently in the course of a
program.\<br /\> The five parts are:

1. Up arrow
2. Page Up region
3. Thumb
4. Page Down region
5. Down arrow

Each region is programmed to respond as needed.

Like many objects that the Macintosh Toolbox predefines, controls have
specific identification numbers, called **control definition IDs**,
which tell the Mac what function the control is to play and how it is to
look.

The four standard control types and their definitions IDs
are:

| Control Type    | ID |
| :---------------| --:|
|  simple button  |   0|
|  check box      |   1|
|  radio button   |   2|
|  scroll bar     |  16|

> **Carbon NOTE:** In Carbon creating a control element
>with its Control Definition ID is "NOT Recommended". So control
>definition ID is not used in Carbon PowerMops. Further, note that
>Control Definition ID ('CDEF') is different from Control ID that is a
>data structure in Carbon.

All controls also need to specify actions based on their interaction
with the mouse. Scroll bars, with their five distinct parts, need
separate actions specified for each part. An action is nothing more than
a set of instructions to follow when a control part is activated by the
mouse. In a Mops program, the actions, or rather the addresses of the
action definitions, are stored as instance variables of a control
object. Moreover, each control part has a distinct ID number so the
Toolbox knows to link a given action with a given mouse interaction.

The IDs for all Macintosh predefined controls are:

| Action                       | id |
| :--------------------------- | --:|
| simple button                | 10 |
| check box or radio button    | 11 |
| scroll bar Up arrow          | 20 |
| scroll bar Down arrow        | 21 |
| scroll bar Page Up region    | 22 |
| scroll bar Page Down region  | 23 |
| scroll bar Thumb             | 129|

## GrDemo Controls

The special scroll bar controls in grDemo inherit their instance
variables from the superclasses `View` and
`Control` (68k Mops) or `ROOTCTL`
(PowerMops). The list of available ivars includes an integer for the
definition ID (not in PowerMops), an X-array for the addresses of a
scroll bar's five possible actions, and an Ordered-col for the
actions' corresponding part numbers.

Whenever a `VScroll` object is created, its
`CLASSINIT:` method automatically makes it a scroll bar
by putting the control ID number 16 into its ID ivar in 68k Mops. The
method also places null values in each of the object's actions. When it
receives a `NEW:` message, which all views do when they
are to display themselves, it makes the appropriate call to the system
to cause itself to appear. It also makes this call whenever it gets a
`DRAW:` message. The definition for the
`VScroll` class is in the file 6Ctl (68k Mops) or zCtl
(PowerMops) in the Toolbox Classes folder.

## Scroll Bar Actions

Continuing down the demo program, the list of 5 definitions are the
actions that occur when you click each part of each scroll bar. The
formats for each action handler definition is much like the other except
for the amount of increment. A key element of these definitions,
however, is that they call upon a special Mops construction using the
value `ThisCTL`.

`ThisCTL` essentially tracks the address of the most
recently activated control. Therefore, if you click the PageUp part of
the second of our three scroll bars, `thisCTL` remembers
that it was the second scroll bar you activated. In the action handler
definition, then, `get: [ thisCTL ]` fetches the
previous value of the second scroll bar. The object of the
`get:` method is determined dynamically at runtime, a
technique explained in [ Part II ](Reference_4#Late_Binding)
as **late-binding**. After the value of the second scroll bar is
decremented by 10, a `put: [ thisCTL ]` stores the
value in the second scroll bar's ivar before sending the update message
to the window. The importance of this late-binding mechanism is that it
eliminates the need for us to define five action handlers for each
scroll bar or to concoct some algorithm to keep all that code to a
minimum. `ThisCtl` allows us full control flexibility
with a minimum of code.

The `doThumb` definition is a special one that
automatically calculates a value based on the relative position of the
thumb along the range of the scroll bar. The `doPgUp` and
`doPgDn` increment and decrement (respectively) the value
of the scroll bar by 10. And the `doLnUp` and
`doLnDn` adjust the figure by one in their respective
directions.

In the line after the action handler definitions, the address of the
`lj` definition (the one that draws Lissajous figures) is
plugged into dwind as the type of graphic that gets drawn when grDemo
first fires up. The notation `' `(tick) returns an
**execution token**, or xt, a quantity which can be saved and used later
to execute the word. In this case, the xt of `lj`, which
was defined a bit earlier in this program, is passed as a parameter in
the `setdraw: dwind` message. Checking at dwind's class
definition, we find that the `setdraw:` method stores the
xt of a graphics routine (`lj`, `spin`,
etc.) in the draw ivar of `dwind`. This will all come
together at the end of the program.

A small digression: in Mops, as in many Forths, this execution token is
actually the address of the compiled, executable code for the word.
However this isn't true of all Forths, and so the new ANSI standard now
uses the more general term 'execution token'.

Next, the xts of the five control actions are stored in each scroll
bar's actions ivars. The syntax here, `xts{ ... }` is a
shortcut for entering the xt of each action handler word. Addresses for
each definition are passed as parameters to the scroll bars' actions
ivars.
