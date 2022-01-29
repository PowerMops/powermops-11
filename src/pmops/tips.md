---
title: Powermops Tips
layout: default
---
### Using Carbon Quick Edit (cQE).

Mops 5.3 was the first release to come bundled with Carbon Quick Edit
(cQE). In addition to running "natively" under Mac OS X, Carbon Quick
Edit now communicates properly with Mops using AppleEvents.

However, the changes needed to bring about these improvements renders
Carbon Quick Edit incompatible with older releases of PowerMops 5 and
all versions of 68k Mops (including the version bundled with modern
releases). These releases still require the older "Classic" Quick Edit
(QE).

(Should you need it, you can still download the last "Classic" Quick
Edit from: https://sourceforge.net/projects/powermops/files/QuickEdit/3.53/)

Source: Information gleaned from a <news://comp.lang.forth.mac> post by
Doug Hoffman. (March 22, 2003)

### How not to (ab)use locals.

Many older versions of Mops (including 68k Mops) will allow you to
define and execute a word that passes values on the stack to its own
local parameters.

An example of such a word might be:

`: foo  1 2 3  { one two three -- } ;`

Newer versions of Mops will compile such words without complaint, but a
stack underflow will result when executed.

This is not a bug. But, it is something you should be aware of.

Source: Blatantly plagiarized from a <news://comp.lang.forth.mac> post
by Doug Hoffman. (July 25, 2003)

### An easy way to debug class definitions.

Like most OOP languages, Mops doesn't provide a straightforward way to
access an object's ivars directly. At first glance, this would seem to
complicate debugging class definitions!

For example:

```bash
:class foo  super{ object }
int x
:m put:  ( n -- )  put: x ;m
;class
```

In this case, the ivar x within any instance of class foo would not be
publicly accessable by other objects or words in the program. (Which is
generally the desired effect, except when debugging\...)

Rather than implementing (and debugging) additional methods to
facilitate direct access to an object's ivars, try temporarily declaring
your ivars outside (and obviously before) your class definition as
normal objects. Now your variables are publicly accessible, and not
hidden within the object.

Here is the same definition as before, but with x declared outside of
the definition for debugging purposes:

```bash
int x
:class foo  super{ object }
:m put:  ( n -- )  put: x ;m
;class
```

It should now be trivial to access this object's "ivar". (When using
this technique, be careful when creating multiple instances of your
debugged class, as all instances of that object will share a single
instance of the variables defined outside the class definition!)

Once you are finished debugging your class definition, simply move your
ivars back inside the class definition.

Easy, huh?

Source: Shamelessly stolen from a <news://comp.lang.forth.mac> post by
Doug Hoffman. (February 19, 2004)

### A few ways to lookup a word.

Have you ever forgotten what a word does? Or maybe just forgotten its
name?

Here are a few "official" ways to look up a word:

1. The Mops Manual. This is generally the most comprehensive reference.
2. The Quick Edit Subject Glossary. Also a good reference, though a bit
   dated.
3. The Quick Edit online Glossary. A great way to quickly lookup a
  word's description and syntax.
4. The word locate. (Also invocable with CMD-= within Quick Edit.) This
   word will look through the Mops source files and try to find the
   actual source definition where the word was defined.
5. The Quick Edit source browser. Use CONTROL-CLICK for class names and
    method names, and CONTROL-OPTION-CLICK for colon definitions.

Yet another effective method for finding a word name is wordsWith.
Execute the following source from within a file...

```bash
need zstring+
string+ s1
string+ s2
: .id  ( xt -- )
   NAME? IF >name N>COUNT ( addr len )
           put: s2
           get: s1 search: s2
           IF all: s2 type cr 0 -> out THEN
       ELSE drop
       THEN ;
: doWith ( addr len -- )
   new: s1  new: s2  put: s1
   setToTop: theMark
   0 -> out cr
   BEGIN
       next: theMark
       ?dup
   WHILE
       link> .id
   REPEAT
   release: s1 release: s2 ;
: wordsWith
   bl word count ( addr len )
   doWith
   cr ." wordsWith done "   cr ;
```

Invoke like this:

`wordsWith similarword`

Source: Information and neat code snippet courtesy of a
<news://comp.lang.forth.mac> post from (who else?) Doug Hoffman. (April
15, 2004)

### Getting Mops to behave like a Standard Forth

Are you eager to get started using Mops as an ANS Forth?

Do this:

1. Launch "PowerMops" (in the 'Mops ƒ' folder).
2. In the Mops window, execute: `// ANSI`
3. Now save a snapshot. Execute: `save mySnapshotName`
4. Launch the PowerMops application called "mySnapshotName" (in the
   'Mops ƒ' folder) next time you use Mops.

(Remember to execute commands using the ENTER key, not RETURN.)

Mops will now behave as a Standard Forth, complete with the CORE, ERROR,
and ERROR EXT wordsets. Most of the CORE EXT wordset is there, too.

Source: Information found in the Mops Manual. (March 16, 2004)
