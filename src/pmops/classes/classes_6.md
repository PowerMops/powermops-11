---
title: Views and Controls
layout: default
---


About this chapter
------------------

This chapter describes views, which are also used by MacApp, TCL,
PowerPlant, the Newton, and most other OOP development systems for GUI
(graphical user interface) platforms. A view basically defines a
rectangular area within a window within which drawing may take place.
For those familiar with MacApp or TCL, there is a small difference in
that in those systems a window is itself a view. In Mops, a window
isn't a view, but contains a view or views.

Our basic Window class doesn't support views at all; for this you will
need the Window+ class. Although you may draw directly in a Window via
its Draw handler, we are now trying to discourage this. We don't even
guarantee that in future windows will continue to have their own Draw
handlers---in fact they probably won't!

You should now use a view within a Window+, and draw either by
overriding the DRAW: method for the view, or by using its draw handler.
This will give you much greater flexibility as to what you can do within
the window. This comes about because a view can contain any number of
child views. A child view is another view, but is constrained to be
drawn within its parent view.

Class Control, which in earlier versions of Mops was an independent
class, is now a subclass of View.

  ------- ---------------------------------
  Mops:   [Windows](Classes_5)
  ------- ---------------------------------

  : Recommended reading

  ------------
  View
  6Ctl
  Scroller
  TEScroller
  ------------

  : Source files

Using Views
-----------

A view must have an owning window. A view has an associated rectangular
area within which anything owned by a view is drawn, including any child
views.

A Window+ contains one special view (the ContView) which covers the
whole drawing area of the window (excluding any scroll bars). All other
views within the Window+ must be child views of the ContView (or child
views of those child views, etc).

The rectangular area of a view is defined in an ivar which is a rect,
ViewRect. To be precise, this rectangle defines the outer boundary of
this view, relative to the current grafPort. This rect is used by its
owning view to set the clip region and the coordinate origin before
calling any method on the view.

However, as we saw in the Tutorial in lesson 18, you will normally
specify the size and position of a view by setting the bounds and
justification for the four sides. Please see that Tutorial lesson for a
full rundown of the various options you have.

Clicks on views
---------------

The way we used to handle clicks in earlier versions of Mops, was that
CLICK: would be called on the whole hierarchy of views in a window (via
Window+ calling CLICK: on its contView, and each view calling it on all
its children), until one returned true to say that it had handled the
click.

This scheme wasn't always flexible enough---for example, we might
have a view which wants to take control of all clicks on it, even if the
click was on a child view. But by the time the view found out that the
click was in fact on a child view, the child view had already handled
it! We needed a way of separating out the decision as to which view is
to handle the click, from actually doing the handling.

Hence the new scheme. Clicking on views is now done in two steps. The
first step is to decide which view is going to handle the click. The
method VIEW\_FOR\_CLICK?: is now called on the whole hierarchy of views
the way CLICK: used to be. This method returns either the address of a
view and true, or just false.

So, the process starts with Window+ calling VIEW\_FOR\_CLICK?: on its
contView. If this call returns true, we also have the address of the
view that wants to handle the click, so Window+ then calls CLICK: on
this view. And note from this that CLICK: no longer returns a result.

So, if your particular view receives a CLICK: message, you know that
your view was really clicked---you don't have to test anything.

In the situation I mentioned above, where a view wants to handle clicks
on its children, you can now simply override VIEW\_FOR\_CLICK?: Thus:

`:m view_for_click?: ( -- ^view true | false )`\
`   view_for_click?: super`\
`   IF                \ child was clicked`\
`       drop ^base    \ substitute my addr`\
`       true        \ and tell caller we want the click`\
`   ELSE`\
`       false        \ no, don't want it`\
`   THEN`\
`;m`

Using Controls
--------------

Mops defines a generic Control class, which is a subclass of View, and
then has subclasses for the different kinds of standard
control---Button, Checkbox, RadioButton, Vscroll and Hscroll.

Since a control is a view, in order to use controls within your
application, you must use a Window+ or a subclass of Window+, since
these are necessary to support views.

