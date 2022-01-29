---
title: FAQ
layout: default
---
Building a Turtle Graphics Program
==================================

Now we can look at a graphics program, called Turtle. It defines a
number of complex graphics curves and a way we'll be able to create a
mini-Logo language out of several definitions in the program. We'll
also have some more opportunity to use Toolbox calls. The source file is
called 'Turtle', and is in 'Demo folder'.

Here's the whole thing first. We'll then go through it in detail.

```bash
`\ Turtle Graphics Objects for Demo`

`need   sin`

`decimal`

`\ Class PEN defines a turtle-graphics pen.`

`syscall GetPenState`\
`syscall SetPenState`\
`syscall Line`\
`syscall LineTo`

`:class PEN     super{ object }`

`68k_record{                    \ These first 5 ivars comprise a PenState structure`\
`       point   PnLoc           \ location of pen`\
`       point   PnSize          \ width, height`\
`       int     PnMode`\
`       var     PnPatLo`\
`       var     PnPatHi`\
`}`\
`       angle   Direction`\
`       point   homeLoc`\
`       int     maxReps`\
`       int     initLen`\
`       int     deltaLen        \ change in len`\
`       int     deltaDeg        \ change in angle`

`:m GET:    ^base GetPenState ;m                \ Save state here`\
`:m SET:    ^base SetPenState ;m                \ Restore from here`

`:m TURN: ( deg -- )    +: direction ;m`

`:m UP: 90 put: direction ;m`

`:m MOVETO:     \ ( x y -- )    Draws a line to x,y if pen shows`\
`       set: self LineTo get: self ;m`

`:m MOVE: { dist -- }   \ Draws dist bits in current direction`\
`       set: self cos: direction dist * 10000 /`\
`       sin: direction dist * 10000 /   negate`\
`       Line get: self ;m`

`:m GOTO:       \ ( x y -- )    Goes to a location without drawing`\
`       put: PnLoc ;m`

`:m CENTER:     \ ( x y -- )    Sets the center coordinates`\
`       put: homeLoc ;m`

`:m HOME:       \ ( -- )                Places pen in center of Mops window`\
`       get: homeLoc goto: self   ;m`

`:m SIZE:       \ ( w h -- )    Sets size in pixels of drawing pen`\
`       put: PnSize ;m`

`:m INIT:       \ ( x y w h mode -- )`\
`       put: PnMode put: PnSize   put: PnLoc ;m`

`:m PUTRANGE:   \ ( initlen dLen dDeg -- )      Sets parameters`\
`       put: deltaDeg put: deltaLen put: initLen ;m`

`:m PUTMAX:   ( maxReps -- )    put: maxReps ;m`

`:m CLASSINIT:   get: self   200 put: maxReps ;m`

`:m SPIRAL: { \ dist degrees delta reps -- }`\
`               \ Draws a spiral of line segments - Logo POLYSPI`\
`       home: self`\
`       get: initLen -> dist get: deltaLen -> delta`\
`       get: deltaDeg -> degrees   0 -> reps`\
`       BEGIN   1 ++> reps reps get: maxReps <`\
`       WHILE   dist move: self   degrees turn: self`\
`               delta ++> dist`\
`       REPEAT ;m`

`:m DRAGON:     \ ( n -- )   Dragon curves from Martin Gardner`\
`       dup`\
`       NIF     get: deltaLen move: self drop`\
`       ELSE    dup 0>`\
`               IF      dup 1- dragon: self`\
`                       get: deltadeg turn: self`\
`                       1 swap -   dragon: self`\
`               ELSE`\
`                       -1 over -   dragon: self`\
`                       360 get: deltadeg - turn: self`\
`                       1+ dragon: self`\
`               THEN`\
`       THEN ;m`

`:m LJ: { \ reps -- }   \ Draws an infinite Lissajous figure`\
`       up: self   0 -> reps`\
`       get: initLen get: direction * cos 120 /         getX: homeLoc +`\
`       get: deltalen get: direction * sin 120 / negate getY: homeLoc +`\
`       goto: self`\
`       BEGIN   1 ++> reps reps get: maxReps <`\
`       WHILE`\
`               get: initLen get: direction * cos 120 / getX: homeLoc +`\
`               get: deltaLen get: direction * sin 120 / negate`\
`               getY: homeLoc +   moveTo: self`\
`               get: deltaDeg turn: self`\
`       REPEAT ;m`\
`;class`

`\ Define a Smalltalk Polygon object as subclass of Pen`

`:class POLY super{ pen }`

`       int     Sides                   \ # of sides in the Polygon`\
`       int     Length                  \ Length of each side`

