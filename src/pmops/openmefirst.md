---
title: Open Me First
layout: default
---

## Quick Start

The purpose of this file is to provide just the basic information you
need to experience a taste of the PowerMops Integrated Development
Environment. Also, if you scroll down far enough you will find a message
from Mike Hore, the creator of PowerMops, and release notes pertinent to
this version of PowerMops.

This file is not a tutorial on Forth or programming. Nor is it a
tutorial on Object Oriented Programming. These in-depth topics are
covered in the [full manual](/pmops/overview).

Don't worry if you make a typing mistake that deletes some of the text
from this file. You can always start over by reopening the 'Open Me
First" file because it is a read-only file.

## Let's Get Started

You should be reading this in **QuickEdit**, which is the source code text
editor for Mops. If you aren't, then close this file and re-launch it
from the Finder. Make sure it is opened with QuickEdit.

Next make sure PowerMops is running. You should see the PowerMops window
on the left side of your screen. This QuickEdit window will be on the
right side of your screen. Make sure the windows are positioned so you
can see them both at the same time. Some overlap is not a problem.

If you just type text and press `<return>` then QuickEdit simply behaves
as you would expect any text processor to behave. HOWEVER, part of the
true power of QuickEdit is that you can execute Mops code directly from
the editor! Here's how.

Place the cursor at the end of the following line and press `<enter>`
(If your keyboard does not have an enter then press `<shift-return>`).

```bash
cr ." Hello World!"
```

In the PowerMops window you should see the ubiquitous phrase. What
happened? When you pressed the `<enter>` key you executed the entire
line in which the blinking cursor resides. Had you hilited some text
instead, then JUST THAT HILITED TEXT would have been executed. This is
how you can easily execute multiple lines of text or just portions of
text. Try hiliting the following three lines, all three lines at the
same time, and executing them by pressing `<enter>`:

```bash
cr ." Now is the time"
cr ." for all good people"
cr ." to come to the aid of their country."
```

Now go back and hilite just ' ." for all good people" ' (be sure to
include the ." and the ending ") in the second of the three lines
above. Do not hilite the 'cr' at the beginning of the line. Press
`<enter>`.

You will notice that the text was added to the existing text in the Mops
window without moving to the next line. This happened because we omitted
the 'cr'.

Now place the cursor at the end of the next line and press `<enter>`.

`33 45 +`

Again, the output will appear in the Mops window. But this time the
output is numeric, so the result of adding 33 and 45 is left on the
stack (78). Note that the Mops window will display the contents of the
stack in the upper area of the Mops window. The depth of the stack is
also shown (in this case depth = 1). You can clear the stack by pressing
command-0. You can clear the contents of the Mops window by pressing
command-2. Try doing both now. (You can ignore the momentary flash of
"stack underflow").

Now let's try something a little more interesting. Execute the
following line:

```bash
window w test: w
```

You will see that a new window has been created, its title is 'Test'.
This is actually a window "object" named 'w'. We won't talk much
about objects here except to mention that objects make programming with
Mops very easy and very powerful.

Now execute the following:

```bash
30 50 MoveTo  ." Hello World!"
```

You will see our 'Hello World!' displayed in your Test window.

Try clicking on your Test window. Notice that it behaves pretty much as
any window should. You can resize it, move it, and close it by clicking
in the red close button. Do so now (close it) and then return to this
window.

It should be mentioned here that you could type or copy/paste the code
that you executed directly into the PowerMops window. Pressing `<enter>`
in the PowerMops window behaves exactly as it does in the editor window.
It will execute either the entire line or just the hilited text. At
times you may find this way of using Mops preferable (we offer lots of
options!). Also, Mops will automatically "remember" any text, either
input or output, that is left in the Mops window. Mops will
automatically restore that text the next time you launch Mops.

Now for something a bit fancier. The following OpenGL demo will only
work if you are running OSX. If you are running OS 9 then skip on down
to the CurvesDemo.

PowerMops can be used to take full advantage of the OpenGL Framework
graphics package. Click on the following line and execute it by pressing
`<enter>`.

`// OpenGLDemo1`

You will see the PowerMops window indicate that it is loading some
files.

Then you will see a window in which a 3D Teapot is drawn. Try clicking
on the window and then pressing the following keys to activate some
action.

Space : switch between animation Start and Stop (a little complex rotation).
Return : Change the Object drawn ( among 8 models).
Tab : Change the Color of the object (red blue green).
b : Change Background color.

Click on the Window's content area

- when animation is stopped
  - you can drag the model with the mouse.
- when animation is running
  - you can change the animation speed.

When done click the close box of the OpenGL DEMO Window.

Here is a graphics demo that will work on either OS9 or OSX. Click on
the following line and execute it by pressing `<enter>`.