As is the case with other Toolbox objects (such as Windows) control
objects have a dual identity. Part of the control's data is maintained
by the Toolbox on the heap, and can be accessed by the application via a
handle. If you were writing in a conventional language, such as C or
Pascal, you would consider the handle to be the control, and you would
have to build a lot of structure into your code to support the user's
selection of the various parts of the control. Mops, on the other hand,
combines the control's Toolbox related data with its own View related
data to comprise a single object that contains all it needs to know
about managing the various actions that can occur. You need only
instantiate and initialize the object properly, and it takes care of the
rest. Even much of the initialization is handled automatically via the
View class.

Controls store the xts of Mops words as action vectors that will be
executed when the various parts of the control are selected. Simple
controls (class Control) have a single action vector, while scroll bars
have 5. You can use these classes as a model for defining your own
control classes if you wish to define new types.

When you click in a control, the control object receives a click:
message as part of the normal view handling. The click: method in class
Control then calls the Toolbox routine FindControl to identify which
part of the control has been clicked. After that, two different things
may happen, depending on the control type and part number affected.

For buttons, check boxes and scroll bar thumbs, the control is
highlighted while the button remains depressed, but no other action is
taken. The Toolbox routine TrackControl takes care of highlighting the
correct control part while the mouse is in its proximity and the button
is down. When the button is released, a late-bound exec: message is sent
to the control object, causing it to execute its action handler for the
correct part.

For the other parts of a scroll bar, however, it is desirable that a
custom routine be executed while the button is held down in the part.
For instance, while you hold down the button in the up arrow of a scroll
bar, an editor should gradually scroll the document in small increments
until the button is released. This can be accomplished by passing a
procedural argument to the TrackControl routine, but the procedure must
look like a Pascal procedure rather than a Mops word. Mops contains a
special compiler that packages Mops words in a way that makes them look
like Pascal procedures (:PROC \... ;PROC or :PPC\_PROC \... ;PPC\_PROC -
see Part II Chapter 6). We have created one of these proce-dures to
execute the action vector of a control repeatedly while the mouse button
is down, and Mops passes this procedure to TrackControl in the case of
the non-thumb scroll bar parts. Whatever actions you have defined for
these parts will be executed while the part is being selected.

We have also provided a subclass of View named Scroller, which provides
for a vertical and horizontal scroll bar along the edges of the view,
with action vectors already defined for you.

Creating control objects
------------------------

Defining a control object requires three steps. First, instantiate the
object with a phrase like:

`button saveBtn`

You should then initialize the newly created object to assign it a
position and a title. For example:

`100 250 " Save" init: saveBtn<br>`\
`' doSave actions: saveBtn`

Here we define saveBtn as a Button, specify that its top left corner
will be be at coordinates (100, 250) relative to the view that it will
appear in, and give it a title. Then we set doSave as its action word.
DoSave will be executed if the user releases the mouse button while the
mouse is within saveBtn's control rectangle. Finally, when the program
executes, we must use addView: to add the control to its parent view's
list of child views. Then when we fire up the window with new: or
getNew:, the control will automatically receive a new: message which
will cause it to create a Toolbox Control record on the heap and draw
itself.

Control action words often need a way to determine which control they
have been dispatched from. For example, a common action taken in scroll
bar arrows is to get the control's value, add some increment to it, and
put the new value in the control. This could be done in the following
manner:

`: doUpArrow  get: [ thisCtl ] 1- put: [ thisCtl ] -1 scroll: theText ;`

In this example, the word thisCtl is actually a Value that Mops provides
as a simple way for a control action word to derive its owning control
object. thisCtl contains the control object's address as any click on a
control puts its address into the value. This allows you to write very
general action words that can be assigned to several different control
objects simultaneously.

Design issues
-------------

Because late-bound messages must be sent to controls and windows, these
objects cannot be defined as nor-mal named ivars, because to do so would
fail to provide a class pointer for the runtime method lookup. If you
wish to make a control or window an ivar, you will need to define a
subclass with the General attribute, then use that class. However you
don't need to do this with Vscroll or Hscroll, since these have already
been defined as General.

Late binding is necessary because there are cases in which the Toolbox
returns the address of an object to the application, but is is
undesirable to make any assumptions about the actual class of the
object. For instance, when you click the mouse button, the Toolbox call
FindWindow tells you in which window the click occurred. This requires
that a Content: message be sent to the object, but because the
programmer is free to define subclasses of class Window, there is no way
to know ahead of time what class the window object belongs to.