`:m DRAW: { \ turnAngle -- }`\
`       360 get: sides /   -> turnAngle`\
`       get: sides 0`\
`       DO      get: length move: self`\
`               turnAngle turn: self`\
`       LOOP ;m`

`:m SIZE:       \ ( len #sides -- )     Stores sides and goes to Home`\
`       get: self put: sides put: length`\
`       home: self   up: self ;m`

`:m SPIN: { \ reps -- }         \ Spins a series of polygons around a point`\
`       home: self 10 get: initLen size: self`\
`       0 -> reps`\
`       BEGIN   reps get: maxReps <`\
`       WHILE   draw: self get: deltaDeg turn: self`\
`               get: deltaLen +: length 1 ++> reps`\
`       REPEAT ;m`

`:m CLASSINIT:          \ Default Poly is 30-dot triangle`\
`       30 3 size: self 100 put: maxReps ;m`

`;class`

`\ Create a pen named Bic`\
`Pen    BIC`

`\ Create a Polygon named Anna`\
`Poly   ANNA`\
`60 4 size: Anna`\
```

We'll now look at this program in detail.

`need sin`

This statement ensures that the Sin file is loaded before this one. In
this file we will make use of the Angle class we defined in the file Sin
(described in the previous lesson).

The program in this file begins with a declaration that all numbers to
follow will be in decimal.

`decimal`

This ensures that all numbers to follow will be in decimal, just in case
a different number base was current before. Incidentally, you can place
different portions of your program in differ-ent number bases, but you
may have less difficulty remem-bering what number base you're in if you
stay in decimal and precede any hex number with a dollar sign and a
space (e.g., \$ AE9F).

`syscall GetPenState`\
`syscall SetPenState`\
`syscall Line`\
`syscall LineTo`

GetPenState, SetPenState, Line and LineTo are Mac Toolbox calls. We
don't want to include information about every possible Toolbox call in
your Mops program, since there are so many, but we do need information
about the ones you actually use. The word 'syscall' tells the Mops
system that you are going to be using the Toolbox calls whose name you
put after 'syscall', and includes the information that Mops needs to
compile the calls correctly.

Here are the important things you need to know about syscall:

1.  You have to use syscall for any Toolbox call you're going to make,
    you have to do it outside any definition, and before any definition
    in which you do the call. It doesn't matter if you use syscall
    several times over for the one call --- in different source
    files, say --- subsequent ones will be ignored. In fact, three
    of these syscalls are already defined in the QD (QuickDraw) file.
    However by putting them all here, there's no penalty, and if we
    ever change QD the code here will still work.
2.  The names following syscall are **case sensitive**, this is the one
    place in Mops where case matters. This is forced on us by the way
    Apple handles its Toolbox calls on PowerMacs. So for example, if we
    had put\<br\> `syscall getpenstate`\<br\>above, we
    would have received a compile-time error message telling us that
    Mops couldn't find the name.
3.  Not all Toolbox routines mentioned in Inside Macintosh are
    accessible to Mops. This is because some of them are not actually
    built into the MacOS, but are provided by MPW, CodeWarrior, or other
    compiler. If there is no MacOS code corresponding to a Toolbox
    routine name that you find in Inside Macintosh, Mops will generate a
    compile-time error message.

If you have been using an old version of Mops (pre-2.7), you would have
been using an old way of doing Toolbox calls. This required you to push
an initial zero on the stack if the call returned a result, and to use
words such as word0 and pack to convert parameters from 32 to 16 bits if
necessary. Thankfully, those complexities are now gone. Mops looks up
the information that Apple provides for Toolbox calls, and makes all the
necessary adjustments behind the scenes. This was something we had to do
for the PowerPC in any case, since the lengths of parameters can be
different.

```bash
`:class PEN super{ object }`\
`...`\
```

This is the beginning of the definition of a major class for this
program, the one that defines the characteristics of a pen that draws on
the Mac screen. We should point out that by defining a drawing pen in
Mops' object-oriented environment, you can have more than one pen
drawing object in a given section of the screen (e.g., a window). The
Mac Toolbox on its own does not give you this power. Consider it an
added bonus of using an object-oriented language such as Mops. As you
can see, there are many instance variables for this class. Some are
points, some are integers, a couple are variables, and one is an angle
as defined in the class Angle (from the previous lesson).

As the comment indicates, the first five instance variables are the
components of a Macintosh Toolbox data structure, a PenState. This is
the structure required by the calls GetPenState and SetPenState, just as
FrameRect required a Rect ([lesson
5](Lesson_5#Defining_a_Class)). For details on what the
PenState variables are, Inside Macintosh's Quickdraw chapter is the
best source. There you learn that a PenState contains four variables,
called pnLoc (a coordinate point), pnSize (a coordinate point indicating
the number of pixels wide and high --- from coordinate 0,0 ---
the pen is), pnMode (an integer), and pnPat (an 8-byte representation of
the pen pattern discussed fully in Inside Macintosh). Corresponding
variables are set up in this class so that any object created from this
class will have those parameters stored in the right place and in the
right order.

Since this is a Toolbox structure, we have to declare it as a
68k\_record, as we discussed in [lesson
5](Lesson_5#Defining_a_Class). Ivars declared within records
have no extra Mops housekeeping information between them, and this is
what Toolbox structures require.

The reason PnPat is divided is because the largest basic data structure
readily available from the predefined data structure classes is 4 bytes
wide: the VAR. What we can do then, is break up the 8-byte pnPat
variable into two 4-byte chunks, called PnPatLo and PnPatHi, with
PnPatHi holding the leftmost byte values.

The remaining instance variables will be used for other purposes in the
methods definitions of this class. If you were building this class from
scratch, you would probably be inserting new instance variables in this
list as you find need for them while defining methods.

The remaining instance variables will be used for other purposes in the
methods definitions of this class. If you were building this class from
scratch, you would probably be inserting new instance variables in this
list as you find need for them while defining methods.

```bash
`:m GET:    ^base GetPenState ;m                \ Save state here`\
`:m SET:    ^base SetPenState ;m                \ Restore from here`\
```

These two methods will be used frequently whenever an object of this
class draws something on the screen. The first, GET:, copies the values
of the Pen State variables from the Macintosh Toolbox to the ivars of an
object. It's like taking a snapshot of the parameters at a given
moment. Thus, after you move the pen to point x,y, a GET: saves the
PenState conditions in an object's memory space. Later, when it comes
time to pick up where you left off, you can SET: the parameters, which
copies them from the object's memory to the Toolbox.

With the PenState variables saved within an object's 'private data,'
other objects can use the same Toolbox routines without destroy in the
parameters of the first object. For example, if you tell the Toolbox to
position the class Pen object named Scripto1 at coordinate 1,1, and then
save those coordinates in Scripto1's data area, you are then free to
instruct the Toolbox to position Scripto2 at 100,120, without affecting
the data in Scripto1. Later, when you need to work with Scripto1, the
SET: command reminds the Toolbox where Scripto1's position was the last
time.

```bash
`:m TURN:             ( deg -- )    +: direction ;m`\
`&#133;`\
`&#133;`\
```

The next twelve methods are responsible for manipulating the parameters
that affect any object of this class. For example, TURN: increments the
angle value stored in an object's Direction ivar (+: Direction) by the
number of degrees passed to it in a message, like

`30 turn: Scripto1`

The Direction ivar is used by sin: and cos: methods from the last
lesson. These correctly handle degree values of greater than 359
degrees, or less than 0 degrees. For this reason, TURN: does not concern
itself with whether the new Direction is in the range 0 - 359 degrees.

UP: (line 35) simply places a 90 in the data cell of an object's
Direction ivar. This is consistent with the notation of the last chapter
where the up position is 90 degrees. This will be used in a positioning
message later to reset the orientation of objects drawn with a pen
object from this class.

In the MOVETO: method, we see the LineTo Toolbox call. The LineTo
Quick-Draw procedure, as noted in **Inside Macintosh**, draws a line
from the current pen location (the one set in the Toolbox by the set:
self operation) to the coordinate specified in the two parameters. As
soon as the drawing is completed, the new pen state is saved in the
object's memory (get: self).

The MOVE: method present another kind of line drawing. This time the
location of the destination point is determined by the length (in
pixels) and the direction (as retrieved from the Direction ivar). This
method uses a named input parameter, Dist, because it will be much more
convenient to recall the value for each of the two calculations that
will be performed on it in this method. Notice that this method makes
use of the sin: and cos: methods defined in the Sin program earlier.
That means that Sin must be loaded into Mops **before** Turtle. The
statement need Sin on line 3 ensures this.

The operations in MOVE: should now be familiar to you. The current pen
state is copied from the object's ivar to the Toolbox. Then the sine of
the current direction (the object's Direction ivar is the source of the
information) is multiplied by the distance in pixels, and then divided
by 10,000 (remember, sin's values have been multiplied by 10,000 for
ease of handling) to obtain the x-coordinate for the destination point
(which remains on the stack). The y-coordinate is calculated by the
operations in line 37. Finally, the two coordinates are packed into one
cell and sent to the QuickDraw routine, Line, which draws the new line.
After the drawing is completed, the pen state is saved in the object's
memory (get: self).

The next four methods, GOTO:, CENTER:, HOME:, and SIZE: should be
largely self-explanatory. All of them but HOME: place new values into
specific ivars, including one that affects some values of the pen state.
HOME: simply retrieves the most recent value stored via the CENTER:
method, and moves a pen class object to that location. The values you
pass to CENTER: depend on the size of the displaying window, because
coordinates are relative to the upper left corner of a window, no matter
where it appears on the screen. (For comparison, the smallest Mac screen
is 512 pixels horizontally by 342 vertically.)

INIT: (line 57) allows an object to respecify up to three pen state
parameters (mode, size, and location) by way of a single message. All
parameters must be sent with the message, even if only one of them is to
be changed.

The method PUTRANGE: places values into an object's ivar slots that
will be used as parameters for some fancy graphics later in the program.
The names stand for a change (delta) in degrees, a change in length, and
an initial length.

PUTMAX: is the method that allows you to set a value for the maximum
number of repetitions some of the graphics images should make. The
effect of the parameter will become more apparent when we get to the
figures themselves.

Then comes the now familiar CLASSINIT: method is performed when an
object of this class is created. It first saves a copy of the current
pen state parameters (the ones the Toolbox starts up with) from the
Toolbox into an object's first five ivars (get: self). Finally, the
maxReps ivar for the object is set to 200.

```bash
`:m SPIRAL: { \ dist degrees delta reps -- }`\
`&#133;`

