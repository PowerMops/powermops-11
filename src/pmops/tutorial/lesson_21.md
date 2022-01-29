---
title: FAQ
layout: default
---
Menus
=====

A Mops program uses menus which are stored as separate resources. This
is the normal Mac method for defining menus, since it makes it easy for
users to customize the menu text with a resource editor such as
[Rezilla](http://sourceforge.net/project/showfiles.php?group_id=83267).

Menus work in a way analogous to controls in that the program contains
definitions of menu handler words, which the menu selections invoke.
Menu selections are usually more powerful in a Mac program than
controls, because menus typically divert the program into a relatively
drastic change in program mode. In a typical File menu, for example,
selecting the Load\... option halts the main program, while the user's
attention is shifted to the dialog box for the selection of a file to
open. In grDemo, the primary menu, Graphics, changes the type of
graphics the program will draw, sending you from Lissajous mode to
Dragon Curves mode, for example.

Menus take a bit more setting up than controls, since there are two
separate steps. First, you have to create a resource file to contain the
menu resources. This can be done with a resource editor. For the demo
program, we have provided a resource file called 'Demo.rsrc'. This is
in the Mops &fnof; (68k Mops) or Demo folder (PowerMops). Then the
second step is to set up your Mops menu objects to correspond with the
resources --- we'll talk about this now.

Menus have an ID number associated with them. It's important to note
that this menu ID is different from the resource ID that menu resources
have. The existence of two separate ID numbers for a menu frequently
causes confusion, but this can be minimized if you normally make these
numbers the same.

Menus have an ID number associated with them. It's important to note
that this menu ID is different to the resource ID that menu resources
have. The existence of two separate ID numbers for a menu frequently
causes confusion, but this can be minimized if you normally make these
numbers the same.

By convention, the Apple menu is ID=1. We've assigned ID=2 to Graphics.
These ID numbers are stored in the menu resources, and are used by the
Mac system to identify which menu has been selected. You will see now
that in Mops there is a simple way of associating a set of actions with
a particular menu, using the menu ID number to identify the menu.

Returning to the grDemo program listing, we now define a menu object
called Grafmen, specifying that it has six members. Applemen does not
need to be created here, because Mops created it.

Next come the menu handler word definitions for Grafmen. Each one places
the cfa of the drawing word in the draw ivar of dwind. Yet another
syntax for obtaining the cfa of a word is demonstrated here:
`\['\] lj`. `\['\]` is the equivalent of
`'` **within a definition**. Each definition also places
the maximum control values for each type of drawing. Then it sends an
update message for the entire window, which draws the revised scroll bar
values and the drawing for the current settings.

`SetReps` is a word that establishes the maximum number
of repetitions for drawings created using the pen `bic`
and the polygon `anna`. You may wish to increase the
value for `bic` if you find your numeric selections on
the scroll bars Don't draw complete figures. Conversely, some drawings
may repeat on themselves after only 100 or fewer repetitions, in which
case it seems that the program is unresponsive for several seconds.

Next we set up the menus. We do this by sending an
`INIT:` message to each menu object. As you can see, this
method takes an xt list on the stack, which we specify using the
`xt{ \... }` syntax. It also takes another number, which
is the menu ID number we've already talked about. The xts in each list
refer to the words which will be executed when a selection is made from
the menu, starting from the top item. Thus if the first item of GrafMen
is selected, the word that will be executed is doLiss. This corresponds
to the item 'Lissajous' which is in the menu resource. It is your
responsibility to make sure that the words that you put in your xt lists
correspond, item for item, with the text that you have put in the items
in your menu resource. The Mac has no way of knowing that doLiss
corresponds to the text 'Lissajous'. If you get the xts in the wrong
order, you will get some interesting things happening when you make menu
selections, but it won't be what you want!

In the GrafMen resource, we have included a gray line between 'Dragon
curves' and 'Quit', which (as is customary) is the last item. Even
this gray line must have a corresponding xt in the list. You can use any
word at all here, since it will never be executed; however to make our
intention clearer we have used the word 'Null', which is a word that
does nothing anyway.

You will notice that for the Apple menu, AppleMen, we have put only two
items in the xt list.\<br /\> All right, what about all the dozens of
items that may be sitting under your Apple menu? We are actually taking
care of them, with the use of another feature of Mops --- if there
are more items in a menu than were present in the xt list, and one of
the 'excess' items is selected, the **last** xt in your list is
called. The word DoDsk handles the firing up of a DA or whatever is
under the Apple menu. In our program here it will handle everything
except the first item, which (as is normal Mac practice) is
'About\...', in this case 'About Curves'.\<br /\>

Running the Program
-------------------

The last definition of this program is that of a word that gets the
whole program running. This is where everything done so far comes
together when you type the word, `GO`.

In the first line we do a couple of things if the value
`Instld?` is False. Now this value will be True if this
is a standalone (double-clickable) application, and False otherwise,
that is if we have just loaded this program into the Mops dictionary. We
will see in the next lesson how to **install** our demo program as a
doubleclickable application.

These two actions then, are things we need to do when testing our
program in Mops. The first action is to open the resource file,
demo.rsrc, which contains the menu resources we need. In a standalone
application we don't want to carry around a separate resource file, so
our normal practice will be for any extra needed resources to be added
to the application itself with a resource editor. In this case the
resources will be available without any other file having to be opened.
On the other hand, Mach-O executable should not have its resource fork,
so we should keep separate resource files in a Mach-O standalone
application. During testing, however, it is more convenient for extra
resources to be in a separate file even in case of PEF/CFM PowerMops.

Next we fire up the Menu objects. The `GETNEW:` messages
sent to each Menu object gets the needed Menu resources and initializes
the menu. We then set up the menu bar (at the top of the screen) by
sending an `INIT:` message to our Menubar object. This
message takes the menu object addresses on the stack, followed by a
count of the number of menus.

`Bic` and `Anna` have their respective
maximum repetitions set (`SETREPS`), the max values for
the three scroll bars are put in place, and the cursor is turned off.

In the next line, we bring our window, `dWind`, to life
with a `NEW:` message. We pass in the address and length
of the text that will appear as the title of the window. The syntax
`" Curves" ` (with a space after the first
`"`) compiles the text 'Curves' into the dictionary,
and at run time pushes the address and length of the text on to the
stack, which is what we need to pass with the `NEW:`
message.

At the end, the word `EventLoop` enters an endless loop
which continually 'listens' to mouse events as they affect controls
and menus.

Last of all we define the error word. This is needed for an installed
application, since the full Mops system won't be there, so you have to
provide a word to be executed if some error arises which normally gives
a Mops error message. We customarily call this word
`CRASH`, which is a good description! Here it just beeps
twice and quits to the Finder.\<br /\> A 'real' application would need
to do something more helpful, probably with an alert box, but this is,
after all, a demo.

If you want the program to start up right away after loading, all you
have to do is enter the startup word, go, as the last word of the grDemo
source file. When the file is loaded, Mops will act on that startup word
as if you had typed it at the Mops prompt.

In Summary
----------

Now that you have seen the entire grDemo program, you should notice some
key points about Mops programs.

First come the definition of the classes of objects that appear on the
screen. The balance of the program concerns itself with defining handler
words that work their wonders when controls and menus are activated by
the mouse. It is wise to think of your program action in terms of
handler words.

And lastly comes the definition of the word that starts your program. It
calls the words you've defined in the dictionary to create objects and
let the program respond to your input.

------------------------------------------------------------------------

  ------------------------------------------- --------------------------------- -----------------------------------
  [Lesson 20](Lesson_20)           [Tutorial](Tutorial)   [Lesson 22](Lesson_22)
  [Documentation](Documentation)                                     
  ------------------------------------------- --------------------------------- -----------------------------------