Dialogs
-------

Mops implements controls in dialogs differently than in normal windows.
Since dialogs rely heavily upon resource definitions and don't usually
occasion much interaction with the items themselves other than getting
or setting values, Mops does not build dialog control items as objects,
but rather accesses them through methods in the Dialog class itself.
This saves a lot of space, and actually simplifies the interface for the
programmer.

Classes
-------

### View

------------------------------------------------------------------------

View is the generic superclass for everything that can be drawn in a
window.

+-----------------------------+---------------------------------------+
| Superclass                  | Object                                |
+=============================+=======================================+
| Source file                 | View                                  |
+-----------------------------+---------------------------------------+
| Status                      | Core (optional on 68k Mops)           |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   C                                   |
|                             | lass     Name             description |
|                             |   --                                  |
|                             | ------- ---------------- ------------ |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             |   rect      viewRect                  |
|                             |   Bounding rectangle, rel to grafport |
|                             |   rect      bounds                    |
|                             |       We use this to set the viewRect |
|                             |   ptr       \^parent                  |
|                             |    Points to parent (containing) view |
|                             |   ptr       \^m                       |
|                             | yWind         Points to owning window |
|                             |   ptrList                             |
|                             |  children         List of child views |
|                             |   x-                                  |
|                             | addr    draw             Draw handler |
|                             |   x-a                                 |
|                             | ddr    clickHndlr       Click handler |
|                             |   bool      alive?                    |
|                             |   bool      enabled?                  |
|                             |   bool      wantsCli                  |
|                             | cks?     True if we can accept clicks |
|                             |   bool      setClip?         True     |
|                             |  if we need to set the clip (default) |
|                             |   bool      canHaveFo                 |
|                             | cus?    True if we can have the focus |
|                             |                                       |
|                             | bool      measureFromMe?   True if ot |
|                             | her siblings are to use this view for |
|                             |  sibling relative justification modes |
|                             |   byte      \#updates                 |
|                             |      Counts number of pending updates |
|                             |   byte                                |
|                             |   Ljust            Left justification |
|                             |   byte      Tjust            Top      |
|                             |   byte      Rjust            Right    |
|                             |   byte      Bjust            Bottom   |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              | None                                  |
+-----------------------------+---------------------------------------+

  Inherits:   Object
  ----------- --------

  accessing
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  getViewRect:
  \^viewRect:
  bounds:
  getBounds:
  getJust:
  enabled?:
  window:
  parent:
  setWindow:
  wantsClicks:
  setClick:
  setDraw:
  setParent:
  update:
  clear:
  view positioning
  bounds>viewRect:
  childrenMoved:
  moved:
  runtime control
  Note that addview: must be called at run time, since a view's address is passed in. new: is called at run time, once this view's parent view already exists. However, new: is normally called automatically, when new: is sent to the owning Window+ object. The Window+ calls new: on its contView, and everything continues from there, since new: on a view calls new: on all its child views
  setJust:
  setBounds:
  measureFrom:
  focus:
  addview:
  new:
  release:
  classinit:
  display
  draw:
  event handling
  idle:
  MouseHere?:
  ClickedHere?:
  view\_for\_click?:
  click:
  key:
  enable:
  disable:
  drawX:

  : Methods

**Error messages** - None

### Control

------------------------------------------------------------------------

Control is a generic superclass for controls. In Carbon PowerMops, the
name is changed to be "RootCtl".