`:m DRAGON:     \ ( n -- )   Dragon curves from Martin Gardner`\
`&#133;`

`:m LJ: { \ reps -- }   \ Draws an infinite Lissajous figure`\
`&#133;`\
```

These three methods are largely Mops versions of math calculations for
three types of graphics images: spirals, dragon curves, and Lissajous
(pronounced *Lih-sah-zhoo*) figures. It's not important for our
discussion here to understand the inner workings of these graphic
routines. You can, of course, trace the processes yourself, if you like.

We do, however, want to call your attention to the application of local
variables in SPIRAL: (and in LJ:). The backslash inside the curly
brackets signifies that these names are local variables, rather than
named input parameters (see MOVE: above). As noted in an earlier lesson,
the local variable names are used strictly inside a definition, and have
no relation to named input parameters in the same definition.

The SPIRAL: method declares four local variable names: dist, degrees,
delta and reps.

`home: self`

moves the pen to the center of the current drawing window.

`get: initLen -> dist get: deltaLen -> delta`

Dist and delta are given values by first fetching values from two of the
object's ivars, initLen and deltaLen, and then storing the values in
their respective local variables (via -> operations).

`get: deltaDeg -> degrees 0 -> reps`

Here the third local variable, degrees, gets its value after the
deltaDeg ivar value is fetched from the object's memory. Reps is
initialized to zero, and will be used as a counter to compare to
maxReps. Once these local variables have values stored in them, they can
be used throughout that method for whatever calculations are desired, as
shown in the following lines:

`BEGIN  1 ++> reps reps get: maxReps <`\
`WHILE  dist move: self   degrees turn: self`\
`       delta ++> dist`\
`REPEAT ;m`

Without local variables, you would have to arrange for a significant
amount of stack manipulation to keep the right values in the right
places for calculation. It also simplifies your job of converting
complex formulas into Mops, since you can construct your methods using
familiar value names in your operations.

This means, of course, that the program will have to load values into
initLen, deltaLen, and deltaDeg before a SPIRAL: selector message can be
sent. But that's why PUTRANGE: was defined earlier.

```bash
`;class`\
```

ends the definition of class Pen.

```bash
`\ Define a Smalltalk Polygon object as subclass of Pen`