`// CurvesDemo`

Click on the "Curves" window that appears. Try different control
settings in the Curves window. Also try the four different kinds of
curves available from the Graphics menu. When done close the window.

Now, AT YOUR OPTION, you can have PowerMops direct textual output back
into the QuickEdit window. Using the mouse, click in the very lower left
corner of the QuickEdit window. A "C" should appear. This means the
QuickEdit window will now function as a Console window for Mops.

Let's try executing some of the same code as before to see what happens
when the editor window is set to Console mode:

Place the cursor at the end of the following line and press `<enter>`:

```bash
cr ." Hello World!"

33 45 + .
```

The output is redirected right back into the QuickEdit window! This can
be very handy for recording the results of an interactive programming
session. Also note that after executing some code the word "ok" will
be printed in the QuickEdit window to let you know that execution was
successfully completed. Often you may not want your source code "messed
up" like this. In those cases you should turn the Console mode off.
Click on the "C" in the lower left corner. You can still observe your
output in the Mops window.

This is the end of the Quick Start section. At this point you can stop
and do whatever you like, such as experimenting with Mops on your own,
or begin reading the manual, or whatever. If you want to read a message
from the creator of Mops, Mike Hore, then keep reading. Additionally, if
you want to read a summary of what is new with this version of PowerMops
then keep on reading after that.

## A Message from Mike Hore, the author of PowerMops

This is Mops 6.0, of June 2006.

This version only supports Power Macs. 68k Macs are supported by Mops
4.0.4, which is available via the [web site](https://sourceforge.net/projects/powermops/files/PowerMops/).

This version of the release is already fully built, so you can go right
ahead and run PowerMops. Normally you should never need to re-build
PowerMops from the basic 68k Mops nucleus, which is now not even
included with this distribution.

Especially, beginners should never need to do this. But if you should
need to for any reason, the instructions are at the start of the manual.

------------------------------------------------------------------------

You should have a folder called "PowerMops 6.0". In this folder there
should be three files and nine folders. The three files are this file
"Open Me First", and the demo files "OpenGLDemo1" and
"CurvesDemo". The folders are "CFM-32bit", "CFM-64bit",
"CocoaCalls Demo folder", "Demo folder", "MachO-32bit",
"MachO-64bit", "Mops Source", "OpenGLDemo folder", and "Quick
Edit ƒ".

The "release notes" information is contained below in this file and is
mainly aimed at current Mops users, and describes the main features of
this release that differ from previous releases.

"CFM-32bit" contains:

- The standard 32-bit PowerMops application (PowerMops).

"CFM-64bit" contains:

- The standard 64-bit PowerMops application (PowerMops). You must have a G4 or better processor to use this.

"Mops source" contains all the other Mops source files (of course!!)

The folder "Demo folder" contains the source for the Demo application
that is described in the Mops tutorial in the manual. I used to bundle
this with the manual, but I now think it's more logical in "Mops
source".

The folder "OpenGLDemoFolder" contains the source for Nao Sacrada's
OpenGL demo which runs under OSX.

The folder "CocoaCalls Demo folder" contains the source for Nao's
implementation of calls to Cocoa functions written in Objective-C.

"Quick Edit ƒ" contains Doug Hoffman's Quick Edit text editor which
communicates with Mops via Apple events, and related files.

If you don't alter the folder configuration as supplied, things should
work. Likewise you shouldn't have any problem if you put everything, as
is, into a containing folder. However if you do want to change the
configuration more significantly, you will need to edit the file
"Mops.paths" in the "Mops ƒ" folder - this defines the HFS paths
that Mops will use to look for files.

----

If you need floating point, fire up PowerMops and type

`// zfloating point`

Yes, that's "floating point" with a z in front.

## Documentation

Documentation for freeware products sometimes struggles :-)

Mops is no exception, however community input is welcome!

The online manual contains a step-by-step tutorial for Mops
beginners.

------------------------------------------------------------------------

So, good luck, and if you're already a Mops user, please read the
release notes to find out all about the new features.

As always, I hope you enjoy Mops/PowerMops!

------------------------------------------------------------------------

