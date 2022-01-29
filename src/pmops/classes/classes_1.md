---
title: Basic Data Structure
layout: default
---

## About this chapter

This chapter describes the Mops classes and words providing you with the
fundamental structures that are necessary for programming in Mops. Most
of these correspond to well established data structures that are
available in most programming languages, but a few of them are unique to
Mops.

### Recommended reading
*  [Inside Macintosh](http://developer.apple.com/documentation/macos8/mac8.html)
* [Memory Manager](http://developer.apple.com/documentation/mac/Memory/Memory-56.html)
*  [Programming in Assembly Language](http://developer.apple.com/documentation/mac/IAC/IAC-10.html)


## Using the basic data structures

This chapter will discuss the primitive classes that Mops provides as
building blocks out of which you can assemble the data structures
necessary to build your application. These classes are useful both as
instance variables of more complex classes and as general classes from
which you can derive more specialized subclasses. The classes that will
be covered here include:

```
  Object      DicAddr       Ordered-Col
  Bytes       X-Addr        WordCol
  Int         Indexed-Obj   ByteCol
  Uint        bArray        X-Col
  Longword    wArray        Sequence
  Var         Array         HandleList
  Handle      X-Array       Dic-Mark
  ObjHandle   Obj\_array    Resource
  Ptr         (Col)         
```

## Using Class Object and Bytes

The root of all classes is class Object. It has no data, but does have a
set of behaviors that are generally applicable to any object, regardless
of its format. A class that has no particular inheritance path should
make Object its superclass, which will cause it to inherit the general
properties that all objects should have. Addr: returns the base address
of an object. (However you can normally just name an object without
sending it an explicit message, and this has the same effect of causing
its address to be pushed. The only exception is the Large\_obj\_array
class.) Other methods in Object provide a hex dump of an object's data
and access to an object's class pointer.

Bytes is not really a class, but rather is a Mops word that enables you
to allocate a certain number of bytes as an instance variable within a
class definition. Bytes is chiefly useful when mapping parts of Toolbox
data structures that only need to be allocated but not accessed. Bytes
actually creates an ivar of class Object, so you can use Object's
methods, such as Addr:, on an ivar created with Bytes. As an example,
class Window uses Bytes to allocate portions of the window record that
Mops doesn't need direct access to. Remember, however, that Bytes is
not an indexed type like barray---it's an Object. If you send it a
length: message you'll always get zero, which is the length of
Object---this surely won't be what you want!

## Using the scalar classes

Scalar classes represent non-indexed objects which hold simple integer
or pointer data. A Byte, Int or Var can hold an 8,16, or 32-bit signed
integer respectively.

## Using the array classes

There are three basic array classes in Mops - bArray, wArray and Array,
having 1, 2 and 4-byte indexed cells. We have defined a basic set of
array methods that are shared by these classes, and must be redefined if
you create array classes with different indexed widths. Most array
messages require that an index be on the stack that reflects which cell
of the array the operation refers to (indexes begin with 0).

We have defined a generic superclass for all arrays, called Indexed-Obj.
This class defines some general methods which are independent of the
indexed width. These are \^Elem:, which returns the address of an
indexed cell of any width, using a runtime lookup, Limit:, which tells
you the maximum number of elements allocated to an object; Width:, which
tells you the width of an object's indexed cells; ClearX:, which sets
all of an array's cells to 0; and IXAddr:, which leaves the address of
the 0th indexed cell.

There is also a group of methods that must be redefined for each array
class having a different width. These include: At:, which fetches the
contents of the cell at an index; To: which stores to the indexed cell
at an index, +To:, which increments an indexed cell by a value; -To:,
which decrements an indexed cell, and Fill:, which fills an array with a
value. This group is shared by the three array classes that are
predefined in Mops, and is documented later in this section. We also
override \^Elem: in these three classes to give greater speed, since we
know the indexed width at compile time.

Because class Array has 4-byte cells, it can be used to hold pointers to
various kinds of structures in a way that the other array classes
cannot.

We have defined several classes which make it easy to handle groups of
objects. By multiply inheriting Obj\_array with any other class, you
create an array of objects of that class. You then use the select:
method to make one of those objects 'current', and can then
access the 'current' object exactly as if it were a normal
object, i.e. not part an array at all.

Class X-Array adds to the basic Array the ability to execute one of its
indexed cells, assuming that it holds the xt of a Mops word. X-Array is
a very important class in Mops, because its behavior is used throughout
the system itself to provide control dispatching by index, as in Menu
and Event. The classinit: method in X-Array sets each indexed cell to
Null so the object will behave gracefully if you fail to initialize it
in your application. Use X-Array whenever you need to execute one of a
group of Mops words based on a series of contiguous indices.

HandleList is an extremely useful class in Mops. It's used for sets of
heap-based objects, accessed through ObjHandles. HandleList doesn't
inherit from Obj\_Array, but uses the same idea of a select: method to
make a particular one of its ObjHandles 'current'. Any
number of objects can be in a HandleList---the only limitation is
the amount of memory available.

Here's an example of how a HandleList could be used to implement a set
of four windows, accessible by index:

```bash
HandleList Windows
: CreateWindows
4 0 DO  ['] window newObj: windows  LOOP ;
\ Resize window at index 2:
2 select: windows  300 100 size: [ obj: windows ]
```

Notice how, once we have used select: to choose which ObjHandle in the
HandleList we are referring to, we can then send other methods to the
HandleList exactly as if it were a single ObjHandle. We can send
late-bound messages to one of the windows, as in the size: message at
the bottom, by using the obj: method defined for the ObjHandle class.
Actually, the objects in windows could be of any class that accepted a
size: message, due to the late binding. When you are finished with
Windows, you can release all its heap storage simply by sending the
message

`release: windows`

If you look at the source for the HandleList class, you will see that
release: causes each of the ObjHandles to be selected in turn, and
releaseObj: sent to each one. If you now look at the source for
ObjHandle, you will see that releaseObj: causes release: to be sent to
the object pointed to by the handle, so that it will release any heap
storage it has allocated, then finally release: super is called, which
releases the heap block pointed to by the handle (that is, the object
itself). Thus, by simply sending release: to a HandleList, we are
releasing all the heap storage it owns. Incidentally, if you want to
just release one of the handles in a HandleList, use select: followed by
releaseObj:---this is the reason we have defined releaseObj:
separately from release:.

## Using Collections

Class Ordered-Col is another important class in Mops. It is implemented
by multiply inheriting the (Col) class with one of the array classes. It
adds to the array class the concept of a current length and the ability
to add to and remove from the list. This list also has many of the
properties of a stack, which are exploited in such classes as FileList
(see Chapter III.3). When you create an Ordered-Col (O-C), you must
specify, as with all indexed classes, the number of elements to allocate
in the dictionary (or the heap). O-C uses this as a maximum up to which
its variable-length list will grow via the Add: method. The advantage of
an O-C is that you can add values to the end of the list without
maintaining the index yourself, only the sequence in which to add. You
might want to utilize the O-C's properties only while initializing the
object, after which it is simply used as an Array. WordCol is an
Ordered-Col with 16-bit cells rather than 32-bit.

## Persistent objects

"Persistent Objects" are objects that can stick around after
your program quits, and be accessed again the next time your program
runs.

This of course means that when they're not being used, they must live
in a file somewhere. In implementing persistent objects, then, we need
to be able to streamline the process of writing an object out to a file
and reading it back.

Now it should be clear from this, that one of the key features of
persistent objects is that these objects can be serialized---that
is, no matter what their structure, they can be converted to a stream of
bytes suitable for writing to a file or being read back. This is why the
concept of persistent objects is always linked to the problem of how to
serialize an object.

Our approach to serialization is straightforward, and has two parts to
it.

1. We generalize the idea of a file slightly, and say that any class
    that supports file-style READ: and WRITE: methods, is supporting the
    'stream' methods. This idea is really the same as an
    interface---we could say that READ: and WRITE: are part of the
    stream interface. Although Mops doesn't have a formalized interface
    scheme in its syntax, the idea is really the same---it's just
    informal in Mops.
2. We assume that each object knows how to serialize itself. The
    serialization methods are SEND: and BRING:. These both take one
    parameter, the address of a stream object. SEND: is expected to send
    late-bound WRITE: messages to the stream, to write out the bytes of
    the object. The class can choose whatever format it likes, so long
    as the process can be reversed by the BRING: method. This method
    sends late-bound READ: messages to the stream, and is expected to
    reconstitute the object that originally received SEND:

We provide these methods in all the standard Mops classes. Class Object
has the most basic implementation, and just writes and reads the local
ivars and indexed area. This will work for simple objects (those that
don't have other data outside these local areas).

We write the non-indexed and indexed data separately, to make these
operations less sensitive to platform-related alignment questions. On
the PowerPC the indexed area starts out 4-byte aligned, but only 2-byte
aligned on the 68k. Of course alignment issues within the local ivars
might rule out cross-platform compatibility anyway, but there will be
many situations in which what we do in class Object will be quite
sufficient, and in these cases no separate SEND: or BRING: will be
needed.

As Handle objects have data outside the local area, class Handle needs a
separate SEND: and BRING:. If you look at the source file Struct,
you'll see that we transfer the length, then the bytes in the handle.
There is no local ivar data except the Handle itself, which doesn't
need to be saved or restored---the data stored in the Handle is what
matters.

For the class ObjHandle, we could just inherit from Handle, which would
mean our object gets saved as an undifferentiated string of bytes. This
wouldn't be good, since we have to assume that the object knows how to
send itself properly. So we send the name of the class as characters,
then send SEND: to the object itself. At BRING: time, we look up the
classname, create a new object, then send BRING: to it.

A nice thing about this scheme is that if the object doesn't contain
any addresses, it can be reconstituted after a Mops recompilation, and
often even over a platform change.

In class HandleList, we first send 2 bytes with the number of items,
then SELECT: each item and send SEND: to it. We use a special 2-byte
marker between each of these objects we send to the stream, so that
BRING: can check that we haven't got out of sync.

These implementations of SEND: and BRING: in the basic Mops classes may
well cover the majority of your needs. If your classes need something
extra, you should have enough ideas there to be able to work out what to
do.

There is a final step to the implementation of persistent objects. Once
an object implements SEND: and BRING: correctly, we have to link it to a
file. We have provided a file 'Container' in the "More
Classes" folder which shows how this might be done. Class
Container is a subclass of File, and has an INIT: method in which you
pass in the address of an object. Then when you pass OPEN: and SAVE:
messages to the Container, the Container sends BRING: and SEND: messages
respectively, to the object.

The fact that we only link one object to the Container doesn't mean
that the number of objects in the Container is in any way limited, since
the object can be a HandleList which can be a collection of an arbitrary
number of objects from arbitary classes. We've seen already that
HandleList implements SEND: and BRING: properly (in a way that accounts
for the objects in the list being of arbitrary classes).

So, after you have sent OPEN: to a Container, all the objects in the
container will have been read into memory. And when you send SAVE:, they
are all written out to the file. If you don't want all your objects to
be in memory at the same time, you can use several containers.

This scheme is very flexible, and will probably be sufficient for most
needs.

## Classes
-------

### Object

------------------------------------------------------------------------

Object contains behavior appropriate to all objects in the system. Every
superclass chain ultimately traces back to Object.

  Superclass           Meta
  -------------------- ----------------
  Source file          Class, qpClass
  Status               Core
  Instance variables   None
  Indexed data         None
  System objects       None

  --------------------------- --------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  class:                      ( \-- addr )                Returns a pointer to the object's class
  .id                         ( \-- )                     Types the object's name
  .class                      ( \-- )                     Types the name of the object's class
  addr:                       ( \-- addr )                Returns the base address of an object's data
  length:                     nowrap \| ( \-- \#bytes )   Returns the length of the object's ivar data area
  copyto:                     ( \^obj \-- )               \^obj is a pointer to another object. This method copies that object's ivar data to this object. Be careful using this method as no check is done that the objects are of the same class. However this method can be very useful in some situations
  classinit:                  ( \-- )                     This a very special method. Whenever an object is created, Mops sends it a classinit: message so that it will initialize itself to reasonable values, or whatever the programmer desires all objects of that class to do when created. This method corresponds to a constructor method in C++. In class Object, it is a do-nothing method, allowing any subclass to override it as appropriate. By convention, init: is used for explicit programmatic initialization and customization thereafter,and new: is used to set up the toolbox-interface portion of toolbox objects (such as making a window known to the Macintosh window manager)
  release:                    ( \-- )                     This method does nothing in class Object itself. However, in general you should send release: to an object before you FORGET it or deallocate its memory. release: will cause an object to release any heap memory it has allocated and do any other cleaning up which may be necessary. This method corresponds to a destructor method in C++
  dump:                       ( \-- addr )                Dumps the dictionary entry for the object in a hex format
  print:                      ( \-- addr )                Dumps the dictionary entry for the object in a hex format. This provides a default print: method for objects that don't have a more sophisticated form of displaying their data
  persistence/serialization                               
  send:                       ( \^obj \-- )               Sends a write: message to the passed-in object, to write out this object's data as a stream of bytes
  bring:                      ( \^obj \-- )               Sends a read: message to the passed-in object, to read in this object's data as a stream of bytes
  --------------------------- --------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  : Methods

**Error messages** - None

### Longword

------------------------------------------------------------------------

Longword provides storage for 32-bit quantities. It is not intended to
be used directly, but is a generic superclass for Var , Handle, Ptr and
DicAddr.

+------------------------------+--------------------------------------+
| Superclass                   | Object                               |
+==============================+======================================+
| Source file                  | Struct                               |
+------------------------------+--------------------------------------+
| Status                       | Core                                 |
+------------------------------+--------------------------------------+
| nowrap \| Instance variables |                                      |
+------------------------------+--------------------------------------+
|                              |   Class     Name   description       |
|                              |   --------                           |
|                              | - ------ --------------------------- |
|                              |   4 byte                             |
|                              | s   Data   Allocates 32 bits of data |
+------------------------------+--------------------------------------+
| Indexed data                 | None                                 |
+------------------------------+--------------------------------------+
| System objects               | None                                 |
+------------------------------+--------------------------------------+

  Inherits:   Object
  ----------- --------

  accessing
  ----------------
  get:
  put:
  ->:
  clear:
  initialization
  classinit:
  display
  print:

  : Methods

**Error messages** - None

### Var

------------------------------------------------------------------------

Var provides storage for 32-bit numeric quantities

  Superclass                    Longword
  ----------------------------- ---------------------
  Source file                   Struct
  Status                        Core
  nowrap \|Instance variables   None (see Longword)
  Indexed data                  None
  System objects                None

  Inherits:   Longword, Object
  ----------- ------------------

  accessing
  -----------
  +:
  -:

  : Methods

**Error messages** - None

### Int, Uint

------------------------------------------------------------------------

Provides storage for 16-bit quantities---signed (Int) and unsigned
(Uint ).

+--------------------+-----------------------------------------------+
| Superclass         | Object                                        |
+====================+===============================================+
| Source file        | Struct, pStruct                               |
+--------------------+-----------------------------------------------+
| Status             | Core                                          |
+--------------------+-----------------------------------------------+
| Instance variables |                                               |
+--------------------+-----------------------------------------------+
|                    |   Class     Name   description                |
|                    |   --------- ------ -------------------------- |
|                    |   2 bytes   data   Room for 16 bits of data   |
+--------------------+-----------------------------------------------+
| Indexed data       | None                                          |
+--------------------+-----------------------------------------------+
| System objects     | None                                          |
+--------------------+-----------------------------------------------+

  Inherits:   Object
  ----------- --------

  accessing
  -----------
  get:
  put:
  ->:
  clear:
  int:
  +:
  -:
  display
  print:

  : Methods

**Error messages** - None

### Byte, Ubyte

------------------------------------------------------------------------

Provides storage for 8-bit quantities---signed (Byte) and unsigned
(Ubyte).

+--------------------+----------------------------------------------+
| Superclass         | Object                                       |
+====================+==============================================+
| Source file        | Struct                                       |
+--------------------+----------------------------------------------+
| Status             | Core                                         |
+--------------------+----------------------------------------------+
| Instance variables |                                              |
+--------------------+----------------------------------------------+
|                    |   Class     Name   description               |
|                    |   --------- ------ ------------------------- |
|                    |   1 bytes   data   Room for 8 bits of data   |
+--------------------+----------------------------------------------+
| Indexed data       | None                                         |
+--------------------+----------------------------------------------+
| System objects     | None                                         |
+--------------------+----------------------------------------------+

  Inherits:   Object
  ----------- --------

  accessing
  -----------
  get:
  put:
  ->:
  clear:
  display
  print:

  : Methods

**Error messages** - None

### Bool

------------------------------------------------------------------------

Provides storage for boolean values (true or false). These are stored in
8 bits.

  Superclass           Byte
  -------------------- -----------------
  Source file          Struct, pStruct
  Status               Core
  Instance variables   None (see Byte)
  Indexed data         None
  System objects       None

  Inherits:   Byte, Object
  ----------- --------------

  accessing
  -----------
  put:
  get:
  set:
  clear:
  display
  print:

  : Methods

**Error messages** - None

### Handle

------------------------------------------------------------------------

Handle adds to Longword methods useful for manipulating relocatable
blocks of heap.

  Superclass                    Var
  ----------------------------- ---------------------
  Source file                   Struct
  Status                        Core
  nowrap \|Instance variables   None (see Longword)
  Indexed data                  None
  System objects                None

  Inherits:   Var, Longword, Object
  ----------- -----------------------

  accessing
  --------------
  ptr:
  nptr:
  manipulation
  clear:
  setSize:
  size:
  new:
  release:
  lock:
  unlock:
  locked?:
  getState:
  setState:
  moveHi:
  ->:

  : Methods

**Error messages** - **"Set handle size failed"**

Non-0 return from memory manager on a SetHSize system call, probably
resulting from a setSize: or ->: call with insufficient memory
available.

### ObjHandle

------------------------------------------------------------------------

ObjHandle adds to Handle methods for manipulating heap-based objects.

  Superclass                    Handle
  ----------------------------- ------------------
  Source file                   Struct
  Status                        Core
  nowrap \|Instance variables   None
  Indexed data                  None
  System objects                Many and various

  Inherits:   Handle, Var, Longword, Object
  ----------- -------------------------------

  accessing
  ---------------------------
  obj:
  manipulation
  newObj:
  releaseObj:
  display
  print:
  dump:
  persistence/serialization
  send:
  bring:

  : Methods

**Error messages** - None

### Ptr

------------------------------------------------------------------------

Ptr adds to Longword methods useful for manipulating non-relocatable
blocks of heap. Note: it is normally better to use Handles rather than
Ptrs, to avoid the heap becoming fragmented with blocks which cannot be
moved.

  Superclass                    Longword
  ----------------------------- ---------------------
  Source file                   Struct
  Status                        Core
  nowrap \|Instance variables   None (see Longword)
  Indexed data                  None
  System objects                None

  Inherits:   Longword, Object
  ----------- ------------------

  manipulation
  --------------
  new:
  release:
  clear:
  nil?:

  : Methods

**Error messages** - **"new: on a pointer couldn't get enough
heap"**

### DicAddr

------------------------------------------------------------------------

Dicaddr is used for storing the address of a location within the
dictionary. If the dictionary is saved and reloaded in a subsequent run,
the address will still be valid. This is accomplished by storing the
address in a relocatable format. Don't depend on details of this
format, in case it changes.

  Superclass                    Longword
  ----------------------------- ---------------------
  Source file                   Struct
  Status                        Core
  nowrap \|Instance variables   None (see Longword)
  Indexed data                  None
  System objects                None

  Inherits:   Longword, Object
  ----------- ------------------

  accessing
  -----------
  get:
  put:
  print:

  : Methods

**Error messages** - **"you can't store a module address outside
the module"**

You attempted to put: the address of a location in a module, into a
DicAddr located outside the module. This is illegal, since the module
may have moved or been purged from memory when the DicAddr is next
accessed.

### X-Addr

------------------------------------------------------------------------

An X-Addr is almost the same as a DicAddr. The only difference is that
it is intended for dictionary addresses which are the execution tokens
of Mops words, and so may be executed. (Note that in Mops an execution
token is an address of a word, whereas in other Forth systems it may not
be an actual address.) Thus we again use our relocatable format. The
only difference to a DicAddr is that there is an exec: method, and no
get: method.

  Superclass                    Longword
  ----------------------------- ---------------------
  Source file                   Struct
  Status                        Core
  nowrap \|Instance variables   None (see Longword)
  Indexed data                  None
  System objects                None

  Inherits:   Longword, Object
  ----------- ------------------

  -----------
  accessing
  exec:
  put:
  -----------

  : Methods

**Error messages** - **"you can't store a module address outside
the module"**

See DicAddr.

### Indexed-Obj

------------------------------------------------------------------------

This class is the generic superclass for all arrays. It defines the
general indexed methods, which apply regardless of indexed width.

  Superclass                    Object
  ----------------------------- -------------------------------
  Source file                   Struct,Struct1
  Status                        Core
  nowrap \|Instance variables   None
  Indexed data                  None (supplied by subclasses)
  System objects                None

  Inherits:   Object
  ----------- --------

  accessing
  --------------
  \^elem:
  limit:
  width:
  ixAddr:
  manipulation
  clearX:

  : Methods

**Error messages** - **"Index or value out of range"**

One of the methods taking an index found the index to be out of range
for this array.

### Basic array classes - bArray, wArray, Array

------------------------------------------------------------------------

These basic access methods are implemented for the three array classes
predefined in Mops.

  Superclass                    Indexed-Obj
  ----------------------------- --------------------
  Source file                   Struct, Struct1
  Status                        Core
  nowrap \|Instance variables   None
  Indexed data                  1, 2, 4-byte cells
  System objects                None

  Inherits:   Indexed-Obj, Object
  ----------- ---------------------

  accessing
  -----------
  at:
  to:
  +to:
  -to:
  fill:

  : Methods

**Error messages** - **"Index or value out of range"**

As for Indexed-Obj.

### X-Array

------------------------------------------------------------------------

X-Array is an Array with the ability to execute its indexed data as xts
of Mops words.

  Superclass                    Array
  ----------------------------- --------------
  Source file                   Struct
  Status                        Core
  nowrap \|Instance variables   None
  Indexed data                  4-byte cells
  System objects                ???

  Inherits:   Array, Indexed-Obj, Object
  ----------- ----------------------------

  accessing
  ----------------
  exec:
  put:
  actions:
  display
  print:
  initialization
  classinit:

  : Methods

**Error messages** - **"Wrong number of xts in list"**

For put:, the value N did not match the number of indexed elements for
this object.

### Obj\_Array

------------------------------------------------------------------------

This class is a generic superclass which makes it easy to generate an
array of objects of a given class. Just define a new class which
multiply Inherits: from the given class (or classes) and Obj\_array
(which must come last). This will add an indexed section to each object
of the new class, with elements wide enough to contain objects of the
original class(es). Then select: "switches in" the selected
element to be the 'current' element, and all the normal
methods of the class(es) can then be used. If your base class is long
(longer than about 32 bytes), you'll probably get better performance by
using the variant [Large\_Obj\_Array](#Large_Obj_Array) (see
below).

+-----------------------------+---------------------------------------+
| Superclass                  | Object                                |
+=============================+=======================================+
| Source file                 | Struct                                |
+-----------------------------+---------------------------------------+
| Status                      | Core                                  |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class   Name      description       |
|                             |   -----                               |
|                             | -- --------- ------------------------ |
|                             | ------------------------------------- |
|                             |   Int                                 |
|                             |      current   The number of the elem |
|                             | ent currently "switched in" |
+-----------------------------+---------------------------------------+
| Indexed data                | Any width---the actual width is   |
|                             | determined by the other class(es)     |
+-----------------------------+---------------------------------------+
| System objects              | None                                  |
+-----------------------------+---------------------------------------+

  Inherits:   Object
  ----------- --------

  accessing
  -----------
  select:
  current:

  : Metrhods

**Error messages** - **"Index or value out of range"**

An out-of-range index value was used for select:.

### Large\_Obj\_Array

------------------------------------------------------------------------

This is a variant of Obj\_array which is intended to behave identically.
It's a performance optimization for Obj\_arrays whose elements are
large---longer than 32 bytes or so.

Sending select: to an Obj\_array selects an element which will receive
subsequent messages. This works by actually copying the element out of
the indexed area of the object, into the non-indexed part at the front.
This works well for small elements, since selection is quite quick, and
sending messages to the selected element is identical in every way to
sending a message to a simple object. Where performance can start to bog
down, however, is if the elements are very large---in the PowerPC
code generator I was using Obj\_array for the sets of descriptors
describing each machine register, and each descriptor is over 100 bytes
long. I discovered that the code generator was spending half its time in
`select:`, moving all those bytes around.

So this led to Large\_obj\_array. This class doesn't move any of the
elements in the indexed area, but keeps an offset which points to the
currently selected element. Whenever you send a message to one of these
objects, the offset is added. This step only takes two machine
instructions, so operations on these objects are only very slightly
slower. But select: is very fast.

You should be able to use Large\_obj\_array anywhere you're using
Obj\_array, without changing any other code.

**Warning:** There is one 'gotcha'---if you just want
the address of the currently selected element, you have to use the addr:
method---you can't just use the object's name, as you normally can
with objects. If you just use the name, you'll get the address of the
start of the object, not the currently selected element.

### (Col), Ordered-Col, wordCol, byteCol

------------------------------------------------------------------------

Collections are ordered lists with a current size, that can also behave
like a stack. We implement them by multiply inheriting the generic (Col)
class with an array class of the appropriate width. (Col) adds the
concept of a current size to the array methods.

Note: class Ordered-Col, wordCol and ByteCol are 32, 16 and 8 bit
collections respectively. All methods are identical to (Col)

+-----------------------------+---------------------------------------+
| Superclass                  | Object                                |
+=============================+=======================================+
| Source file                 | Struct                                |
+-----------------------------+---------------------------------------+
| Status                      | Core                                  |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class   Name   description          |
|                             |   ------- ------ ---                  |
|                             | ------------------------------------- |
|                             |   int     Size   \                    |
|                             | # elements currently held in the list |
+-----------------------------+---------------------------------------+
| Indexed data                | None (supplied by the array class)    |
+-----------------------------+---------------------------------------+
| System objects              | None                                  |
+-----------------------------+---------------------------------------+

  Inherits:   Object
  ----------- --------

  accessing
  -----------
  size:
  add:
  last:
  remove:
  clear:
  indexOf:

  : Methods

  Error messages                       
  ------------------------------------ ----------------------------------------------------
  **"My list is empty"**   A remove: or last: was attempted on an empty list.
  **"My list is full"**    An add: was attempted with size=limit.

### X-Col

------------------------------------------------------------------------

This class is a collection of execution tokens. It adds one new method,
and overrides one method of X-Array.

  Superclass                    (Col) X-Array
  ----------------------------- --------------------------------
  Source file                   Struct
  Status                        Core
  nowrap \|Instance variables   None
  Indexed data                  None (supplied by the X-Array)
  System objects                None

  Inherits:   (Col), X-Array, Array, Indexed-Obj, Object
  ----------- --------------------------------------------

  ----------- ---------------------- -------------------------------------------------------------------------------------------------
  removeXt:   npwrap \| ( xt \-- )   Removes the xt equal to the passed-in xt Does nothing if no match is found
  print:      ( \-- )                As for print: in class X-Array, but only types the xt names that are actually in the collection
  ----------- ---------------------- -------------------------------------------------------------------------------------------------

  : Methods

**Error messages** - As for (Col).

### Sequence

------------------------------------------------------------------------

Sequence is a generic superclass for classes which have multiple items
which frequently need to be looked at in sequence. At present the main
function of Sequence is to implement the each: method, which makes it
very simple to deal with each element. The usage is

`BEGIN each: <obj> WHILE <do something to the element>  REPEAT`

Sequence can be multiply inherited with any class which implements the
first?: and next: methods. The actual implementation details are quite
irrelevant, as long as these methods are supported.

+------------------------------+--------------------------------------+
| Superclass                   | Object                               |
+==============================+======================================+
| Source file                  | Struct                               |
+------------------------------+--------------------------------------+
| Status                       | Core                                 |
+------------------------------+--------------------------------------+
| nowrap \| Instance variables |                                      |
+------------------------------+--------------------------------------+
|                              |   Class   Name      description      |
|                              |                                      |
|                              | ------- --------- ------------------ |
|                              | ------------------------------------ |
|                              |   Var     nxt\_xt   Saves the xt for |
|                              |  the next: method of the other class |
|                              |   Var     \^self    Saves the addres |
|                              | s of Self as required for BIND\_WITH |
+------------------------------+--------------------------------------+
| Indexed data                 | None                                 |
+------------------------------+--------------------------------------+
| System objects               | None                                 |
+------------------------------+--------------------------------------+

  Inherits:   Object
  ----------- --------

  --------- ---------------------------------------------- ------------------------------------------------------------------------------------------------------
  each:     nowrap \| ( (varies) \-- true OR \-- false )   Initiates processing of a sequence as in the example above
  uneach:   ( \-- )                                        Terminates processing of a sequence before the normal end. Use prior to an EXIT out of an each: loop
  --------- ---------------------------------------------- ------------------------------------------------------------------------------------------------------

  : Methods

**Error messages** - None

### HandleList

------------------------------------------------------------------------

HandleList allows the implementation of a list of heap-based objects.
The list can be of indefinite length. We use a heap block to store the
handles to the objects contiguously, rather than have a separate block
for each handle and link them together. This saves on memory overhead
and reduces the number of Memory Manager calls. It also reflects the
assumption that insertions and deletions into the middle of the list
will be infrequent, as these could be more inefficient than with a
linked scheme. We expect that elements will normally be added to the
end, and probably not removed at all, or not very often.

+-----------------------------+---------------------------------------+
| Superclass                  | ObjHandle Sequence                    |
+=============================+=======================================+
| Source file                 | Struct                                |
+-----------------------------+---------------------------------------+
| Status                      | Core                                  |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class    Name      description      |
|                             |                                       |
|                             | -------- --------- ------------------ |
|                             | ------------------------------------- |
|                             |   handle   TheList   Points to th     |
|                             | e memory block containing the handles |
|                             |   var      Size      Th               |
|                             | e current size of the block, in bytes |
|                             |   var      Pos       The (byte) offse |
|                             | t in that block of the current handle |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              | None                                  |
+-----------------------------+---------------------------------------+

  Inherits:   ObjHandle, Sequence, Handle, Var, Longword, Object
  ----------- ----------------------------------------------------

  accessing
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  select:
  selectLast:
  current:
  size:
  setSize:
  The next two methods are needed by each:, but may be called directly as well. Note that next: ASSUMES that the list is allocated in the heap and that a valid element is selected as the current element. each: ensures this, since if first?: returns false, next?: is never called. But if you call it directly, make sure this condition holds.
  first?:
  next?:
  manipulation
  newObj:
  releaseObj:
  removeObj:
  release:
  The next methods treat the list as a stack. This is used by fileList. In the method descriptions, we'll refer to this as the 'stack' (within inverted commas) to distinguish it from the data stack.
  top:
  drop:
  pushNewObj:
  display
  dumpAll:
  printAll:
  persistence/serialization
  send:
  bring:

  : Methods

**Error messages** - None

### PtrList

------------------------------------------------------------------------

PtrList allows the implementation of a list of pointers which point to
objects. The objects can be anywhere. Similarly to HandleList, we use a
heap block to store the pointers.

+------------------------------+--------------------------------------+
| Superclass                   | Ptr Sequence                         |
+==============================+======================================+
| Source file                  | Struct                               |
+------------------------------+--------------------------------------+
| Status                       | Core                                 |
+------------------------------+--------------------------------------+
| nowrap \| Instance variables |                                      |
+------------------------------+--------------------------------------+
|                              |   CLass    Name      description     |
|                              |   --                                 |
|                              | ------ --------- ------------------- |
|                              | ------------------------------------ |
|                              |   handle   TheList   Points to the   |
|                              | memory block containing the pointers |
|                              |   var      Size      The             |
|                              |  current size of the block, in bytes |
|                              |                                      |
|                              | var      Pos       The (byte) offset |
|                              |  in that block of the current handle |
+------------------------------+--------------------------------------+
| Indexed data                 | None                                 |
+------------------------------+--------------------------------------+
| System objects               | None                                 |
+------------------------------+--------------------------------------+

  Inherits:   Ptr, Sequence, Longword, Object
  ----------- ---------------------------------

  accessing
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  select:
  selectLast:
  current:
  size:
  The next two methods are needed by each:, but may be called directly as well. Note that next: ASSUMES that the list is allocated in the heap and that a valid element is selected as the current element. each: ensures this, since if first?: returns false, next?: is never called. But if you call it directly, make sure this condition holds
  first?:
  next?:
  manipulation
  add:
  remove:
  display
  dumpAll:
  printAll:

  : Methods

**Error messages** - None

### Dic-Mark

------------------------------------------------------------------------

Dic-Mark marks a dictionary position, and includes methods for
traversing the dictionary.

+-----------------------------+---------------------------------------+
| Superclass                  | Object                                |
+=============================+=======================================+
| Source file                 | Struct                                |
+-----------------------------+---------------------------------------+
| Status                      | Core                                  |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class   Name      description       |
|                             |   ------                              |
|                             | - --------- ------------------------- |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             | ------------------------------------- |
|                             |   arra                                |
|                             | y   Links     Stores the set of dicti |
|                             | onary addresses which point to the va |
|                             | rious entries on the various threads  |
|                             | corresponding to the current position |
|                             |   int     Current   The index in      |
|                             |  Links of the current position itself |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              | TheMark                               |
+-----------------------------+---------------------------------------+

  Inherits:   Object
  ----------- --------

  accessing
  --------------
  current:
  manipulation
  set:
  setToTop:
  next:

  : Methods

**Error messages** - None

### Resource

------------------------------------------------------------------------

Resource implements Macintosh Resources.

+-----------------------------+---------------------------------------+
| Superclass                  | Handle                                |
+=============================+=======================================+
| Source file                 | Struct                                |
+-----------------------------+---------------------------------------+
| Status                      | Core                                  |
+-----------------------------+---------------------------------------+
| nowrap \|Instance variables |                                       |
+-----------------------------+---------------------------------------+
|                             |   Class   Name   descrition           |
|                             |   ------- ------ ---------------      |
|                             | ------------------------------------- |
|                             |   Var     Type   4-byte code f        |
|                             | or the resource type of this resource |
|                             |   Int     ID     The resource's ID   |
+-----------------------------+---------------------------------------+
| Indexed data                | None                                  |
+-----------------------------+---------------------------------------+
| System objects              | Some                                  |
+-----------------------------+---------------------------------------+

  Inherits:   Handle, Var, Longword, Object
  ----------- -------------------------------

  accessing
  -----------
  set:
  getNew:
  getXstr:

  : Methods

**Error messages** - **"We couldn't find this resource"**

A call to getnew: resulted in the Mac system not being able to locate a
resource with the current type and ID. Possibly the type or ID are
wrong, or the correct resource file isn't open.

------------------------------------------------------------------------

  ------------------------------------------- ------------------------------- ---------------------------------
  &nbsp;                                      [Classes](Classes)   [Strings](Classes_2)
  [Documentation](Documentation)                                   
  ------------------------------------------- ------------------------------- ---------------------------------