`:class POLY super{ pen }`\
`&#133;`\
```

This next section is another class definition. This class, Poly, is a
subclass of Pen, so it inherits the methods and ivars of Pen. Therefore,
if you create an object of the class Poly, you can still issue messages
with selectors like MOVE: and HOME:.

```bash
`int    Sides           \ # of sides in the Polygon`\
`int    Length          \ Length of each side  `\
```

Class Poly has two additional instance variables, both of them integers.
When you create an object of this class, the extra ivars are added to
the list of ivars inherited from class Pen. One ivar is for the number
of sides of a polygon object created from this class. The other is the
length (in pixels) of each side (all sides are of equal length).

```bash
`:m DRAW: { \ turnAngle -- }`\
`       360 get: sides /   -> turnAngle`\
`       get: sides 0`\
`       DO      get: length move: self`\
`               turnAngle turn: self`\
`       LOOP ;m`\
```

This method is an extension of the MOVE: and TURN: methods defined in
class Pen. First the angle of the turn is calculated by dividing 360 by
the number of sides, and is saved in the local variable turnAngle. DRAW:
then sets up a DO\...LOOP that performs the actual polygon drawing.
Using the Sides ivar as the limit for the loop, one side is drawn (GET:
Length MOVE: Self). Then the direction is changed by the amount of
turnAngle. This draw\...turn action is repeated until the index equals
the limit of the loop.

```bash
`:m SIZE:       \ ( len #sides -- )     Stores sides and goes to Home`\
`       get: self put: sides put: length`\
`       home: self   up: self ;m`\
```

SIZE: is redefined for this subclass. It takes two parameters: the
length of each side and the number of sides for the polygon. GET: Self
copies the current pen state into an object's PenState ivars when you
specify the size of a new Poly object (SIZE: will be the first selector
You'll send to a new poly object, and it needs the PenState variables
in its ivars right away). The size parameters are stored in their
respective instance variables, Sides and Length. This method also
positions an object to the home position (as defined by the HOME: method
in class Pen) and orients it facing to the top of the screen (from the
UP: method also in class Pen).

```bash
`:m SPIN: { \ reps -- } \ Spins a series of polygons around a point`\
`       home: self 10 get: initLen size: self`\
`       0 -> reps`\
`       BEGIN   reps get: maxReps <`\
`       WHILE   draw: self get: deltaDeg turn: self`\
`               get: deltaLen +: length 1 ++> reps`\
`       REPEAT ;m`\
```

The SPIN: method is a routine that draws a sequence of polygons around a
center point to make them look as if they are spinning. Notice that this
method has one local variable, reps, which is used as a counter for the
number of repetitions through the BEGIN\...WHILE\...REPEAT loop.

```bash
` :m CLASSINIT: \ Default Poly is 30-dot triangle`\
`       30 3 size: self 100 put: maxReps ;m`\
```

Finally, the default settings for an object of class Poly are set by
CLASSINIT:. Unless otherwise specified, a Poly object will be a polygon
with 3 sides, each 30 pixels long. This method also sets the ivar,
maxReps, to 100.

```bash
`\ Create a pen named Bic`\
`Pen    BIC`