|                 |                                       |
|:----------------|---------------------------------------|
|Mike Hore        | email:          mike_hore@aapt.net.au |
|                 |                                       |
|Mops web page:   | [http://www.powermops.org](http://www.powermops.org/) |
|SourceForge project page: | [http://sourceforge.net/projects/powermops](http://sourceforge.net/projects/powermops/) |
|                 |                                       |           `
|Darwin, Northern Territory, Australia. |  |

## Mops 6.0 RELEASE NOTES

Here is the usual "release notes" describing the changes from the
previous Mops versions, so that those already using it don't have to
wade through all the documentation.

The date of this release is June 2006. If you've received it more than
three months later, it might be an idea to check the Web site to see if
there's a later version.

The big changes from the previous version (5.6) are:

- 64-bit arithmetic is supported.
- Mach-O executable format is supported.

### 64-bit support

To use the 64-bit features, you obviously must be running on a 64-bit
machine -- basically a PowerPC G5. To access the features, simply fire
up one of the 64-bit versions -- either PEF (the "traditional" MacOS
format) or Mach-O.

Stack cells are 64 bits wide in these versions. All arithmetic is done
with 64-bit instructions. The number input and output instructions all
handle the 64-bit stack cells.

The following new words and classes are added:

```bash
z@  ( addr -- n )      Fetches 64-bit value at address.
z!  ( n addr -- )      Stores 64-bit n at address.

zValue  ( n --  :  name )  A 64-bit value.  The word Value
remains at 32 bits, but sign-extends when fetched.

uValue  ( n --  :  name )  "Unsigned value".  A 32-bit value,
which zero-extends when fetched.

Class Var, similarly to Value, remains at 32-bits but
sign-extends when fetched.  The expected two new classes
are added:

zVar       64-bit version of Var.
uVar       Unsigned 32-bit version of Var.
```

The shifts `<<` `>>` and `a>>` work on full stack cells, and so are
64-bit operations in these versions. If you need a specifically 32-bit
shift, use `h<<` `h>>` and `ha>>` ("h" for half-length). These
operations CLEAR the high 32 bits.

In the 32-bit versions `h<<` etc are also defined, but are the same as
`<<` etc. This way you can avoid conditional compilation if you are
writing bit-twiddling code that needs to run in both 64- and 32-bit
versions.

However, you will probably have some other situations where your code
has to be sensitive to stack cell size. A constant 64bit? is defined,
which is set true in the 64-bit versions and false in the 32-bit
versions. You can use this constant for conditional compilation, e.g.

`: fetch_whatever  ( addr -- n )`
`   [ 64bit? ] [if]  z@  [else]  @  [then]  ;`

There are plenty of more sensible examples in the code generator itself
-- the source code is in the "PPC source" folder.

### Mach-O support

To use the Mach-O executable format, you must be running under OSX.
Then, simply fire up one of the Mach-O versions -- either the 32- or
64-bit version. When you install an application, it will be in Mach-O
format.

Running under Mach-O is basically the same as running under CFM (Code
Fragment Manager, the "traditional" format for MacOS code). The
changes are mainly at a very low level, and we have tried to make them
transparent to anyone writing "normal" programs. The main changes
involve the detailed implementation of callbacks (from the system to
your code), but they don't change the Mops syntax in any way.

## A note about Intel Macs

Since these are now with us, and PowerMops generates PowerPC machine
code, inevitably the question is going to come up as to whether native
code on Intel Macs will be supported.

No, it won't. PowerMops will run as it always has, under Rosetta (which
allows PowerPC code to run on Intel Macs), but to run natively the code
generator would need to be rewritten to target the Intel architecture.
This could be done, since it's written in Mops, but would take a lot of
time. Adaptation to another RISC-style architecture could be done in a
fairly straightforward way. The Intel architecture, however, is
basically early-1980s vintage and is CISC, not RISC. Adaptation would
be, let's say, exciting and challenging. And take even more time A LOT
of time. It's not time that I have any enthusiasm whatever for putting
in, especially as I strongly dislike the Intel architecture.

So, if anyone wants to volunteer for this, you're very welcome, and
I'll be the first to cheer you on!

------------------------------------------------------------------------

The remainder of these release notes are taken from earlier 5.x
releases, so if you're upgrading from a much earlier version you can
see what changes have been made.

## Mops 5.6 RELEASE NOTES

Mops 5.6 added several new features to Mops 5.5. These are largely due
to Nao Sacrada and Doug Hoffman, to whom we're all indebted for a great
job.

Here's a summary, then the details, where needed, are below.

-   Under OSX, you can now directly call routines which are part
of Cocoa and written in Objective-C.
-   The Navigation Manager support has been updated. See below for
the documentation.
-   Menus have been updated for the new NIB-based Carbon API.
-   New syntactic features -- cascaded messages and right arrow
syntax.
-   A new value, OSX? which is true if we're running under OSX.
-   A new operator LEADING_ZEROS has been added.
-   A code generation problem has been fixed, in which you could
get an internal dump caused by register allocation running out of
registers, in compiling complicated code with many conditionals.

-   You can now late-bind in interpretation mode -- this had
inadvertently been unimplemented!

-   Class Window now has a new public ivar, windowClass. This
is set to kDocumentWindowClass at classinit: time, and is used to set
the window class at new: time. You can use it to set the window class to
whatever you like before you do new:.

## Objective-C calls

Note: this is NOT an implementation of Objective-C language faculties.
It merely makes it possible to link to Objective-C classes and methods
already implemented and compiled into libraries, which means we can't
define a new Objective-C (sub)class or its methods.

For a working demo, see the CocoaCalls Demo folder" in "Mops source".
The ReadMe file there describes how to use it to create an instant web
browser!

You set up Objective-C calls this way. If you are familiar with the
syntax for calling shared libraries and know some Objective-C, this
should be quite intuitive.

```bash
need  CocoaCalls    load the file you need

@class  myClass         declares a class

+M method1withparm1|parm2|parm3 { parm1 parm2 %parm3 -- result }
                    declares a class method.`
                    Parameters are specified exactly as for shared libraries.`

-M method2 { ... }  declares an instance method.
```

The method names are the same as the methods you want to call, except
that you put "|" in place of ":" in the Objective-C method name,
and you don't split the name and intersperse the parameters as you do
in Objective-C. Rather, you use the normal shared library convention to
specify parameters. Note these method name/parameter combinations are
not class-specific in Objective-C.

Now to call one of these methods you have declared, you must do it from
within a method of one of your own classes, which must be subclassed
from NSMetaObj. This provides the Objective-C runtime system with a
proper receiver for the message, since NSMetaObj specifies the basic
ivars that the Objective-C runtime expects.

At runtime, for a class method, you need to ensure that the ivar
class-id has been set to the ID of your class as declared with @class
above. The new: method in NSMetaObj does this for you, so if your class
has a new: method, the easiest approach is for this to include new:
super. Otherwise you can do it explicitly yourself.

For example:

`:class myObjCclass  super{ NSMetaObj }`

`:m init:                    set things up explicitly`
`   myClass  class-id !      class-id is an ivar of NSMetaObj`
`;m`

`:m new:`
`   ...`
`   new: super               does "myClass class-id !" for you,`
`                            also allocates obj-C object of the class`
`                            and stores the pointer in obj-id, another`
`                            ivar of NSMetaObj`
`   ...`
`;m`

`:m someMethod:`
`   ....  method1withparm1|parm2|parm3`
`;m`

`;class`

When you call an Objective-C method from within your class in this way,
the receiver of the message is passed automatically for you. Only the
items which are the actual parameters of the message need to be placed
on the stack.

Note, at present, you can't execute an Objective-C method in
interpretation mode -- it must be within a compiled method of a class
descended from NSMetaObj. If you try to type an Objective-C method and
just execute it, you'll crash.

Methods prototyped to return a structure don't really return a long
structure itself, of course. In Mach-O/Cocoa convention, for a method of
this type we must pass as the leftmost parameter the pointer of the
memory frame for the structure to be returned. Then the method will make
up the content of the passed structure on return. That is quite parallel
to a C function to return a structure, the description of which is on a
tip page in Art's "Mops on the Web" site.

In CocoaCalls, the pointer of the structure is distinguished by "\*"
at the top of the parameter name in the declaration. For example, if an
instance method "getFrameRect:" is prototyped as

`[imaginary code-begin]`

`(NSRect)getFrameRect:(NSWindow *)wind`

`[imaginary code-end]`

We must declare it like

`[imaginary code-begin]`

`-M getFrameRect| { *framerect wptr -- }`

`[imaginary code-end]`

(Of course, we must pass a pointer of a NSRect structure as the first
parameter to it.)

In reverse, on declaring Objective-C method we can not use a
parameter's name beginning with "*" for the leftmost parameter
except for the case of "stret" method. Because, if the leftmost
parameter name begins with "*", Mops will interpret the method as a
"stret" method.

In reality a parameter to be passed is a pointer, so "*" is
misleading from its meaning in C language family. I thought "^" is
better. But "^" is relatively frequently used in parameter names, so
I avoided giving the symbol a special meaning.

### Nav manager support

`Read Me for new NavFile classes.`
`   Aug. 04 N.S.`

New "File" class supports Mode-less and window-modal Navigation Dialog
too. "FileX" class supports additionally long unicode file names.
Unfortunately, these may work only Mac OS X. On Mac OS 9, you should use
normal "Navget:" or "Navput:" as before.

The Usages are :

`File ff  I implemented it as a feature of File class.`
`        if you need long unicode file name, use FileX class.`

`128 NavGet: ff`
` NavGet: ( resID -- b ) -usual application-modal Open file Dialog`

`" undefined" NavPut: ff`
` NavPut: ( addr len -- b ) -usual application-modal Save file Dialog`

`128 windowref NavGetWM: ff`
` NavGetWM: ( resID windowref -- b ) - window-modal Open file Dialog`
` Windowref shall be the parent window's windowref (windowpointer).`

`" undefined" windowref NavPutWM: ff`
` NavPutWM: ( addr len windowref -- b ) - window-modal Save File Dialog`
` WindowRef shall be the parent window's windowref.`

`128 NavGetML: ff`
` NavGetML: ( resID -- b ) - mode-less OpenFile Dialog`

The point we must pay attention to is that in the case of window-modal
or mode-less NavDialog the methods return immediately after displaying
the dialog. So boolean to be returned means simply whether succeeding
(true) or failing (false) in displaying the NavDialog .

So when we will use mode-less or window-modal NavDialog, we must set
vects "ForSaveProc" and/or "ForOpenProc".

`ForSaveproc ( ^file -- )`

`ForOpenProc ( ^file -- )`

When we click "save" or "open" button on NavDialog, one of these
vect will be executed respectively. These vect will be passed an address
of file object for which the NavDialog are used. So, for example,

`//////////////`
`: mysaveproc { ^file -- }`
`^file create: class_as> file ?EXIT`
`^file savefile: mytextview  various writing process`
`^file close: class_as> file drop`
`;`

`' mysaveproc -> forsaveproc`
`////////////`

etc. should work.

Initially these vects is initialized by "drop" in order that the code
like following may not be broken :

`: savefile`
`128 NavPut: myfile`
`IF`
`   create: myfile drop`
`   ......`
`THEN`
`;`

When you must mix application-modal and window-modal/mode-less, it will
be better to use vects on both cases. Or you can change the contents of
vects appropriately in each time.

If you need to see whether user pushed the cancel button or the
open/save button on terminating (especially mode-less or window-modal)
NavDialog, get the value "NavAction?". It will be true when open/save
button pushed, false when canceled.

And still, mode-less Save Dialog will crash because it seems to be a bug
(or spec?) of Carbon Library (I have ever seen relevant discussions in
Carbon Mailing List on Apple's site. And it seems still to be true). So
I didn't include a method for it into file class.

------------------------------------------------------------------------

The other Aspects.

We have a NavDialog Object "NavDLGs" In file "NAV". We can send
messages directly to this object to manipulate Navigation Dialog. For
example,

`////////////////`

`File ff`

`modeless: NavDLGs`
`" your message" setmessage: NavDLGs`
`128  ff OpenByNav: NavDLGs  OpenByNav ( resID ^file -- rc )`

`//////////////////`

will display mode-less File Open Navigation Dialog with the message.
Among other methods for NavDLGs:

`AppModal:  ( -- ) -- init as application-modal NavDialog`
`WinModal:  ( windowref -- ) -- init as window-modal NavDialog`
`         and set the parent window.`

`ActionBtnLabel:  ( addr len -- ) -- customize word-label of Save/Open`
`                button.`

`CancelBtnLabel:  ( addr len -- ) -- customize word-label of cancel button.`

`Title:  ( addr len -- ) customize NavDialog's window title.`

`SaveByNav:  ( addr len ^file -- rc ) -- Create Save File Dialog.`

Generally speaking, set mode of NavDialog first of all -- which
initialize "NavDialogCreationOption" structure. Then customize the
dialog by sending a message(s) to NavDLGs. And, finally, send message
Save/OpenbyNav to create and display the dialog.

Contrary to the name, "NavDLGs" doesn't represent plural Dialogs but
only one NavDialog at one time. However, it is, instead of a substance
of NavDialog, a path to get to NavDialog, so you can display 2 or more
NavDialogs via it in order if they are mode-less or window-modal.

That's all.

Nao Sacrada

## Menu changes

"deprecated" functions still used are :

`AppendMenu()`
` -- because of the bug (probably) of "AppendMenuItemTextWithCFString()"`
`    (.. lengthy name! :-)`

`GetNewMenu()`
`AppendResMenu()`
` -- for resource fork menu support.`

`MenuKey()`
` -- its alternative "IsMenuKeyEvent()" will require`
`    some modification of "CarbonEvents" file.`

------------------------------------------------------------------------

How to create nib based Menu object: Use "CreateFromNib:" method of
Menu class.

If you are running Mac OS X with InterfaceBuilder installed, you could
try as follows:

1. Create Carbon NIB resource with InterfaceBuilder, say named
"main.nib", create a menu instance named "File", then save it. 2.
Put then created NIB bundle into ":Mops ƒ:" folder. 3. syntax of the
menu creation is as following :

when the menu has 5 items,

`[code-begin]`
`5 menu myFileMen`

`xts{ word0 word1 word2 word3 word4 } 128 ( MenuID ) init: myFileMen`
`" main" setNib: myFileMen  ".nib" extension must be dropped`

`" File" createfromNIB: myFileMen`
`........`
`[code-end]`

In order to see the menu immediately,

`insert: myFileMen`

will append the menu to current menubar.

------------------------------------------------------------------------

### New Syntax Features

With this version of Mops we provide two new syntax features. RightArrow
Get: / Put: abbreviations and Cascaded Messages.

### RightArrow

Have you ever listened to a Forth programmer's first reactions to using
object extensions? A typical reaction is "Gee, having to send a message
to an object sure seems like a lot more work than plain Forth". And in
a sense they are right. But of course there are many advantages to
object programming that far outweigh any extra (perceived or real)
effort in writing object code.

A common initial complaint is that obtaining the value of an object or
an ivar is cumbersome compared to what we can do with, for example, a
VALUE or a local variable, or plain variable. Consider the following
code using VAR, INT, or similar ivars:

1) get: x1 get: y1 get: x2 1- get: y2 put: temprect  seems like a lot
of get:s

With local variables or values we can write cleaner looking code:

2) x1 y1 x2 1- y2 put: temprect

RightArrow is a shortcut way of sending a get: or a put: message to an
object, ivar, or any valid message receptor in Mops. The RightArrow is a
single-character "arrow" pointing to the right, ≥ . It is similar in
appearance to the Smalltalk arrow, but it has a different meaning in
Mops.

In order to properly see the RightArrow, the font file MopsFont must be
installed. In OSX place MopsFont in your Username:Library:Fonts folder.
In OS9, if you use it, place the MopsFont file in your System 9
"Fonts" folder.

Then the RightArrow can be typed by either pressing 'option >' or
simply pressing the `<help>` key on your keyboard.

An arrow appended to an object name, no space between object name and
arrow, (or any message receptor) such as 'myIvar≥' is functionally
identical to 'get: myIvar'. An arrow prefixed to an object name, no
space between object name and arrow, (or any message receptor) such as
'≥myIvar' is functionally identical to 'put: myIvar'. In fact the
Mops interpreter / compiler has been modified to interpret 'myIvar≥'
as 'get: myIvar' and '≥myIvar' as 'put: myIvar'.

So the above code, written for objects or ivars or other message
recptors can now be written as follows:

3) x1≥ y1≥ x2≥ 1- y2≥ put: temprect  much cleaner than 1) above