+-----------------------------+---------------------------------------+
| Superclass                  | View                                  |
+=============================+=======================================+
| Source file                 | 6Ctl zCtl                             |
+-----------------------------+---------------------------------------+
| Status                      | Core (optional on 68k Mops)           |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class      Name       description   |
|                             |   -                                   |
|                             | --------- ---------- ---------------- |
|                             | ------------------------------------- |
|                             |   int        procID     The           |
|                             | control definition ID for the Toolbox |
|                             |   int                                 |
|                             | resID      The control's resource ID |
|                             |   handle     Ct                       |
|                             | lHndl    Handle to the control record |
|                             |                                       |
|                             |  int        myValue    Contains a cop |
|                             | y of the numeric value of the control |
|                             |   int        titl                     |
|                             | eLen   Length of the control's title |
|                             |   32 byt                              |
|                             | es   title      The text of the title |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              | None                                  |
+-----------------------------+---------------------------------------+

  Inherits:   View, Object
  ----------- --------------

  accessing
  ----------------
  putResID:
  get:
  put:
  handle:
  setTitle:
  getTitle:
  exec:
  manipulation
  moved:
  hilite:
  enable:
  disable:
  hide:
  show:
  click:
  initialization
  classinit:
  new:
  getnew:
  release:
  display
  draw:

  : Methods

**Error messages** - None

### TitledCtl

------------------------------------------------------------------------

TitledCtl just adds a convenient init: method for setting up a control
with a title, where the width of the control's rect is determined by
what the title is. We assume the font will be Chicago and the height of
the control is 20. This may be overridden in subclasses as necessary.

  Superclass                    Control
  ----------------------------- -----------------------------
  Source file                   6Ctl zCtl
  Status                        Core (optional on 68k Mops)
  nowrap \|Instance variables   None (see Control)
  Indexed data                  None
  System objects                None

  Inherits:   Control, View, Object
  ----------- -----------------------

  initialization
  ----------------
  init:

  : Methods

**Error messages** - None

### Button, RadioButton, CheckBox

------------------------------------------------------------------------

Button, RadioButton and CheckBox provide support for those types of
control. The only real change from TitledCtl is the customization of
classinit: to set the appropriate proc ID so that the system will draw
the right kind of control.

  Superclass                     TitledCtl
  ------------------------------ -----------------------------
  Source file                    6Ctl zCtl
  Status                         Core (optional on 68k Mops)
  nowrap \| Instance variables   None
  Indexed data                   None

  Inherits:   TitledCtl, Control, View, Object
  ----------- ----------------------------------

  --------------------------------------------------------------
  The next three methods are for RadioButton and CheckBox only
  Set:
  Clear:
  Click:
  classinit:
  --------------------------------------------------------------

  : Methods

**Error messages** - None

### Vscroll, Hscroll

------------------------------------------------------------------------

Vscroll and Hscroll provide support for vertical and horizontal scroll
bars. Class Hscroll is set up as a sub-class of Vscroll, and just
overrides classinit: to set the ivar horiz? to true. It takes no other
special action. Several methods interrogate this ivar and do the
appropriate thing.

+------------------------------+--------------------------------------+
| Superclass                   | Control                              |
+==============================+======================================+
| Source file                  | 6Ctl zCtl                            |
+------------------------------+--------------------------------------+
| Status                       | Core (optional on 68k Mops)          |
+------------------------------+--------------------------------------+
| nowrap \| Instance variables |                                      |
+------------------------------+--------------------------------------+
|                              |   C                                  |
|                              | lass           Name      description |
|                              |   --------------- ---------          |
|                              |  ----------------------------------- |
|                              | ------------------------------------ |
|                              |   var             minval    The c    |
|                              | urrent minimum value for the control |
|                              |   var                                |
|                              |  maxval    The current maximum value |
|                              |   int             scale              |
|                              |   5 ordered                          |
|                              | -col   parts     Give the part IDs f |
|                              | or the various parts of a scroll bar |
|                              |   5 x-array       actions            |
|                              |    The corresponding action handlers |
|                              |   bool            horiz?             |
|                              |    True if this is a horizontal scro |
|                              | ll bar; false if vertical scroll bar |
+------------------------------+--------------------------------------+
| Indexed data                 | None                                 |
+------------------------------+--------------------------------------+
| System objects               | None                                 |
+------------------------------+--------------------------------------+

  Inherits:   Control, View, Object
  ----------- -----------------------

  accessing
  -----------------
  actions:
  put:
  get:
  putMax:
  putMin:
  putRange:
  initialization
  classinit:
  init:
  runtime control
  new:
  getNew:
  display
  hide:
  disable:
  enable:
  execution
  exec:

  : Methods

**Error messages** - None

### Scroller

------------------------------------------------------------------------

