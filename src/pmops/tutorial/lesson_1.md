---
title: Starting Up
layout: default
---

To start Mops, if the 'Mops &fnof;' folder is not open, double-click
its icon. Double-click the icon labeled `"PowerMops"`.
The Mops window should appear on the screen.

![](/pmops/PowerMops.png "PowerMops.png")

*(If your Mops window does not look exactly like the one pictured above,
that's alright!)*

On OS X, the Apple menu contains the usual items and is not affected by
Mops. The application menu (e.g., PowerMops) contains the `About
Mops...` menu item, which will bring up a box telling you
which version of Mops you are running.

On OS 9, there is no application menu and the Apple menu contains the
`About Mops...` menu item.

The File menu is much like the File menu in other applications, but with
a special item (`Load`), which you can use later for
loading text files containing your program code.

The Edit menu has the usual items---`Cut`,
`Copy`, `Paste` and
`Clear`. These can be used in the Mops window.

The remaining menus, List, Show, and Utilities, contain many operations
that will be useful in the writing and debugging of Mops programs. More
[ useful information on these menus](Reference_1) will be
discussed later.

The Mops Window
---------------

For now, ignore the top part of the Mops window and any existing text in
the larger bottom part of the window.

In the bottom part of the window, you will see a flashing cursor, as you
might see in a word processor or text editor. Try typing something, and
you will see that this window is indeed a text editing window. You may
type and edit text here, as in any text editor.

The ENTER Key
-------------

There is one important difference however, which we have already seen in
the [Introduction](Tutorial), and that is with the use of the
ENTER key. In most text editors, ENTER is treated the same as RETURN. In
Mops, however, ENTER causes Mops commands to be executed. We'll try
this now.

We said earlier that Mops behaves like a dictionary. In other words,
when you opened `"PowerMops"` just now, the Mac
automatically loaded the basic Mops vocabulary into its memory. Each
time you type a word&\#148;any group of text characters&\#148;and press
ENTER, Mops searches through its dictionary for that word and carries
out whatever instructions are associated with it. If the word you type
is not in the current Mops dictionary, a message appears on the screen
to advise you that Mops could not find the word. We'll try it in a
moment.

If you're familiar with another computer language, note that in Mops
(as in other Forths), we use the word "word" in a different way from
normal computer terminology. A Mops word is any group of text
characters, terminated by white space (a space, tab or carriage return).
In a programming language like C, you might say
'`if(a>b)foo(bar);`' (don't worry if you don't
know what that means!) but in Mops that would be one word, because it
contained no white space. Characters which are punctuation or special
characters in other languages can be part of a Mops word, since the only
thing that terminates a word is a white space character.

Now we'll demonstrate the difference between the RETURN and ENTER keys.

First, type a nonsensical word and press RETURN\<nowiki\>:\</nowiki\>

`gnarly</code><RETURN>`

The line just sits there in the Mops window, exactly as if you'd typed
it into a text editor. Nothing else happens. Now try it again, but this
time use ENTER\<nowiki\>:\</nowiki\>

`gnarly</code><ENTER>`

`Error # -13  undefined word`\
`gnarly`\
`&nbsp;`\
`Current object:  TW    class:  MLTEFWIND`

A few things happened here. Since you used ENTER, Mops tried to
interpret gnarly as a command. The message coming back from Mops
indicated that the word you typed in was undefined. This means that the
name was not found in the dictionary&\#148;in that split second, Mops
compared the name against over 3000 words in the Mops dictionary. Mops
would also have beeped, indicating that something was wrong.

And finally, the flashing cursor appears below the message lines,
indicating that Mops is waiting for you to type another command.

Now try typing the number 999, and then press ENTER . This time no
message will appear from Mops&\#148;it has simply accepted the number
you typed in. Where is it? It has been placed on a stack. You'll be
able to see it in the upper part of the Mops window, which is a display
of the stack:

`Stack:  depth 1`\
`999`

Now type the number 888 and press ENTER. You will see that it is placed
*on top* of the number 999\<nowiki\>: \</nowiki\>

`Stack:  depth 2`\
`888`\
`999 `

The stack depth is now 2, since there are two numbers there.

You can now change the numeric base that Mops is using. Watch what
happens when you change the base from decimal (the base that Mops starts
in) to hexadecimal ("hex" for short). Type

`hex</code><ENTER>`

The stack display (the upper part of the Mops window) should change to

`Stack:  depth 2`\
`378`\
`3E7`

The numbers on the stack didn't actually change, but are now being
displayed in hexadecimal instead of decimal. (If you are not very
familiar with hexadecimal numbers, you'll find [a more complete
description in Lesson
14](Lesson_14#Decimal,_Hex,_and_Binary_Arithmetic).) To
change back to decimal, simply type

`decimal</code><ENTER>`

Now try the same thing, this time using upper-case letters (typing HEX
and DECIMAL). The results should be exactly the same. That's because
Mops is not case-sensitive, and makes no distinction between upper- and
lower-case letters when it comes to words in its dictionary. Internally,
everything is converted to upper-case.

Now type an undefined word again. The error message lines will again
appear, but also notice that the stack becomes empty. This is another
part of Mops' error handling&\#148;the stack is emptied on an error.

------------------------------------------------------------------------

  ------------------------------------------- --------------------------------- ---------------------------------
  [Introduction](Tutorial)         [Tutorial](Tutorial)   [Lesson 2](Lesson_2)
  [Documentation](Documentation)                                     
  ------------------------------------------- --------------------------------- ---------------------------------



