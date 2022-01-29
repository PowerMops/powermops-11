---
title: Events
layout: default
---

About this chapter
------------------

This chapter describes the Mops classes and words that manage Macintosh
events for the application. Macintosh applications are event-driven,
meaning that the program must at all times be responsive to the various
input devices available to the user, including the keyboard, the mouse
and the disk. Mops has built-in support classes that make event handling
virtually invisible to the application, enabling the programmer to focus
on the problems that he or she is attempting to solve. Most of the time,
you will not find it necessary to concern yourself with the Event
classes, but this chapter will provide some orientation in case you
would like to modify event handling to suit your specific needs.

Additionally, the event handling scheme of Mac OS has been changed since
Carbon. Classes described in this chapter are still defined in Carbon
PowerMops. However the role of Event class object is now quite
different. In Carbon, Event handler should be a callback routine that
will be installed for each event at runtime. See also relevant sections
([Callback](Reference_7#Callback_Routines),
[EventLoop](Reference_9#Waiting_for_Events)) of Reference
part.

  rowspan=4 style="border: thin \#aaa solid" \| [Inside Macintosh](http://developer.apple.com/documentation/macos8/mac8.html)   [Event Manager](http://developer.apple.com/documentation/mac/Toolbox/Toolbox-28.html)
  ------------------------------------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------
  [Window Manager](http://developer.apple.com/documentation/mac/Toolbox/Toolbox-188.html)                                         
  [Menu Manager](http://developer.apple.com/documentation/mac/Toolbox/Toolbox-89.html)                                            
  [Control Manager](http://developer.apple.com/documentation/mac/Toolbox/Toolbox-297.html)                                        
  rowspan=3 style="border: thin \#aaa solid" \| Mops:                                                                           [Windows](Lesson_20)
  [Menus](Lesson_21)                                                                                                   
  [Controls](Lesson_20#Controls)                                                                                       

  : Recommended reading

  ------- --------------
  Event   CarbonEvents
  ------- --------------

  : Source files

Using events
------------

Class Event is the core of Mops's event management. It instantiates a
single object, fEvent, which resides in the nucleus portion of Mops's
dictionary. FEvent is functionally an X-Array of 24 elements, each of
which contains the xt of a Mops word corresponding to a particular event
type. The Macintosh OS maintains a first-in first-out queue of events
received from various I/O devices, and the application can request that
the next event be accepted from the queue at any time. If no
'real' events are outstanding, the Macintosh returns to the
application with a Null event, which is simply a statement that nothing
else happened so that the application can continue with its processing.

Non object-oriented Macintosh programs are usually designed with a huge
case statement at the highest level that processes the various types of
events that can occur. This results in a sort of inverted structure, in
which the lowest-level processing is managed at the highest level of the
code. Mops avoids this by handling as many conditions as it can behind
the scenes (for instance, calling the Menu Manager when the user clicks
the mouse in the menu bar) and using late binding to allow the
application to provide specific processing where it is needed. For
example, each window in an application might take a unique action when
the user clicks the mouse in its content region. Mops simply sends a
late-bound Content: message to the front window when a content click
occurs, which results in the specific content method being executed that
is appropriate for the window's class. Late binding allows Mops' event
management to be completely general and open-ended, because the
programmer can always build more specific event responses into Window
and Control subclasses. Mops' basic Window and Control classes provide
general behavior that will be acceptable for many situations.

Macintosh events are assigned a contiguous series of type codes:

  Code   &nbsp;   Description
  ------ -------- ---------------------------------------------------------
  0      *       Null event - used to provide background processing
  1               Mouse down - button was depressed
  2      *       Mouse up - button was released
  3               Key down - key was depressed
  4      *       Key up - key was released
  5               AutoKey - key is being held down
  6               Update - a window must redraw a portion of its contents
  7               Disk - a disk was inserted in a drive
  8               Activate - a window became active or inactive
  10     *       Network - an AppleBus event occurred
  11     *       IODriver - a device driver event occurred
  12     *       user-definable events
  13              
  14              
  15              OS events, such as Suspend and Resume
  23              High-level events, including AppleEvents

Events marked with an asterisk (*) are events for which Mops executes
its null-event code rather than code specific to the type of event. If
your application assigns significance to these event types, you will
have to install your own action word in the cell of fEvent corresponding
to the event's type. You might also need to change fEvent's mask with
the set: method to accommodate event types that are currently masked
out.

Class Event contains a set of named ivars that allocate a Toolbox event
record. Event's sole object, fEvent, passes its base address to the
Event Manager as the event record to use for all Mops events. FEvent
also contains 24 indexed cells, for the event types described above.
Each of these cells contains the xt of a word that handles the specific
event type; you will find the source for these event handlers at the end
of source file Event. A word defined at the beginning of the source file
ObjInit, called -MODELESS, initializes fEvent with the correct xts
whenever Mops starts up. This is accomplished by setting the System
Vector OBJINIT to execute a word SYSINIT, which calls -MODELESS. (The
name, by the way, arises because Mops initially has no modeless dialogs.
In the source file Dialog+ there is a matching word +MODELESS which
installs the event handling that is required if there is a modeless
dialog active.)

Listening to events
-------------------

The chief means by which you can cause Mops to listen to the event queue
is by calling the Mops word KEY. This causes class Event to enter a loop
that requests the next event from the queue and executes the indexed
cell corresponding to the event type until a KeyDown or Auto-Key event
occurs. Other events are managed as they come, triggering menu choices,
window activation or updating, and control selections. To the original
caller of KEY, all of this activity is invisible, because it will not
resume execution until a keystroke is received. Thus, the caller of KEY
enters a sort of "suspended animation" while the Macintosh
handles non-keystroke events. This serves to separate the bulk of event
management from the traditional, keystroke-oriented parts of your
application, and was designed to simplify Macintosh program-ming for
those used to more conventional systems.

As pointed out in [Reference
12](Reference_12#Clearing_Nested_Stacks_-_Become), you might
need to use the Mops word BECOME if you nest calls to KEY within several
layers of code, because a menu or control choice could cause a new
portion of the application to begin executing, and ultimately cause the
system to run out of return stack. An alternate structure is to do all
keystroke processing via an infinite loop at the top of your application
that calls KEY and executes the Key: method of the front window. If you
have already got all the keystroke-handling actions programmed into your
windows, you can use the word EVENTLOOP, which is an infinte loop
getting the next event from the event queue and executing the
appropriate handler each time. While less familiar to most of us, this
architecture will probably result in a simpler application in the long
run.

Specific event handling
-----------------------

Null events (all event types with the * above) can be used to execute
the Idle: method for the front window. The programmer should use a
window's Idle: method to perform any background processing that is
required for that particular window (such as call TEIdle in a text edit
window). The Idle: method should execute quickly so as not to bog down
the responsiveness of the system to input.

Mouse-down events are handled based on what window region the click
occurred in (from FindWindow - see IM Window Manager). Of the seven
possible regions, only two are of real concern to the programmer,
because Mops can take appropriate action for the others. If the mouse is
clicked in a close box, the window executes whatever action word you
have installed in the window's CLOSE vector, just as a content region
click will execute the window's CONTENT vector. The Actions: method
allows you to customize these two aspects of a window's mouse click
handling. You might also have to redefine the Grow: method for your
windows if they require resizing of controls or other unique behavior;
Grow: is executed in response to a grow-region click.

The Key-down handler fetches the value of the key entered from the event
record's Message field, first checking to see if the Command key was
held down simultaneously. If so, the Menu Manager is called to process a
potential key-equivalent menu choice. Key equivalents are thus managed
automatically by Mops, requiring only that you specify the key
equivalents in your menu item text definitions. If the Command key was
not held down, Mops returns to the word or method that called KEY with
the value of the entered key on the stack.

The Update handler sends a late-bound Draw: message to the corresponding
window object, causing it to redraw its contents.

The Disk-inserted handler takes the normal default action, which is to
check if the system has already mounted the disk, which it will have
attempted to do. If the mount was unsuccessful, the handler calls the
system routine DIBadMount to display the usual error message "This
disk is unreadable". If you provide your own handler, put its xt
in cell 7 of fEvent to process disk-inserted events.

The Activate handler determines whether the event is an Activate or
Deactivate, and sends the appropriate late-bound Enable: or Disable:
message to the window involved.

Classes
-------

### Event

------------------------------------------------------------------------

Event associates a Toolbox event record with a dispatcher that executes
a Mops word for each type of event received.

+-----------------------------+---------------------------------------+
| Superclass                  | Event                                 |
+=============================+=======================================+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class   Name   description          |
|                             |   ------- ------ -------------------  |
|                             | ------------------------------------- |
|                             |   int     what   The named ivars c    |
|                             | omprise an eventRecord --- see IM |
|                             |   var     msg                         |
|                             |   Var     time                        |
|                             |   var     loc                         |
|                             |   int     mods                        |
|                             |   int     mask                        |
+-----------------------------+---------------------------------------+
| Source file                 | Struct                                |
+-----------------------------+---------------------------------------+
| Status                      | Core                                  |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              |                                       |
+-----------------------------+---------------------------------------+
|                             |   Name     description                |
|                             |   --                                  |
|                             | ------ ------------------------------ |
|                             |                                       |
|                             | fEvent   The system-wide Event object |
+-----------------------------+---------------------------------------+

  Inherits:   X-Array, Array, Indexed-Obj, Object
  ----------- -------------------------------------

  accessing
  -----------
  type:
  mods:
  msg:
  where:
  msgID:
  when:
  set:
  polling
  next:
  key:

  : Methods

  -------------------- ---------------------------------
  **Error messages**   See messages for class X-Array.
  -------------------- ---------------------------------

### Mouse

------------------------------------------------------------------------

Mouse integrates various Toolbox calls, providing easy access to the
mouse's position in local coordinates, the state of the mouse button,
and whether a double-click has occurred.

+-----------------------------+---------------------------------------+
| Superclass                  | Object                                |
+=============================+=======================================+
| Source file                 | Event CarbonEvents                    |
+-----------------------------+---------------------------------------+
| Status                      | Core                                  |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class   Name       description      |
|                             |   ------- ---------- ------           |
|                             | ------------------------------------- |
|                             |   var     last       Tic              |
|                             | ks value when the last click occurred |
|                             |   var     interval   Tick             |
|                             | s between this click and the last one |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              |                                       |
+-----------------------------+---------------------------------------+
|                             |   Name       description              |
|                             |   ---------- ---------------          |
|                             |   theMouse   default mouse            |
+-----------------------------+---------------------------------------+

  Inherits:   Object
  ----------- --------

  accessing
  -----------
  get:
  where:
  click:
  put:

  : Methods

**Error messages** - None

------------------------------------------------------------------------

&nbsp;

  ------------------------------- ------------------------------------------- ---------------------------------
  [Files](Classes_3)   [Classes](Classes)               [Windows](Classes_5)
  &nbsp;                          [Documentation](Documentation)   
  ------------------------------- ------------------------------------------- ---------------------------------