Scroller is a view which has support for a vertical and horizontal
scroll bar along the right hand and bottom edge respectively. We
implement it with three child views: mainView, which is the display
area, and the two scroll bars themselves. These child views are ivars of
Scroller. MainView is an instance of a one-off class, Mview. This class
has a rectangle, PanRect, which normally ought to enclose all the child
views of the Mview. The usual scenario is that PanRect is larger than
the viewRect, and scrolling amounts to shifting the child views (and
PanRect) around within the viewRect---which, from another point of
view, can be thought of as 'panning' the viewRect over the
PanRect area. Mview has appropriate methods for returning the distances
by which PanRect falls outside the viewRect area, so that the parent
Scroller can set the scroll bar values appropriately. One unusual thing
we do here is to override addView: on Scroller so that it becomes an
addView: on MainView, since this is usually what we really mean. In the
case where you want to really addView: on the Scroller, such as to add
another child view alongside one of the scroll bars, you should
sub-class Scroller with the extra views as ivars, and at run time do
addView: super as we do for the scroll bars (see the new: method).
Another approach we could have taken to implementing MainView would have
been as a pointer, with late binding. That way MainView could have been
any view subclass. That would have been more flexible, but possibly
overkill for what we usually want to do---it would have required a
more complex setting-up process, with the MainView address having to be
passed in after new: has been done. But if you need the extra
flexibility, feel free to clone Scroller and make the changes!

PanRect can obviously be very big, so we don't implement it as a
regular rect, but define a new class, BigRect, which uses vars rather
than ints for the coordinates.

+-----------------------------+---------------------------------------+
| Superclass                  | View                                  |
+=============================+=======================================+
| Source file                 | Scroller                              |
+-----------------------------+---------------------------------------+
| Status                      | Optional                              |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class     Name          description |
|                             |   -                                   |
|                             | -------- ------------- -------------- |
|                             | ------------------------------------- |
|                             |   Mview     mainView                  |
|                             |   vscroll   theVscroll                |
|                             |   hscroll   theHscroll                |
|                             |   bool      vscroll?                  |
|                             |       True if v scroll bar to be used |
|                             |   bool      hscroll?                  |
|                             |       True if h scroll bar to be used |
|                             |   bool      usePan                    |
|                             | Rect?   True if we're to use PanRect |
|                             |   var       H                         |
|                             | pan          Horizontal panning range |
|                             |   var                                 |
|                             |   Hpos          Current vertical posn |
|                             |   v                                   |
|                             | ar       Vpan          Vertical ditto |
|                             |   var       Vpos                      |
|                             |   int       Hunit         \#          |
|                             | pixels for one horizontal arrow click |
|                             |   int       Vunit         \           |
|                             | # pixels for one vertical arrow click |
|                             |                                       |
|                             |  int       Lgap          gap (in pixe |
|                             | ls) at the left end of the scroll bar |
|                             |   int       Tgap                      |
|                             |   int       Rgap                      |
|                             |   int       Bgap                      |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              | None                                  |
+-----------------------------+---------------------------------------+

  Inherits:   View, Object
  ----------- --------------

  accessing
  -----------------------------
  Vscroll:
  Hscroll:
  putPanRect:
  addview:
  >Hunit:
  >Vunit:
  >Hrange:
  >Vrange:
  >gaps:
  initialization
  classinit:
  runtime control
  new:
  manipulation
  ?Venable:
  ?Henable:
  enable:
  disable:
  moved:
  pan:
  panRight:
  panLeft:
  panUp:
  panDown
  Hpage:
  Vpage:
  1right:
  1left:
  1up:
  1down:
  pgRight:
  pgLeft:
  pgUp:
  pgDown:
  Hdrag:
  Vdrag:
  nowrap \|view\_for\_click?:

  : Methods

**Error messages** - None

### TEScroller

------------------------------------------------------------------------

TEScroller is a view which displays a TextEdit record in mainView (the
main display area). All the customary text editing operations are
supported, including (of course) scrolling. The main part of the Mops
window (excluding the stack display) is a TEScroller. The TextEdit
record is handled via an ivar theTE, which is an instance of the class
TextEdit. Class TextEdit is probably not much use in isolation, (it
would normally be used via this TEScroller class), so we won't document
it in detail here in the manual. However the source code (in file
TextEdit) should be reasonably self-explanatory.

