---
title: Strings
layout: default
---

## About this chapter

This chapter describes Mops' string-handling classes. Strings are
objects that contain variable-length sequences of text, with methods for
deletion, insertion etc. Mops' powerful string handling facility
provides an excellent base on which you can build various text-based
utilities.

  --------------------------------------------------------------------------------------
  [Inside Macintosh](http://developer.apple.com/documentation/macos8/mac8.htm)
  [Text Utilities](http://developer.apple.com/documentation/mac/Text/Text-279.html)
  [Toolbox Utilities](http://developer.apple.com/documentation/mac/Text/Text-592.html)
  **Mops:** [ Using Strings](Reference_6)
  --------------------------------------------------------------------------------------

  : Recommended reading

  -------------- ----------
  String         pString
  StrUtilities   zString+
  String+        
  -------------- ----------

  : Source files

## Using strings

Mops strings are implemented as relocatable blocks of heap that can
expand and contract as their contents change. A string object itself
contains a handle to the heap block that contains the string's data. It
also contains three other ivars which we will describe below.

Strings can be useful for a wide variety of programming needs. They can
serve as file buffers, staging areas for text to be printed on the
screen, dictionaries, or vehicles for parsing user input. You should
consider using strings for any run of bytes whose length and/or contents
are likely to change in the course of your program's execution. Strings
are not restricted to ASCII text, although that will probably be their
most common use. Note, however, that text constants can more efficiently
be implemented as SCONs or string literals (see II.5 for more
information).

Using strings is somewhat like using files, in that you must open the
string before you use it and close it when you're through. This is done
by sending a New: message to each string before you use it, to allocate
the string's heap storage, and then sending a Release: message when you
no longer need the string. Release: is actually inherited from String's
superclass, Handle, and calls the Toolbox routine DisposeHandle.

There are two classes of strings in Mops. String supports basic string
operations, such as Get:, Put: , Insert: and Add:. Class String+, a
subclass of String, adds more methods, such as searching. Both classes
are in the precompiled Mops.dic, and are really only split into two
classes since String+ has some code methods, which require the Assembler
for compilation, whereas we do require some string operations at an
earlier point in the building of the full system, before the Assembler
is available. But for all practical purposes you can treat the two
classes as a single class. This is especially true in PowerPC Mops,
where a number of the methods in String+ have been moved to String,
because they were needed earlier, and String+ has been rewritten in
high-level Mops.

Many of the String methods are built around the Toolbox Utilities
routine Munger, which is a general-purpose string-processing primitive.
You might read the IM Toolbox Utilities section on Munger to gain a
deeper understanding of what characteristics it contributes to Mops
string handling.

Strings have a current size, which is the same as the length of the
relocatable block of heap containing the string's data. Strings also
have two offets into the string data, called POS and LIM. POS marks the
'current' position, and LIM the 'current' end.
Most string operations operate on the substring delimited by POS and
LIM, which we call the active part of the string, rather than the whole
string. We also keep the size of the string (the real size, that is) in
an ivar, so that we can get it quickly without a system call.

## Communicating with other objects

While most of the method descriptions below should be self-explanatory,
several are worth additional comment. One group of String+'s methods
takes the address of another String or String+ object as one of its
parameters, and accesses the active part of this second string.

String+ also has several methods that simplify its use as a file buffer.
ReadN:, ReadRest:, ReadAll: and ReadLine?: all accept a File object as
one of the parameters, and will request that the File perform a read
into the string, setting the size of the string to the number of bytes
actually read. Doing things this way is very convenient, especially as
the file data is left in a String+ object, and is therefore subject to
all of the various manipulations that String+ can perform.

Finally, String+'s Draw: method accepts a Rect object and a
justification parameter, and draws the contents of the string as
justified text within the box specified by the rectangle.

## Translate tables

Translate tables allow very fast searching of strings for specified sets
of characters. In effect we are separating the specification of what we
are searching for from the actual search operation itself. This allows
an uncluttered and extremely fast search operation (the `scan:`,
`<scan:`, `scax:`, and `<scax:` methods of class String+), and it also
allows a very flexible (and easily extensible) choice of what to search
for. The setup time for translate tables can generally be factored out
of inner loops, or done at compile time, and is quite fast, anyway.

## Classes

### TrTbl

------------------------------------------------------------------------

We first define a class (trtbl) which is needed to define the table
mapping lower case letters to upper case. This table is then used by
some of the methods in the Trtbl class proper. However this is just an
implementation convenience --- these classes really should be
thought of as one class, so we put all the methods together here.

+-----------------------------+---------------------------------------+
| Superclass                  | (TrTbl), whose superclass is Object   |
+=============================+=======================================+
| Source file                 | StrUtilities zString+                 |
+-----------------------------+---------------------------------------+
| Status                      | Core                                  |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class       Name     description    |
|                             |                                       |
|                             | ----------- -------- ---------------- |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             |   int         count    Used internall |
|                             | y in counting characters selected, so |
|                             |  the table bytes can be set correctly |
|                             |                                       |
|                             | 256 bytes   TheTbl   The table itself |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              |                                       |
+-----------------------------+---------------------------------------+
|                             |   name    description                 |
|                             |   ------- -----------------           |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             |   UCtbl   A table which m             |
|                             | aps lower case letters to upper case, |
|                             |  and leaves everything else unchanged |
+-----------------------------+---------------------------------------+

  Inherits:   (TrTbl), Object
  ----------- -----------------

  accessing
  ----------------------
  tbl:
  selection
  clear:
  put:
  selchars:
  selchar:
  nowrap \| selcharNC:
  selRange:
  invert:
  >uc:
  operations
  transc:

  : Methods

**Error messages** - None

### String

String defines a variable-length string object with basic access methods
whose data exists as a relocatable block of heap. Size is limited only
by available memory.

+-----------------------------+---------------------------------------+
| Superclass                  | Handle                                |
+=============================+=======================================+
| Source file                 | String pString                        |
+-----------------------------+---------------------------------------+
| Status                      | Core                                  |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class   Name    description         |
|                             |   ------- ----                        |
|                             | --- --------------------------------- |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             |                                       |
|                             | Var     pos     Offset into the strin |
|                             | g of the beginning of the active part |
|                             |   Var     li                          |
|                             | m     One plus the offset of the last |
|                             |  char in the active part. Note that i |
|                             | f pos = lim, the active part is empty |
|                             | . Some methods signal an error if pos |
|                             |  > lim, or if either is negative o |
|                             | r greater than the size of the string |
|                             |   Var     size    The size of the     |
|                             | heap block containing the string data |
|                             |   Int                                 |
|                             | flags   Various flags are stored here |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              | ???                                   |
+-----------------------------+---------------------------------------+

  Inherits:   Handle, Var, Longword, Object
  ----------- -------------------------------

```
+----------------------------------------------------------------------+
| accessing                                                            |
+======================================================================+
| handle:                                                              |
+----------------------------------------------------------------------+
| pos:                                                                 |
+----------------------------------------------------------------------+
| >pos:                                                             |
+----------------------------------------------------------------------+
| lim:                                                                 |
+----------------------------------------------------------------------+
| >lim:                                                             |
+----------------------------------------------------------------------+
| len:                                                                 |
+----------------------------------------------------------------------+
| >len:                                                             |
+----------------------------------------------------------------------+
| skip:                                                                |
+----------------------------------------------------------------------+
| more:                                                                |
+----------------------------------------------------------------------+
| start:                                                               |
+----------------------------------------------------------------------+
| begin:                                                               |
+----------------------------------------------------------------------+
| end:                                                                 |
+----------------------------------------------------------------------+
| nolim:                                                               |
+----------------------------------------------------------------------+
| reset:                                                               |
+----------------------------------------------------------------------+
| step:                                                                |
+----------------------------------------------------------------------+
| <step:                                                            |
+----------------------------------------------------------------------+
| manipulation                                                         |
+----------------------------------------------------------------------+
| new:                                                                 |
+----------------------------------------------------------------------+
| ?new:                                                                |
+----------------------------------------------------------------------+
| size:                                                                |
+----------------------------------------------------------------------+
| setSize:                                                             |
+----------------------------------------------------------------------+
| clear:                                                               |
+----------------------------------------------------------------------+
| get:                                                                 |
+----------------------------------------------------------------------+
| all:                                                                 |
+----------------------------------------------------------------------+
| 1st:                                                                 |
+----------------------------------------------------------------------+
| \^1st:                                                               |
+----------------------------------------------------------------------+
| uc:                                                                  |
+----------------------------------------------------------------------+
| put:                                                                 |
+----------------------------------------------------------------------+
| ->:                                                               |
+----------------------------------------------------------------------+
| insert:                                                              |
+----------------------------------------------------------------------+
| \$insert:                                                            |
+----------------------------------------------------------------------+
| add:                                                                 |
+----------------------------------------------------------------------+
| \$add                                                                |
+----------------------------------------------------------------------+
| +:                                                                   |
+----------------------------------------------------------------------+
| fill:                                                                |
+----------------------------------------------------------------------+
| search:                                                              |
+----------------------------------------------------------------------+
| chsearch:                                                            |
+----------------------------------------------------------------------+
| object interaction                                                   |
+----------------------------------------------------------------------+
| copyto:                                                              |
+----------------------------------------------------------------------+
| mark\_original:                                                      |
+----------------------------------------------------------------------+
| print:                                                               |
+----------------------------------------------------------------------+
| dump:                                                                |
+----------------------------------------------------------------------+
| rd:                                                                  |
+----------------------------------------------------------------------+
| stream interface                                                     |
+----------------------------------------------------------------------+
| The stream methods read: and write: are meant to look the same for   |
| both strings and files (and for anything else we might think of      |
| later). By late binding to an object that supports these, we don't  |
| have to know or care exactly what it is. The object gives us bytes   |
| or accepts bytes, and tells us whether it was successful, and        |
| that's all we have to worry about.                                  |
|                                                                      |
| For read:, we only use the active part of the string. We update POS  |
| by the number of bytes transferred. If we transfer the number asked  |
| for, we return a 'no error' code of zero, otherwise -1.  |
| (We don't use true and false so as to behave the same way as        |
| files). write: is basically the same as add:. There's no way this   |
| can fail unless we run out of memory, so we always return zero       |
+----------------------------------------------------------------------+
| read:                                                                |
+----------------------------------------------------------------------+
| write:                                                               |
+----------------------------------------------------------------------+
| persistence/serialization                                            |
+----------------------------------------------------------------------+
| send:                                                                |
+----------------------------------------------------------------------+
| bring:                                                               |
+----------------------------------------------------------------------+
```

: Methods

  **Error messages**
  **"String pointer(s) out of bounds"**
  Pos was found to be greater than Lim, or either was negative or greater than the size of the string. Pos and Lim are also displayed when this message is given. We check for this error condition whenever we access the actual characters of the string. Operations such as >pos: don't perform the check --- this is for speed, and also because when we are doing manipulations on Pos and Lim we don't want to put any restriction on intermediate values.
  **"Can't do that on a string copy"**
  You attempted to insert, delete, or change the size of a string object which was flagged as a 'copy'. See above under copyto:.

### String+

------------------------------------------------------------------------

String+ adds many useful methods to String. Note that in PowerMops, some
of the methods listed here are actually defined in class String, since
we needed them at that stage for the PowerPC code generator, but this
shouldn't affect your source code at all

  Superclass                    String
  ----------------------------- -------------------
  Source file                   String+ zString+
  Status                        Core
  nowrap \|Instance variables   None (see String)
  Indexed data                  None

  Inherits:   String, Handle, Var, Longword, Object
  ----------- ---------------------------------------

```
  accessing
  -----------------------
  swapPos:
  save:
  restore:
  character fetching
  2nd:
  last:
  comparisons
  compare:
  ?:
  =?:
  ch=?:
  searching
  search:
  <search:
  sch&skip:
  chsearch:
  <chsearch:
  chsch&skip:
  chskip?:
  chskip:
  scanning
  scan:
  <scan:
  scax:
  <scax:
  translate:
  trans1st:
  >uc:
  ch>uc:
  chinsert:
  ovwr:
  chovwr:
  \$ovwr:
  repl:
  \$repl:
  sch&repl:
  replAll:
  delete:
  deleteN:
  line-oriented methods
  line>:
  nextline?:
  <nextline?:
  addline:
  \$addline:
  I/O methods
  readN:
  readLine?:
  readRest:
  readAll:
  readTop:
  \$write:
  send:
  bring:
  draw:
  printAll:

  : Methods

**Error messages** - None
```