or even, at the programmer's discretion, as follows:

4) x1≥ y1≥ x2≥ 1- y2≥ ≥temprect

It's not that we don't like the get: and put: messages. We do like
them. In fact the RightArrow syntax cannot work without them. But we
also think the shorthand syntax will be appealing to many.

Side benefits to using the RightArrow is less typing and shorter surce
code.

A final note. Since the RightArrow character is non-standard (not ascii
and not even standard Macintosh), in other fonts it will appear as a
'>' with an underline. This is also the way it will appear in the
Mops console window and other Macintosh text or word processors that do
not support the MopsFont font. But that's OK because that character is
rarely used (at least in Mops programs that we've seen) and it is very
similar in appearance to the RIghtArrow.

### Cascaded Messages

Smalltalk uses cascaded messages and we decided that they could be
useful in Mops as well. Consider the following snippet of code:

`10 10 40 40 put: myrectangle  1 1 inset: myrectangle`
`draw: myrectangle  invert: myrectangle  clear: myrectangle`

Cascaded messages let us re-write the above as follows:

`10 10 40 40 put: myrectangle 1 1 inset: | draw: | invert: | clear: |`

The '|' (vertical bar), will cause the reference to the last object
in the input stream to be re-used. Note how this syntax once again
allows for cleaner, shorter source code in the appropriate
circumstances. Also again, the syntax is optional so you can use it
where you like or not at all. It is especially useful when sending many
messages to the same object (or ivar, etc.) and the object has a long
name. We think many will appreciate this.

### New Operator

LEADING_ZEROS ( n -- n' ) is a monadic logical operator which
replaces n with the count of its leftmost zero bits up till the first
"1". If n is all zero, leading_zeros returns 32.

This operator is basically a way of accessing the PowerPC machine
instruction cntlzw.

------------------------------------------------------------------------

The remainder of these release notes are taken from earlier 5.x
releases, so if you're upgrading from a much earlier version you can
see what changes have been made.

------------------------------------------------------------------------

The changes in Mops 5.5 were:

-   -   Under OSX, you can now call frameworks exactly as you call
shared libraries. The syntax is exactly parallel:

`FRAMEWORK <someFramework>`

`FrwkCall  CallName1`
`FrwkCall  CallName2`

Note the framework name and call names are case sensitive.

Thanks to Nao Sacrada for the main work in implementing this. Nao's
OpenGL demo code is in the folder OpenGLDemoFolder, and you can load it
with:

`// OpenGLDemo`

-   -   You can now do direct Mach-O calls using similar syntax

to Syscall, e.g.

`MachOCall  EnterMovies`

Nao also contributed this code. He found that many QuickTime calls were
crashing under OSX, and that using direct Mach-O calls avoided the
problem.

-   -   `ASSERT{` now has an enhancement:
`ASSERT{ blah blah.... }"` blah didn't work!!"

If the assertion fails, the message in the quotes gets printed before
the error dump. You can put whatever you like there. This makes it easy
to identify which assertion failed.

Of course the original syntax without the quotes still works as it used
to.

-   -   We now have a proper implementation of SCREENBITS and

we're using this to set the initial size of the Mops window to
something reasonable.

-   -   If you accidentally put e.g.

`: aDefn  { a b -- )`
`   blah blah`
`;`

where you close the locals list with a ')' instead of a '}', we now
give an error. Previously text would be gobbled until a '}' was found,
which could be anywhere, usually leading to a misleading error message
which had nothing to do with the real error.

-   -   A new version of Quick Edit is included, which

has significant improvements.

The problems fixed were:

-   -   Shared libraries had some problems which I discovered

when working on the framework feature.

-   -   There was a one-off error in the check for the maximum

number of named parms and locals. Under PowerMops the limit is 11, but
you didn't get an error unless you exceeded 12.

-   -   Related to this, the number reduces to 9 if you have a

DO in your definition, since two registers get used for I and the do
limit. I wasn't checking for this reduced number.

-   -   Some FP standard words would leave extra items on

the FP stack. This resulted from changes made a year or so back, to
allow a variable number of FP stack cells to be held in registers on
entry to definitions. Thanks again to Nao for finding and fixing this.

-   -   The word DblTicks (in CarbonEvents) still had a

reference to a low memory global which of course is a no-no under OSX
and caused a crash. This is now replaced with a call to the proper
accessor function. Thanks to Nao for this one too.

-   -   Doug Hoffman's Carbon changes to the AppleEvents

file had caused an incompatibility with 68k Mops, so we now have two
AppleEvents files to fix this problem (AppleEvents and zAppleEvents).

-   -   Under OSX, if an error occurred while loading a

source file, and you edited and reloaded, a spurious error could come up
since the file wasn't closed when the error occurred.

-   -   A few problems with double number words have been

fixed -- DNEGATE didn't give the correct result at all, and D-
sometimes in effect had its operands reversed.

-   -   Occasionally code that converted a test result to a

boolean flag (e.g. ... 0= ++> aValue) would give the wrong result. The
combination of circumstances was unlikely, but it's now fixed anyway.

-   -   On saving a new dictionary or installing a new app,

there were occasional problems that may have resulted from resources
being mis-aligned.

------------------------------------------------------------------------

Mops 5.4 was a fairly minor update to Mops 5.3. It fixed a number of
small bugs, added some new Carbon calls to the Control class to support
dynamic scrolling, and included a new version of Quick Edit which also
has a few improvements.

------------------------------------------------------------------------

Mops 5.3 was a minor update to 5.2 to introduce a Carbonized Quick Edit
and fix a number of bugs.

------------------------------------------------------------------------

Mops 5.2 was an update to Mops 5.1, which was required by the changeover
to the Carbon Event model, which caused modal dialogs to crash under
OSX.

We have fixed this problem by a complete revision of the Dialog class.
Hopefully though, this should not require any changes to existing code.
But there is some significant new functionality which you may want to
use.

Dialogs are now subclassed from both Window and x-array, instead of just
from x-array as before. Some of the existing dialog methods are now
handled by the superclass Window and so have been deleted from the
Dialog class itself.

The three kinds of dialog (modal, movable modal and non-modal) are now
handled with the single Dialog class. The old Dialog+ class isn't
needed any more, and has gone. (Where? I'll leave that as an exercise
for the reader, but the answer might include terms like Taligent,
OpenDoc, and Itanic.)

You can use a resource editor to set the dialog type for your dialog. If
you want modal or moveable modal, set the dialog type to the appropriate
type and fire up your dialog by sending getnew: and modal: to your
dialog as you always did. If the type is moveable modal, you'll be able
to move it around the screen and even click it into the background to
get hold of another application.

For a non-modal dialog, set the type to "no grow document", and fire
up your dialog simply with getnew:. Your dialog will then open on the
screen and behave like any other window.

One small trap is with edit text items, if they contain initial text
(i.e. provided from the dialog resource). This text might appear in the
wrong font until you type into the edit text item, in which case the new
characters appear in system font and the whole appearance gets
scrambled. The fix is simply to not leave the text style undefined in
the dialog resource, but to explicitly set it to font ID zero, size 12
point.

------------------------------------------------------------------------

The following notes on Carbon Events and the Carbonization of Mops are
essentially as they appeared in earlier releases. However until the
Manual is updated we'll keep including them here.

I've put extensive comments in the CarbonEvents file, so if your
application needs to know about event handling, please have a look
there. If you don't do things with events, then your code might well
still work without changes. (No promises, though :-)

### Carbon Events

With Mops 5.1 we changed from the "old" event model to Carbon Events.
This was always going to be a good idea since the new event model makes
much more efficient use of the processor, but it has actually now become
necessary with the latest release of OSX, since MLTE (the text editing
engine used by the Mops window) now requires Carbon Events in order to
handle incoming keys properly.

### Event Handling

As you'd expect event handling has totally changed, and even the old
Event file isn't part of the load any more. fEvent is still there, but
many of its methods don't do anything useful any more. I'll clean it
up more in a future release, but it was important for where: fEvent to
still give the location of the last click.

### Menus

Menus have also changed in some implementation details, however most
existing Mops code shouldn't be affected. With Carbon events we have to
use "command IDs" which are a high-level concept that abstracts out
the actual function we want to perform regardless of whether it's
invoked by a button press, menu choice, AppleEvent or whatever.

The nice thing is that the command IDs can be arbitrary unique 32-bit
numbers. So, we're making Mops command IDs the NOT of the relocatable
address where the xt we want to execute is located. This makes invoking
them when the Command event comes in, very easy. We've modified NEW:
and GETNEW: in class Menu to define the appropriate IDs for each item in
the menu.

The reason for the NOT is that Apple has a number of standard IDs for
things like Copy, Cut, Paste etc. These are all 4-char codes like
'copy'. This means their top bit is always zero. Now Mops reloc
addresses are guaranteed to also have a top bit zero (to distinguish
from hashed selectors which always have 1.) Thus the NOT of a reloc addr
has a high bit 1, and can't ever clash with an Apple ID.

In a future release I should provide a way that the standard Apple IDs
for Copy, Paste etc. can be handled -- this should facilitate
AppleScripting of Mops applications.

### Carbonization of Mops

Moving PowerMops to Carbon, we tried to keep it outwardly as unchanged
as possible from 4.0.3. However Carbonization has inevitably involved a
great many under-the-hood changes.

The most obvious changes are that Standard File doesn't exist under
Carbon, and has been replaced by Navigation Services Manager support.
See the file "Nav" in "PPC Source". This is still rather
preliminary, but provides the basic functionality we need. Thanks to
Gorazd Krosl for this.

Another significant change is that TextEdit doesn't run reliably under
OS X, so we now have a MLTE class (Multilingual Text Engine). Apple
intends MLTE to replace TE. One immediate advantage is that the Mops
editing window is no longer limited to 32k of text.

Other significant changes are that we aren't allowed to know anything
about the internal structure of GrafPorts. Also a Window isn't a
GrafPort any more, but contains a WindowRef, which is a 32-bit number
which designates a Window to the System, and which we can't assume
anything about. Likewise a Dialog contain a DialogRef, which isn't the
same as a WindowRef. The Carbon API contains functions to recover a
WindowRef from a DialogRef and to do other things which we used to do by
accessing the GrafPort directly.

Fortunately the changes to Dialogs and Windows have been subsumed into
the Window and Dialog classes, so that unless your code is digging
around into the internal structures of these classes you shouldn't need
to change anything.

Another change is to callbacks. These have always been nasty, and have
proved so again. On the PowerPC, to pass a callback to a system call, we
have to use a UPP. Pre-Carbon, there was a generic NewRoutineDescriptor
call which we could use for all callbacks, and our :PPC_ENTRY syntax
was based on this mechanism. However, under Carbon NewRoutineDescriptor
has gone away, and we have to use calls NewxxxUPP and DisposexxxUPP (in
which xxx is a name which is specific to the particular callback we're
doing.)

This has forced a new callback syntax, :CALLBACK and ;CALLBACK. You have
to push the addresses of the NewxxxUPP and DisposexxxUPP syscalls before
:CALLBACK. See the file CarbonEvents for more comments and some actual
examples you can copy.

One other small change that I've made is that since we have a word .ERR
to give a full stack dump from the last error that came up, we no longer
give a stack dump when the error actually comes up. One of the most
common errors is a compilation error when using Mops interactively, and
a long dump from something like a mistyped word was an unnecessary pain.

### 68k Mops

Note that 68k Mops is completely unchanged from 4.0.4, and so is no
longer included with this distribution. It is still available from the
web site.

As always, I hope you enjoy Mops!

-  *Mike Hore*

