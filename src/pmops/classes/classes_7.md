---
title: Menus
layout: default
---

About this chapter
------------------

This chapter describes the Mops classes and words that allow you to
build your application's menus.

  rowspan=2 style="border:thin solid \#aaa" \| Inside Macintosh:                       [Event Manager](http://developer.apple.com/documentation/mac/Toolbox/Toolbox-28.html)
  -------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------
  [Menu Manager](http://developer.apple.com/documentation/mac/Toolbox/Toolbox-89.html)   
  style="border:thin solid \#aaa" \| Mops:                                             [ Events ](Classes_4)

  : Recommended reading

  ------------- --------------
  Menu          zMenu
  MenuMod.txt   zMenuMod.txt
  ------------- --------------

  : Source files

Using Menus
-----------

Mops menus integrate the Toolbox concept of a menu within an object that
stores Mops words to be executed when the user makes a particular
choice. The Mops event object, fEvent, takes care of actually pulling
down the menus by tracking the mouse and calling the menu manager
whenever there is a click in the menu bar. FEvent also handles
key-equivalents for you automatically if you declare the key equivalents
in your item text. If the user makes a choice, a message is sent to the
Mops menuBar object telling it to find the menu affected and execute the
cell indexed by the item number chosen. Menus are a subclass of X-Array,
which provides the ability to execute one of a list of xts by index.

There are two steps to defining the menus for your application. You must
first create an object of class Menu for each menu in the application,
and allocate as many indexed cells to each menu object as there are
items to be selected. For example:

`7 menu FileMen  \  creates a menu object that can have up to 7 items`

However, if you have many menu items with similar behavior, such as in a
font menu, you only need to provide one indexed cell for that behavior,
provided it is the last. This is because if a menu item is selected
whose number is beyond the last indexed cell of the menu object, no
error occurs, but the last indexed cell is executed. This feature is
useful for the Apple menu as well. Note that even divider lines in your
menu count as items, and you have to leave space for them, and allocate
them an xt, in your menu (you can just use NULL).

Then, in ResEdit, you create menu resources for your menus. This is
quite easy to do. You will need to assign a resource ID for your menus
in ResEdit---it is quite satisfactory to give the Apple menu ID 1,
the Edit menu ID 2 and so on. Then, when you initialize each menu object
in Mops with the init: method, you will pass the corresponding resource
ID, along with an xt list giving the word to be executed corresponding
to each menu item. Finally, at run time you send getnew: to each menu
object to cause the menu to appear.

Menu items which call hierarchical menus need to have a special
character appended to the name of the menu item. See IM-IV for more
info.

After your menus are set up, various methods are available to change
their characteristics. getitem: and setitem: fetch and store the item
string for a given item. Note that while the Menu Manager numbers items
from 1 to N instead of starting from 0, in Mops we follow our normal
convention of starting from 0. This means that the xt for the word to be
executed when item N is selected (using our numbering) will be item
number N in the xt list. The Toolbox automatically highlights (turns
black) any menu title for which an item is chosen, and the normal:
method can be used to unhighlight any menu. Class Menu automatically
does a normal: after a handler returns, but some never return if they do
a BECOME or an ABORT. Class Menu's enableItem: and disableItem: methods
are useful during activate events, when you should ensure that only
those menu items are enabled that are appropriate for the current window
and the current state. If you want to enable or disable an entire menu,
use enable: and disable:. To enable or disable the entire menu bar, use
MBar's enable: and disable: methods. Finally, check: and unCheck: (in
Menu) control the display of a checkmark next to an item.

Mops defines a single instance of class MBar, called menuBar. Because
forward references to this object were necessary, menuBar is vectored
through a Value. As a result, any messages that you send to the menuBar
object will be late-bound. You should rarely need to communicate with
MenuBar directly, because most of the methods important to an
application are in class Menu.

Classes
-------

### Menu

------------------------------------------------------------------------

Class menu creates objects that associate Mops words with each of the
items in a Macintosh menu. The Mops word associated with an item is
executed when that item is chosen by the user.

+------------------------------+--------------------------------------+
| Superclass                   | X-Array                              |
+==============================+======================================+
| Source file                  | Menu, MenuMod.txt, zMenu,            |
|                              | zMenuMod.txt                         |
+------------------------------+--------------------------------------+
| Status                       | Core                                 |
+------------------------------+--------------------------------------+
| nowrap \| Instance variables |                                      |
+------------------------------+--------------------------------------+
|                              |   Class   Name    description        |
|                              |   ------- -------                    |
|                              | ------------------------------------ |
|                              |   int                                |
|                              |     resID   Resource ID of this menu |
|                              |   var     Mhndl                      |
|                              |   Handle to the menu's heap storage |
+------------------------------+--------------------------------------+
| Indexed data                 | 4-byte cells (must be xts of valid   |
|                              | Mops words)                          |
+------------------------------+--------------------------------------+
| System objects               | None                                 |
+------------------------------+--------------------------------------+

  Inherits:   X-Array, Array, Indexed-Obj, Object
  ----------- -------------------------------------

  initialization
  --------------------------------
  putResID:
  init:
  runtime control
  SetNib:
  new:
  getNew:
  CreateFormNib:
  insert:
  addRes:
  release:
  operations on the whole menu
  normal:
  SetTitle:
  operations on individual items
  getItem:
  putItem:
  insertItem:
  deleteItem:
  addItem:
  add:
  enableItem:
  disableItem:
  openDesk:
  exec:
  check:
  unCheck:
  SeparateLine:
  SetCommandKey:
  accessing
  ID:
  handle:

  : Methods

**Error messages** \-- **"You must send me a new: message
first"**

An operation was attempted before the menu was created with the Toolbox.

### AppleMenu

------------------------------------------------------------------------

Subclass AppleMenu facilitates standard Apple Menu support, by filling
the menu with all the DAs/Apple Menu items at getNew: time.

+------------------------------+--------------------------------------+
| Superclass                   | Menu                                 |
+==============================+======================================+
| Source file                  | MenuMod.txt zMenuMod.txt             |
+------------------------------+--------------------------------------+
| Status                       | Core                                 |
+------------------------------+--------------------------------------+
| nowrap \| Instance variables | none                                 |
+------------------------------+--------------------------------------+
| Indexed data                 | 4-byte cells (must be xts of valid   |
|                              | Mops words)                          |
+------------------------------+--------------------------------------+
| System objects               |                                      |
+------------------------------+--------------------------------------+
|                              |   Name       description             |
|                              |   ----------                         |
|                              | ------------------------------------ |
|                              | ------------------------------------ |
|                              | ------------------------------------ |
|                              | ------------------------------------ |
|                              |   AppleMen                           |
|                              |   Apple menu usable by any applicati |
|                              | on. The first item executes AboutVec |
|                              | , a vector which can be set to your  |
|                              | 'About\...' handler word |
+------------------------------+--------------------------------------+

  Inherits:   Menu, X-Array, Array, Indexed-Obj, Object
  ----------- -------------------------------------------

  accessing
  -----------
  getNew:

  : Methods

**Error messages** - **"You must send me a new: message
first"**

An operation was attempted before the menu was created with the Toolbox.

### EditMenu

------------------------------------------------------------------------

Subclass EditMenu facilitates standard DA support. The exec: method
first calls SystemEdit so any active DA gets a go at it.

  Superclass                     Menu
  ------------------------------ ------------------------------------------------
  Source file                    MenuMod.txt
  Status                         Core
  nowrap \| Instance variables   none
  Indexed data                   4-byte cells (must be xts of valid Mops words)
  System objects                 None

  Inherits:   Menu, X-Array, Array, Indexed-Obj, Object
  ----------- -------------------------------------------

  accessing
  -----------
  exec:

**Error messages** - **"You must send me a new: message
first"**

An operation was attempted before the menu was created with the Toolbox.

### PopupMenu

------------------------------------------------------------------------

Class PopupMenu provides support for popUp menus in dialogs. (If you
need one somewhere else, you will have to define a subclass with
different init: and normal: methods.) The sequence for setting up a
popup menu is first to initialize the menu and dialog objects via init:
methods---this may be done at compile time. At run time, send
getnew: to the dialog and menu, then send a link: to the menu, passing
the address of the dialog object. See the example code at the end of the
file PopupMenu. The handling of popup menus is notoriously tricky, but
we handle most of the mundane details for you. From System 7 onwards
there is a system control (CDEF) that you can put into your dialogs with
ResEdit in much the same way as you add buttons and checkboxes. See IM
ToolBox Essentials - Controls for details.

At present, 68k Mops only.

+------------------------------+--------------------------------------+
| Superclass                   | Menu                                 |
+==============================+======================================+
| Source file                  | PopupMenuMod.txt, PopupMenu          |
+------------------------------+--------------------------------------+
| Status                       | Optional                             |
+------------------------------+--------------------------------------+
| nowrap \| Instance variables |                                      |
+------------------------------+--------------------------------------+
|                              |   Class     Name       description   |
|                              |   --------- -------                  |
|                              | --- -------------------------------- |
|                              | ------------------------------------ |
|                              |   string+   ITEMTEXT                 |
|                              | Current text displayed in pop-up box |
|                              |   int       ITEM\#     Cur           |
|                              | rent item \# displayed in pop-up box |
|                              |   int       BO                       |
|                              | X\#      Dialog item\# of pop-up box |
|                              |   int       H1\#                     |
|                              |        Dialog item\# of pop-up title |
|                              |   rect      H1RECT                   |
|                              |   rect      POPUPBOX                 |
|                              |   dicAddr                            |
|                              |   \^DLG      Points to owning dialog |
|                              |   ptr       F-LIN                    |
|                              | K     Forward link for chain of pop- |
|                              | up menus belonging to the one dialog |
+------------------------------+--------------------------------------+
| Indexed data                 | 4-byte cells (must be xts of valid   |
|                              | Mops words)                          |
+------------------------------+--------------------------------------+
| System objects               | None                                 |
+------------------------------+--------------------------------------+

  Inherits:   Menu, X-Array, Array, Indexed-Obj, Object
  ----------- -------------------------------------------

  accessing
  -----------------
  getText:
  putText:
  item\#:
  putItem\#:
  putTitle\#:
  put\^dlg:
  f-link:
  set-f-link:
  box\#:
  runtime control
  init:
  getNew:
  link:
  operations
  normal:
  drawText:
  drawBox:
  hit:

  : Methods

**Error messages** - **"You must send me a new: message
first"**

An operation was attempted before the menu was created with the Toolbox.

### Mbar

------------------------------------------------------------------------

MBar is used to create a single system object, MenuBar. It maintains the
list of menu objects and their IDs, and is chiefly useful at startup to
build and draw the menu bar via messages sent by the menu text loader.

+-----------------------------+---------------------------------------+
| Superclass                  | Object                                |
+=============================+=======================================+
| Source file                 | Menu zMenu                            |
+-----------------------------+---------------------------------------+
| Status                      | Core                                  |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class        Name    description    |
|                             |   ----------                          |
|                             | -- ------- -------------------------- |
|                             |   24 W                                |
|                             | ordCol   IDs     The list of menu IDs |
|                             |   24 Array                            |
|                             |      Menus   An array of menu objects |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              |                                       |
+-----------------------------+---------------------------------------+
|                             |   Name      description               |
|                             |   ------                              |
|                             | --- --------------------------------- |
|                             |   menu                                |
|                             | Bar   System-wide menu bar (vectored) |
+-----------------------------+---------------------------------------+

  Inherits:   Object
  ----------- --------

  accessing
  -----------
  clear:
  add:
  new:
  init:
  draw:
  enable:
  disable:
  exec:
  click:
  key:

  : Methods

**Error messages** - None

------------------------------------------------------------------------

  -------------------------------------------- ------------------------------------------- -----------------------------------
  [Views and Controls](Classes_6)   [Classes](Classes)               [ Graphics](Classes_8)
  &nbsp;                                       [Documentation](Documentation)   
  -------------------------------------------- ------------------------------------------- -----------------------------------