In Carbon, TextEdit is 'deprecated' and some of the
functionalities may not work. So you should use MLTEView instead of
following clases on PowerMops.

+-----------------------------+---------------------------------------+
| Superclass                  | Scroller                              |
+=============================+=======================================+
| Source file                 | TEScroller                            |
+-----------------------------+---------------------------------------+
| Status                      | Optional                              |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class                               |
|                             |     Name                  description |
|                             |   ---------- ---                      |
|                             | ------------------ ------------------ |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             |   Te                                  |
|                             | xtEdit   theTE                 &nbsp; |
|                             |   rect       rPanRect                 |
|                             |              TE needs a rect, not a b |
|                             | igRect. So we mirror our PanRect here |
|                             |   bool       wrap?                    |
|                             |        Do we wrap the displayed text? |
|                             |   bool       s                        |
|                             | croll\_on\_insert?   Do we auto-scrol |
|                             | l on insert: or \$insert: ? You can s |
|                             | et this false if you're inserting a  |
|                             | large amount of text, and you want to |
|                             |  be able to read it while the inserti |
|                             | on is still going on, without it scro |
|                             | lling away from where you're reading |
|                             |   by                                  |
|                             | te       mouse\_was\_here?     &nbsp; |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+

  Inherits:   Scroller, View, Object
  ----------- ------------------------

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Note:** Many of the methods are just overridden versions of the methods of the superclass Scroller, where there is an additional action to perform to the TextEdit object, but where the behavior of the method is really the same. We won't list these individually, but concentrate on the methods that are new in this class.
  accessing
  textHandle:
  handle:
  size:
  getSelect:
  getSelect&lock:
  getText:
  getText&Lock:
  selStart:
  selEnd:
  getLine:
  lineEnd:
  wrapit:
  \<nowiki\>NoWrap:\</nowiki\>
  >hState:
  editing
  ?scroll:
  setSelect:
  SelectAll:
  SelectLine:
  SelectLineN:
  caretLoc:
  caretIntoView:
  key:
  insert:
  \$insert:
  chinsert:
  cut:
  copy:
  paste:
  clear:
  clearAll:
  >font:
  >fontSize:
  >color:
  >style:
  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  : Methods

### styled\_TEScroller

------------------------------------------------------------------------

styled\_TEScroller is a subclass of TEScroller, whose only variation is
that the flag is set in the TextEdit record which makes it
'styled'. This means that the text can have multiple fonts,
styles, etc. When the font, etc. is changed, only the selected text is
changed (or, if there's no selection, the change applies to whatever
text is subsequently typed).

  Superclass                    TEScroller
  ----------------------------- -----------------------
  Source file                   TEScroller
  Status                        Optional
  nowrap \|Instance variables   None (see TEScroller)
  Indexed data                  None
  System objects                

  Inherits:   TEScroller, Scroller, View, Object
  ----------- ------------------------------------

### TEView

------------------------------------------------------------------------

TEView is a simple non-scrolling TextEdit view. It has some code lifted
from TEScroller, but is much simpler. The methods are basically the same
as in TEScroller, except that the scrolling-related methods are missing.
We'll therefore omit a full listing.

+-----------------------------+------------------------------------+
| Superclass                  | View                               |
+=============================+====================================+
| Source file                 | TEView                             |
+-----------------------------+------------------------------------+
| Status                      | Optional                           |
+-----------------------------+------------------------------------+
| nowrap \|Instance variables |                                    |
+-----------------------------+------------------------------------+
|                             |   Classs     Name    description   |
|                             |   ---------- ------- ------------- |
|                             |   TextEdit   theTE   &nbsp;        |
+-----------------------------+------------------------------------+
| Indexed data                | None                               |
+-----------------------------+------------------------------------+

  Inherits:   View, Object
  ----------- --------------

------------------------------------------------------------------------

  ---------------------------------- ------------------------------------------- --------------------------------
  [ Windows](Classes_5)   [Classes](Classes)               [ Menus](Classes_7)
  &nbsp;                             [Documentation](Documentation)   
  ---------------------------------- ------------------------------------------- --------------------------------



