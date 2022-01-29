---
title: Windows
layout: default
---

About this chapter
------------------

This chapter describes the Mops classes and words that manage windows
for the application. Mops's window classes take away much of the burden
of window management, providing the basis upon which you can build more
detailed behavior. Standard Macintosh window behavior, such as dragging,
growing and updating, is handled automatically by Mops's Window and
Window+ classes, freeing you to solve application-level problems instead
of constantly having to rewrite system-level code for window management.

  ------------------------------------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------
  rowspan=4 style="border: thin \#aaa solid" \| [Inside Macintosh](http://developer.apple.com/documentation/macos8/mac8.html)   [Event Manager](http://developer.apple.com/documentation/mac/Toolbox/Toolbox-28.html)
  [Window Manager](http://developer.apple.com/documentation/mac/Toolbox/Toolbox-188.html)                                         
  [QuickDraw](http://developer.apple.com/documentation/mac/QuickDraw/QuickDraw-9.html)                                            
  [Control Manager](http://developer.apple.com/documentation/mac/Toolbox/Toolbox-297.html)                                        
  rowspan="5" style="border: thin \#aaa solid" \| Mops                                                                        [Window](Lesson_20.html)
  [Controls](Lesson_20#Controls)                                                                                       
  [QuickDraw](Classes_8)                                                                                               
  [Toolbox Views](Reference_3)                                                                                         
  [Resources](Reference_12#Resources)                                                                                  
  ------------------------------------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------

  : Recommended reading

  --------------- ----------------
  Window          zWindow
  WindowMod.txt   zwindowmod.txt
  Window+         zWindow+
  --------------- ----------------

  : Source files

Using windows
-------------

Mops provides two classes of window objects: class Window, built into
the distributed Mops.dic image, provides basic behavior necessary for
all windows, but does not include any management of views (or controls,
which are a view subclass). Another class, Window+, adds the behavior
necessary for windows with views. Unless your application is a
particularly "quick and dirty" one, which just needs an
extremely simple text-only output along the style of a dumb terminal, we
recommend you use the Window+ class. Lessons 18 and 19 of the Tutorial
have already given an introduction to views, and how these interact with
the Window+ class.

Because a Macintosh window record incorporates a QuickDraw GrafPort as
the first portion of its data, class Window is a subclass of class
GrafPort, inheriting both the GrafPort data and three GrafPort-related
methods (see the QuickDraw section of this manual).

Windows, like controls and certain other Toolbox objects, have a dual
identity in that part of the object is known only to Mops, while another
part is known both to Mops and to the Toolbox. From the point of view of
the Toolbox (and conventional languages like Pascal or C), a window is
completely described by a window record. A Mops window object packages
the window record data within the larger context of the object's
private data, adding ivars to support the additional level of management
that a Window object provides. The result is that the programmer is
confronted with a much simpler model using objects, because all of the
'boilerplate' kinds of behavior, such as dragging, growing,
closing, updating and activation are handled within the window object
itself rather than being thrown in with the application code. That is
how Mops is able to simplify the logical model of the Toolbox and
elevate it to a higher level, while still giving you the freedom to
change any of the default behavior that occurs in such basic classes as
Window.

There are two ways to create a new window using the Toolbox: you can ask
that the Toolbox allocate the window record on the heap, or you can
provide the data area yourself. Because a Mops window object includes a
window record as its private data, it always uses the second of these
methods, passing the address of its own data to the Toolbox as the
storage to use for the window record. Of course, if you have an
application in which windows come and go dynamically, so that you wish
to allocate them on the heap, you can use the Mops ObjHandle mechanism
to do so.

The fact that an object allocates a window record as the first part of
its data is important, because it simplifies the interaction between
Mops and the Toolbox. There are many cases in which Mops must determine
which window is involved in event processing by calling the Toolbox,
which will return a pointer to the window record. If the window record
were not part of the object, Mops would have to somehow derive the
address of the object's data from the window record. As it is, the
window record is synonymous with the object's base address, making
communication with the Toolbox much simpler. Other Mops objects, such as
Controls, do not have this luxury, and must take extra steps to derive
the object address.

Window objects add to the window record data a group of instance
variables that keep track of the window's drag and grow
characteristics, a boolean that tells whether the window is currently
'alive' with respect to the Toolbox, and a set of action
'hooks' that allow you to customize a window's behavior
without necessarily having to create a subclass. These action vectors
hold the xts of Mops words to execute when the window is involved in a
content click, an update event, an activate event, or selection of the
close box. The ClassInit: method of Window initializes the vectors to
the xt of NULL, except for the activate vector, which is set to the xt
of CLS ('clear screen', which erases the viewing area of the
window).

For the Window+ class, which you should normally be using, you should
leave the click handler and the update handler set to NULL (which they
will be initially anyway), since clicks and drawing are handled through
our view mechanism. You may, however, have a good reason to customize
the activate or close handlers---for example, you may need to change
menu items depending on which windows are open or in front.

Creating windows
----------------

The steps involved in creating and using a window are as follows: First,
instantiate a window class (i.e. create a window object), and then
initialize the action vectors of the window using the actions: method.
For windows whose data exists in the dictionary or a module, this can
occur at compile time:

`window myWind    \ create a new window object`\
`xts{ doClose doActivate null null } actions: myWind`\
`    \ Set the close, activate, draw and content vectors`

The Activate vector is executed when the window becomes active, and the
Close vector is executed when the use clicks the Close box. Typically,
you will use both of these hooks to adjust items in your menus.

The Draw vector is called when the window receives an update event,
which is the Toolbox's way of telling the window to redraw itself. Note
however that drawing should now be done through our view mechanism, and
not by setting the window's draw handler. At the moment we are really
only maintaining a draw handler for backward compatibility, and it will
probably disappear in future.

If the window is of class Window+, any views associated with the window
will be redrawn automatically, since the DRAW: method for Window+, among
other things, calls DRAW: on the contView, which causes DRAW: to be sent
to all the views.

Lastly, the Content vector is called when the user clicks the mouse in
the window's content region. Here again, you should now normally handle
content clicks through the view mechanism---the click handler may
also disappear in future.

You can also set the window's drag and grow characteristics at compile
time, if the ClassInit: defaults do not suit your needs. Each requires a
boolean on the top of the stack reflecting whether the window is
growable or draggable, and the four coordinates of a rectangle
underneath the boolean if it is true. For example:

`10 10 500 300 true setDrag: myWind`\
`false setGrow: myWind`\

causes myWind to be draggable, but not growable. But note, in class
Window, we actually ignore the rectangle coordinates passed in for
setDrag: and setGrow:, and use a default value based on the size of the
screen at the time the drag or grow is actually done. This is probably
more generally useful than using any fixed values for the drag or grow
limits. So unless you actually want fixed values and override these
methods, you can just pass any four dummy values.

When your application executes, you must send a New: message to the
window to cause it to become active with the Toolbox and to draw itself
on the screen. New: requires a rectangle holding the dimensions of the
window's frame, a title, a procID for the window type, and booleans
reflecting whether the window should be visible when created and whether
it should have a close box. For instance:

`10 10 300 200 put: tempRect`\
`tempRect " A New Window" docWind true true new: myWind`

would create a new document window using the dimensions stored in
tempRect that would be visible and have a close box. If you would rather
define your window's characteristics using resources, you can call the
GetNew: method to open the window using a template from a resource file.

To get a feel for how Mops' window objects can be used, it is most
instructive to look at an existing application, such as grDemo. Lessons
18, 19 and 20 of the Tutorial deal with grDemo, and lessons 18 and 19 in
particular give a good introduction to the View and Window+ classes.

Much of the code, as you will see, is concerned with initializing the
various objects properly; much of the actual work is accomplished
internally to the methods already defined for those objects.

Classes
-------

### Window

------------------------------------------------------------------------

Window is the basic class of windows without controls. As for PowerMops,
see also [Reference 11](Reference_11) (at present).

+-----------------------------+---------------------------------------+
| Superclass                  | GrafPort                              |
+=============================+=======================================+
| Source file                 | WindowMod.txt zWindowmod.txt          |
+-----------------------------+---------------------------------------+
| Status                      | Core                                  |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class      Name                     |
|                             |                           description |
|                             |   ---------- ----                     |
|                             | ------------------------- ----------- |
|                             | ------------------------------------- |
|                             |   32 byt                              |
|                             | es   wind1                         Un |
|                             | structured data for the window record |
|                             |   handle     CtlList                  |
|                             |                  Windows control list |
|                             |   12 byt                              |
|                             | es   wind2                         Un |
|                             | structured data for the window record |
|                             |   rect                                |
|                             |    contRect                      The  |
|                             | rectangle defining the content region |
|                             |   rect                                |
|                             |   growRect                      Conta |
|                             | ins the window's current grow limits |
|                             |   rect                                |
|                             |   dragRect                      Conta |
|                             | ins the window's current drag limits |
|                             |   bool       growFlg                  |
|                             |        True if the window is growable |
|                             |   bool       dragFlg                  |
|                             |       True if the window is draggable |
|                             |   bool                                |
|                             |   Alive                         True  |
|                             | if the window is alive in the Toolbox |
|                             |   bool                                |
|                             | ScrollFlg                     True if |
|                             |  window contents are to be scrollable |
|                             |                                       |
|                             |  bool       Color?                    |
|                             |      True if this is a color grafPort |
|                             |   x-add                               |
|                             | r     Idle                          T |
|                             | he window's idle event action vector |
|                             |   x-addr                              |
|                             | Deact                         The win |
|                             | dow's deactivate event action vector |
|                             |   x-addr                              |
|                             |    Content                       The  |
|                             | window's content click action vector |
|                             |   x-addr                              |
|                             |     Draw                          The |
|                             |  window's update event action vector |
|                             |   x-addr                              |
|                             |   Enact                         The w |
|                             | indow's activate event action vector |
|                             |   x-ad                                |
|                             | dr     Close                          |
|                             | The window's close box action vector |
|                             |   int        ResID                    |
|                             |          Resource id for GetNewWindow |
|                             |   bool       Cl                       |
|                             | ipGrowLeft                  True if y |
|                             | ou want to not outline unused VScroll |
|                             |   bool       ClipGrowTop              |
|                             |              Ditto for unused HScroll |
|                             |   p                                   |
|                             | tr        nowrap \| \^view\_in\_focus |
|                             |    Points to view which gets keys etc |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              |                                       |
+-----------------------------+---------------------------------------+
|                             |   Name    description                 |
|                             |   ------- -------                     |
|                             | ------------------------------------- |
|                             |   fWind   The M                       |
|                             | ops system window used by the nucleus |
+-----------------------------+---------------------------------------+

  Inherits:   GrafPort, Object
  ----------- ------------------

  setting characteristics
  -------------------------
  setContRect:
  SetColor:
  SetClipGrowLeft:
  SetClipGrowTop:
  setGrow:
  setDrag:
  setScroll
  setIdle:
  set:
  select:
  size:
  setSize:
  move:
  center:
  show:
  hide:
  actions:
  setAct:
  setDraw:
  title:
  name:
  putRect:
  querying
  getName:
  getRect:
  getVSRect:
  getHSRect:
  maxX:
  maxY:
  active:
  alive:
  event handling
  draw:
  idle:
  enable:
  disable:
  update:
  close:
  release:
  drag:
  zoom:
  grow:
  content:
  key:
  initialization
  classinit:
  runtime control
  new:
  getNew:
  test:

  : Methods

**Error messages** - None

### Window+

------------------------------------------------------------------------

Window+ adds support for views, and also zooming. Unless your window is
to be very basic indeed, you should use this class.

+-----------------------------+---------------------------------------+
| Superclass                  | Window                                |
+=============================+=======================================+
| Source file                 | Window+                               |
+-----------------------------+---------------------------------------+
| Status                      | Optional                              |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class   Name         description    |
|                             |   ------- ------------ -------------- |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             |   ptr     \^contView   Pointer to t   |
|                             | he ContView--- the view consistin |
|                             | g of the whole contents of the window |
|                             |   bool    zoomFlg                     |
|                             | True if this window is to be zoomable |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              | None                                  |
+-----------------------------+---------------------------------------+

  Inherit:   Window, Grafport, Object
  ---------- --------------------------

  accessing
  -----------------
  setZoom:
  getView:
  setView:
  event handling
  grow:
  zoom:
  enable:
  disable:
  content:
  key:
  draw:
  idle:
  close:
  runtime control
  new:
  getnew:
  test:

  : Methods

**Error messages** - None

------------------------------------------------------------------------

  -------------------------------- ------------------------------------------- ----------------------------------------------
  [Events](Classes_4)   [Classes](Classes)               [ Views and Controles](Classes_6)
  &nbsp;                           [Documentation](Documentation)   
  -------------------------------- ------------------------------------------- ----------------------------------------------



