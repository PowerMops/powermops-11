---
title: Memory Organization
layout: default
---

We will now move on to some of Mops' more advanced capabilities. Some
of the ideas and terms we'll be describing are more fully explained in
[Inside
Macintosh](http://developer.apple.com/techpubs/mac/IAC/IAC-2.html), and
we'll direct you to the appropriate IM sections when necessary.
Finally, if you wish to gain deeper understanding of the specialized
compiling words that operate inside Mops (derived from the Forth
language), we suggest you read one of several commercially available
Forth texts listed in the references at the end of this chapter. Because
of the way the Macintosh manages memory, Mops has several distinct areas
in which it stores data. The following diagram gives a typical picture
of the Mac's memory while a Mops program is running.\<br /\>

  ------------------------------------
  Memory Map 1 (Classic Mac)
  ![](/pmops/MemoryMap.png "MemoryMap.png")
  ------------------------------------

\<br /\>

  --------------------------------------
  Memory Map 2 (Mac OS X)
  ![](/pmops/MemoryMapX.png "MemoryMapX.png")
  --------------------------------------

\<br /\> If you're new to Mac programming, don't worry about what
everything in the diagram means at this stage --- we'll describe
the main things you need to know as we go along.

The Mops Dictionary
-------------------

Near the beginning of this manual we said that a Mops program builds a
dictionary of words. Each word and its definition occupies a portion of
the computer's memory. A Mops definition consists of several parts,
including information like whether a word is a value or a colon
definition, the numbers or other data associated with the word, and
machine instructions which carry out the operations specified for that
word. In Mops, the areas reserved for those parts of a definition are
called **fields**.

Most Mops words have four fields that you should be aware of:

-   link field
-   name field
-   handler field
-   code field

and they look like this in memory:

  --------------------------------------------------
  ![](/pmops/DictionaryFields.png "DictionaryFields.png")
  --------------------------------------------------

&nbsp;\<br /\> The link, name and handler fields are usually grouped
together as the header field. The name field holds the actual name of
the word. Its length varies with the length of the name.

The link field helps Mops programs compile quickly. In the link field is
the address of an earlier word in the dictionary. This facilitates the
search through the dictionary each time you type a previously defined
word. The search starts at the most recently defined word (the word
nearest high memory). If there is no match in the first word, the search
looks to the link field for the address of the next word on which to
attempt a match, and so on backward through the dictionary. The length
of the name and parameter fields can change from definition to
definition so there is not a fixed memory interval between words.

The content of the handler field specifies whether the word is a colon
definition, a value, and so on. The handler field usually contains a
negative integer, unique for each word type. When the word is compiled,
the handler field is used to transfer control to the right part of the
Mops compiler to compile words of this type.

For normal colon definitions, the code field contains executable code
--- the code that was compiled when the definition of that word was
read by Mops. If you later type the word name at the keyboard, Mops
looks at the handler field, sees that it is a colon definition, and
transfers control to the beginning of the code field. Your compiled code
is then executed. At the end of the definition, where you had put the
semicolon, there is a machine language 'return' (RTS : 68k) or
'branch to link register' (blr : PowerPC) instruction. This causes
control to return to the Mops interpreter.

If, instead of typing your word at the keyboard, you put it into another
definition, the process is rather similar, except that instead of
calling your definition directly, Mops compiles a machine language call
instruction at that point, to do the calling. Then, when the later
definition executes, and that call instruction is reached, your earlier
definition is called.

For Mops word types other than colon definitions, the code field
doesn't necessarily contain code. For example, in 68k Mops, for values
and constants it contains the actual 4-byte value. In this case we call
this field the 'data field', since it contains data. But it is really
the same field by a different name.

The Kernel or Nucleus
---------------------

In the diagram, you'll see that above some memory areas used by the Mac
system is the **Mops kernel code**. The *' kernel*' (also known as
**nucleus**) is the lowest, most elemental part of the Mops dictionary
--- that part of Mops without any predefined classes. It is what is
loaded into memory when you double-click the Mops application icon
itself. Saved Mops images, such as Mops.dic, appear to the Finder as
documents with Mops as their owner. Therefore, when you open a saved
Mops image, the Finder starts the Mops kernel as the application, and
passes the name of the saved image file to the Mops kernel as a
parameter (see [Inside
Macintosh](http://developer.apple.com/techpubs/mac/IAC/IAC-2.html) for
more detail on this). The Mops kernel then determines whether the file
is a valid Mops image file, and, if so, loads it in an area of memory
above the kernel. (This way of doing things is very efficient for
development, since the image saved is the document you have been working
on. You may save many variations of this document without changing the
application itself). With PowerMops we're abandoning the idea of
separate nucleus and dictionary files. This came from a time when
everything had to fit on a floppies, and would have added pointless
complexity to the PowerMops architecture. So now, when you do a save,
you get a new application generated, which has everything in it, and you
just doubleclick on that to relaunch it.

The memory area dedicated to the Mops kernel and other specifics of your
program is known as the **application heap**, or simply the **heap**.

The Heap
--------

The heap is a region of memory that can be divided into smaller
sections, called blocks. When a program needs some memory temporarily,
it can ask the Macintosh Memory Manager for a block of heap, and later
give it back when it is done. This is what the Mops kernel does at
startup in order to acquire memory for future expansion of the Mops
dictionary. Mops requests a block of heap that will be large enough to
allow for expansion of the user dictionary, but will leave enough room
for both the system and Mops to use on a temporary basis (dynamic heap)
as the program executes. Exactly how much memory is to be devoted to the
dynamic heap can be altered by the Mops Install utility, which was
described in [Lesson 22](Lesson_22) of the Tutorial.

Many parts of Mops and the Mac Operating System rely upon dynamic heap.
For instance, when your application requires a resource, such as a font,
to be loaded from disk, the Font Manager places the font in the dynamic
heap. Mops modules (described below) are loaded into the dynamic heap,
and any class can be told to create an object whose data exists on the
dynamic heap instead of in the dictionary. Whenever you see a System
Error 25, it usually means that heap has become used up or fragmented
(see the Memory Manager section of [Inside
Macintosh](http://developer.apple.com/techpubs/mac/IAC/IAC-2.html)). You
can remedy this situation either by leaving more dynamic heap with the
Install utility or by being more careful to release the heap used by
your application's modules or heap objects once they are no longer
needed.

The Mops dictionary can grow until it exhausts its allotted block of
heap. The Mops word `ROOM` will return the amount in
bytes of available dictionary space at any time.

Stacks
------

The two Mops stacks --- data (parameter) and return stacks ---
are allocated above the application heap. Both grow downward: the return
stack grows towards the base of the data stack. The Mops kernel
allocates room for 1500 32-bit cells (800 64-bit cells from PowerMops
6.0) on the return stack. The data stack is limited only by the maximum
address to which the heap is permitted to grow, and is allocated about
50000 in the distributed Mops system. While on Mac OS X the heap size is
4 GB (virtual) for each application. Macintosh Toolbox routines allocate
their local variables on the stack, which accounts for the relatively
large size of the data stack.

Various system errors can be caused by one of the stacks growing beyond
its bounds. This type of error can be difficult to detect, but you
should be particularly alert for return stack problems when writing
recursive routines. The return stack also gets heavy use when you use a
lot of named parameters and/or local variables in your methods or Mops
words, since the previous values of these quantities are saved on the
return stack.

The data stack is used not only by Mops, but also by the Toolbox when
you invoke one of its routines. Toolbox routines allocate their local
data and do parameter passing on the system stack, which is actually the
same as the Mops data stack. This makes the Mops/Toolbox interface
fairly easy. A Mops word need only place parameters on the data stack,
just as if it were about to execute another word or method (also see the
later chapter 'Calling the Toolbox').

Addresses-Relocatable and Absolute
----------------------------------

For speed, we normally hold all addresses in the normal Mac form (which
we'll call **absolute** since its the actual address which is directly
used by the hardware). This does mean, however, that we have to do some
juggling to handle addresses that are stored in the dictionary and then
saved in a dictionary image which is reloaded later. In general, these
addresses won't be valid any longer, since the program may well be
located at a different place in memory.

For this kind of operation we have defined a relocatable address format,
and the words `\@abs` and `reloc!` to
respectively fetch and store a relocatable address with conversion
to/from absolute. We have also provided two classes,
`DicAddr` and `X-Addr` which use the
relocatable format internally. (`DicAddr` is for
addresses of data, and `X-Addr` for executable word
addresses.) These have access methods that incorporate the conversion.
'''You should always use one of these mechanisms for accessing
relocatable addresses. '''Don't rely on any details of the
relocatable address itself, as this may change at any stage in the
future, and probably will. It will stay at the same size as a stack
cell, but we make no other guarantees.

Note that relocatable conversion does not need to be done nearly as
often as `@`, `w@` or `c@`,
so that we really do gain by standardizing on absolute addresses.

Handles and Pointers
--------------------

Handles and pointers are fundamental to programming on the Mac, relying
as it does on dynamic allocation and reallocation of memory for
flexibility. When you allocate a block of memory in the heap, you can
ask for either a **Handle** or a **Pointer**. A pointer points directly
at the memory you allocated (i.e. it contains the address of that block
of memory), while a handle points at what is called a **Master
Pointer**, which is what actually points to the memory. See the Memory
Manager chapter of [Inside
Macintosh](http://developer.apple.com/techpubs/mac/IAC/IAC-2.html) for
more details on handles and pointers. Briefly, using a handle allows the
Memory Manager to move the block of memory around, and thus allow memory
to be used more efficiently. When the Memory Manager moves a block of
memory, it updates the master pointer so that programs can still know
where the block of memory is, since the program knows the address of the
master pointer, and that doesn&\#146;t change. However, blocks accessed
via a pointer can't be moved, since the Memory Manager has no way of
knowing where the pointer (or any copies of it) are located&\#148;the
program may have put them anywhere.

In Mops, we used to encourage the use of handles rather than pointers,
since the ability of handle-based blocks of memory to move around made
memory allocation in a small memory space easier. But today&\#146;s
machines have so much memory that the extra housekeeping associated with
handles is usually not worth the trouble --- this is why the new
Reference feature uses pointer-based blocks of memory.

Both handles and pointers are objects, with appropriate methods defined
for them. If you want to do a number of operations quickly on a block of
memory allocated via a handle, you may lock it in memory so the Memory
Manager won't move it while you are accessing it. You may then retrieve
the actual address of the block, and know that it will remain valid
until you unlock the block. The methods `lock:` and
`unlock:` of class `Handle` perform this
function.

An accidental clobbering of a handle or pointer can produce a bug that
can have very nasty and generally unrepeatable results, and be very hard
to track down. Making them objects helps discourage doing dangerous
things with them, and also allows a degree of error checking. An
unallocated handle or pointer object is given a value which should
always cause a trap if it is used as an address. (The actual values we
use in 68k Mops are `\$ FFA00101` for unallocated
handles, and `\$ FFA00103` for unallocated pointers.
These two values are defined as constants with the names
`NilH` and `NilP` respectively). These are
illegal addresses on all Macs, as far as I am aware, and give an illegal
address error if used.

As we have seen, you may define objects which are created in memory
allocated on the heap, with a reference or a pointer or a handle
pointing to them (see the sections above). String variables
(`String`, `String+`,
`Bytestring`) are based on `Handle`s, and
are therefore able to grow and shrink as required, since the memory they
occupy is allocated dynamically.

------------------------------------------------------------------------

  ------------------------------------------- ----------------------------------- ---------------------------------------
  [Reference 4](Reference_4)       [Reference](Reference)   [Reference 6](Reference_6)
  [Documentation](Documentation)                                       
  ------------------------------------------- ----------------------------------- ---------------------------------------