`\ Create a Polygon named Anna`\
`Poly   ANNA`\
`60 4 size: Anna`\
```

These are two examples of objects ceated from the classes just defined.
The first, Bic, is an object of class Pen. Anna is an object of class
Poly. In the last line, Anna is changed from its default 30-pixel
triangle to a square (4 sides) of 60 pixels on a side.

Experimenting With Turtle
-------------------------

Now that you have an understanding of the inner workings of the Turtle
program, it's time to play around with it. We'll start you off with
some ideas of things you can do by creating some objects, defining new
Mops words, defining new subclasses and even modifying the existing
methods to do some tricks. The more you play with Mops, the quicker you
will become comfortable with all its powers.

First, you must load the file Turtle. Load it by either selecting the
Load command from the File menu, or typing the 'slash-slash' command,
as in

`// turtle`

As the file loads, you will see messages as each component file is
loaded; you may see occasional messages when words are redefined or if
an object name is being reused (is not unique). This will happen if TRUE
has been put in the global value WARNINGS?

`TRUE -> warnings?`

Normally this value is set to FALSE, so warnings are not displayed.

> Note: A value 'WARNINGS?' was gone in PowerMops.

Once the files are loaded, you might want to see what Lissajous figures
are. Use the Bic pen object as your drawing device. If you look closely
at the methods definition for LJ:, You'll see that it needs values in
several ivars of Bic for it to function: initLen, deltaLen, deltaDeg,
and homeLoc (it also needs maxReps, but that value is set at 200 by
CLASSINIT:). For convenience sake, define a Mops word, 'lj,' that a)
takes three input parameters and assigns them to the first three ivars
(an operation that is performed by method PUTRANGE:), b) puts the
homeLocation in the center of the screen (performed by method CENTER:),
and c) draws the Lissajous figures (method LJ:). Here's one way to do
it:

```bash
: lj  cls  putrange: bic
            250 160 center: bic
            lj: bic   cr   ;
```

Try typing in various three integer combinations (e.g., 9 11 301 lj )
and watch the variety of curves that are drawn. Try 2 2 2 lj, and
You'll notice that the cursor prints on the screen at the last instant
before the cr brings the prompt over to the left margin. To eliminate
this, you need to turn off the cursor with the Mops word
`-curs` (the opposite, `+curs`, turns the
cursor back on).

Now, define a new word that turns the cursor off before doing the
Lissajous figures, and turns it on when the drawing is completed:

```bash
`: cleanlj -curs lj +curs ;`\
```

> A Tip: Since PowerMops uses MLTE (Multi-Lingual
> Text Engine), Graphics drawn on PowerMops console will be a bit dirty.
> When you try the experiments in this section on PowerMops, you can use,
> instead, a Test window as the screen. First, execute: `Window ww
> Test: ww` Then resize the test window up to about 512*512. Then
> execute Graphic words, lj, creanlj etc. from QuickEdit (When you ENTER a
> command on a QuickEdit window, an Apple event is sent to PowerMops and
> the command will be executed in PowerMops).

On some integer combinations, the number of repetitions may not be
sufficient for the Lissajous figures to complete their drawing (or
before they start retracing previous steps). For example, try 12 1 1949.
To increase the number of repetitions, you can send a PUTMAX: message to
Bic to change its maxReps ivar.

`1000 putmax: bic`

Now Let's experiment with the Anna object. Right now, it is a square of
60 pixels on a side. Put the coordinates for the center of the screen in
Anna's homeLoc ivar by sending a message with the CENTER: selector:

`250 160 center: Anna`

Now, move Anna's PnLoc to the center with this message:

`home: Anna`

Draw Anna. The square appears on the screen. Now clear the screen
(`CLS`) and resize Anna so the object has 8 sides, each
20 pixels long and draw the object:

`20 8 size: Anna`\
`draw: Anna`

In both drawings, the presence of the cursor and Mops prompt really
messed things up. Therefore, define a Mops word that:

-   clears the screen
-   turns the cursor off
-   draws Anna
-   brings the prompt to the left margin
-   turns the cursor back on:

`: draw cls -curs draw: anna cr +curs ;`

------------------------------------------------------------------------

  ------------------------------------------- --------------------------------- -----------------------------------
  [Lesson 16](Lesson_16)           [Tutorial](Tutorial)   [Lesson 18](Lesson_18)
  [Documentation](Documentation)                                     
  ------------------------------------------- --------------------------------- -----------------------------------



