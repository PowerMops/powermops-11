---
title: Technical Section
layout: default
---

This chapter is intended for hackers, or people who want to understand
the nucleus source code better, or for those who are just insatiably
curious. You may use Mops with great success without reading this
section, but if you run into some obscure problem which defies analysis,
or if you're writing a lot of assembly code definitions, you might find
something useful here.

Mops Runtime Environment - 68k
------------------------------

In compiling code to reference the dictionary, we have the problem that
native 68000 code only allows a 16-bit displacement for addressing, in
the normal An plus displacement addressing mode. That is, unless we
resort to extra steps in every memory addressing operation, every part
of the dictionary must be within 32K of where an A register is pointing.
The 68020/030 chips have a 32-bit displacement mode, but the 68000
doesn't. Mops has to run on 68000 machines (Plus, SE, Classic,
PowerBook 100), of course, so I was forced to find a solution to this
problem. The eventual solution was to dedicate three A registers for
addressing. Mops uses A3 and A4 to address the main dictionary ---
these registers are set up with A4 pointing 64K higher than A3, and
these two registers never change during execution. This way we can
address a dictionary up to 128K in size. A dictionary can be larger than
this, but memory references above the 128K range may be slightly less
efficient. (We give details on this in the later section
'Dictionary size'.)

We call A3 'lobase' and A4 'hibase'. Modules are
addressed using A5 ('modbase'). We never allow a module to
be accessed from outside except through an exported word, and thus we
can ensure that A5 is always valid when a module is in execution.

We use A6 as the data stack pointer, and A7 as the return stack pointer.
This means that a Mops word can be called with a simple BSR or JSR
instruction, and nothing further needs to be done with the return
address, since it is already on the top of the return stack. All the
words which call the system (such as TRAP) exchange A6 and A7 before the
system trap, and then exchange them back on return. This means that Mops
code can push parameters for Toolbox calls onto the data stack and take
results from the data stack, exactly as you would expect.

For named parameters and local variables, we use D4-D7 and an overflow
memory area, and save whatever is necessary on the return stack during
nested definitions. The **rightmost** four parms/locals are the ones
that are assigned to D4-D7; these will therefore benefit from faster
access.

So to summarize the register usage:

`D0-2   scratch`\
`D3     loop counter I`\
`D4-7   named parms/locals`

`A0-1   scratch`\
`A3     lobase`\
`A4     hibase`\
`A5     modbase`\
`A6     data stack pointer`\
`A7     return stack pointer`

Runtime Environment - PowerPC
-----------------------------

The PowerPC has many more registers than the 68k --- 32 integer
registers and 32 floating-point registers, and a number of special
registers as well.

We use a similar dictionary addressing scheme to the 68k, but since we
have separate code and data areas, we need four base registers instead
of two (main dictionary's code and data, and the current module's code
and data).

We need 3 regs for scratch in boilerplate code sequences. We use r0,
which is a bit unusual anyway, and r11 and r12 (see below).

r1 is the system stack pointer, r2 is RTOC. We can't monkey with these.
It would not be a good idea to use r1 as our data stack pointer, since
the Mac OS makes very specific assumptions about the way this register
is used, which we can't guarantee for our data stack pointer.

r11 and r12 are used in the calling sequence for external calls. Apple
says they can be used as scratch at all other times, so we'll use them
in boilerplate sequences. PowerMacForth does this too, and in the
assembler they're aliased as rX and rY.

For Toolbox or other external calls, r3-r10 are used for parameters, and
r3 for a returned result. They won't be saved over the calls. Of course
for internal Mops calls we can do what we like. So we use these
registers for cached stack cells, and on an external call normalize the
stack so that the required number of cells are stored in r3 on. At that
stage we won't have any other cached stack cells, so we don't need the
registers preserved anyway.

This scheme gives us 8 regs for cached stack cells (r3-r10), which
should be enough.

r13-31 are 'nonvolatile' --- they're saved over
external calls. For internal Mops calls we just need to save the locals,
since other registers like the base address registers don't get
changed.

The registers we need to permanently allocate out of the nonvolatile
block are these: the four base registers, SP (data stack pointer), RP
(return stack pointer), the base address of the current object. and the
loop variable `I`. `DO\...LOOP` will also
be faster if we have the limit value in a register. Now we may as well
use two of our 'local' registers for I and the loop limit,
since it will be very rare for us to need all of them. This will mean
two less locals in definitions that use `DO\...LOOP`s,
but hopefully that won't be a serious problem.

We will also be using a separate FP stack, since the Scientific Library
is now using this. This will also give better code, since when we bring
stack cells back from memory to registers, we'll always know which
registers to move them to. The floating stack pointer probably should be
in a register.

So in all we'll need 10 special regs out of the nonvolatile block.

This leaves r23-r31 for locals, or r21-r31 if there's no
`DO\...LOOP` in the definition. This means that if we
limit the number of locals to 11 or 9, we can keep them all in
registers. This looks reasonable, although I would have preferred 12/10.

So, here is the register usage:

`r0     scratch`\
`r1     system stack pointer`\
`r2     RTOC (Table Of Contents pointer)`\
`r3     scratch (cached stack cell)`\
`r4     ditto`\
`r5     ditto`\
`r6     ditto`\
`r7     ditto`\
`r8     ditto`\
`r9     ditto`\
`r10    ditto`\
`r11    scratch, also used in system calls`\
`r12    ditto`\
`r13    base address of main dic code area`\
`r14    base address of main dic data area`\
`r15    base address of current module's code area`\
`r16    base address of current module's data area`\
`r17    return stack pointer (points to top cell--lowest address)`\
`r18    data stack pointer (points to top memory cell--lowest address)`\
`r19    floating point stack pointer (points to top memory cell)`\
`r20    base address of current object`\
`r21    loop counter I`\
`r22    limit value for DO...LOOP`\
`r23    available for named parms/locals`\
`r24    ditto`\
`r25    ditto`\
`r26    ditto`\
`r27    ditto`\
`r28    ditto`\
`r29    ditto`\
`r30    ditto`\
`r31    ditto`

Dictionary Header Format
------------------------

We use an 8-way threaded structure, for speed in lookup. To decide which
thread to use for a given word, we simply use the length of the word's
name, modulo 8.

In a dictionary header, first there is a 4-byte link field at the lfa
(link field address), which gives the displacement from the lfa itself
to the previous header on the same thread. Then comes the name field,
which consists of a length byte followed by the name itself, with a zero
byte added if necessary so that the total name field is even in length.
Next comes the 2-byte handler code (see later under "[Compilation
and Optimization](#Compilation_and_Optimization)". That
is the end of the header. We say that the following byte is at the cfa,
even though we don't have a code field as such. For most definitions on
the 68k, executable code starts at the cfa, and for constants, variables
and values the data comes there.

On the PowerPC, for colon definitions, we use two extra flag bytes after
the handler code. Then comes the first instruction of the definition,
which must be 4-byte aligned.

Compilation and Optimization
----------------------------

This section was originally written for 68k Mops, but many of the same
considerations apply to PowerMops, which optimizes even more
aggressively. I will probably add a PowerPC section eventually.

Compilation in a STC/native code system is necessarily a bit more
involved than in traditional Forth-based systems. Optimization adds
another level of complexity. Most user coding can be done exactly as in
normal Forths, but the underlying compilation process is a bit
different, and so there are a few pitfalls to avoid.

Firstly, let's look at plain ordinary colon definitions. When a
reference to one of these is compiled, we compile a BSR.S if we can,
otherwise a JSR. Such words are EXECUTEd simply by calling them. So far
so good.

We also have inline definitions. For example, it would have been silly
to handle DUP by JSRring to this code:

`MOVE.L (A6),-6)`\
`RTS`

when we could simply have compiled the MOVE right in line. Two bytes
instead of 4 for the JSR, and much faster. So what we do is mark certain
definitions as inline, and when we compile them, we just move the code
in. In previous versions of Mops you couldn't EXECUTE such definitions,
but as from v. 1.6 you can, since we include an RTS instruction at the
end of the original copy of the inline code (which starts at the cfa of
the definition). This RTS isn't copied over when the code is inlined in
another definition, but is there in the original copy so that it can be
called by EXECUTE.

Other dictionary items, such as objects, require other special actions
to take place when a reference to them is compiled. So what we have
tried to do is to take quite a general approach to the problem. Each
dictionary header contains a 2-byte field we call the &\#152;handler
code'. This determines exactly what should happen when a reference to
this dictionary item is to be compiled. For inline definitions, the
handler code is positive (but not zero). It is interpreted as a byte
count of the number of bytes of inline code, and this code immediately
follows the count. For most other dictionary items, the handler code is
negative and even. It is used as an opcode for a call to Handlers, which
is a separate segment (CODE segment 3). There are quite a number of
different opcodes, and this gives us great flexibility. In installed
applications, the Handlers segment is not included, and this saves about
16K of code space, and also makes it completely impossible to do any
Mops interpretation from installed applications.

Our method of code optimization should be transparent to the user, but
the method used has some interesting features. We don't attempt the
complexities of looking ahead in the input stream to find sequences of
words that could be optimized. Rather, we check what we have already
compiled to see if it can be improved. Whenever the Handlers module
compiles code that may have optimization potential, it pushes a
descriptor onto a stack. Then when we are checking for optimization
possibilities, we check downwards on this stack and take appropriate
action. Each descriptor contains a copy of the DP value for the start of
the corresponding code sequence, so whenever we find that we can
optimize the previously-compiled code we can easily reset the DP to the
right place, then emit the improved code. This technique allows us to
get some surprisingly good results. For example, if vv is a variable,
the code

`0 vv i + c!`

will compile to

`LEA    xx(A3),A1               ; Address of vv to A1`\
`CLR.B  0(A1,D3.L)              ; Index on D3 (loop counter i)`

This technique also means that we never have to backtrack if we tried an
optimization strategy which failed. The unoptimized code is always
compiled first, and is only recompiled if we know we can legitimately
improve it. This optimization technique has worked well in practice, and
generally gives around a 15% improvement in execution speed and a 10%
reduction in code size. Of course, some common code sequences are
improved much more than this.

Another optimization involves conditionals. If, for example, we have the
code

`aConst IF <some code> ELSE <some more code> THEN`

where the conditional is testing a constant, the condition will be
evaluated at compile time, and either `<some code>`
or `<some more code>` will be compiled, but not
both. We therefore have a conditional compilation capability, without
introducing any new syntax at all.

Finally, it is worth noting that our optimization technique is
reasonably efficient, so that compilation speed does not appear to have
been degraded significantly at all. It is certainly much faster than
Neon.

Object Format
-------------

Here is our format for normal objects (remember that ivars declared
within `record {\...}` won't have a header&\#148;that
is, there will be nothing before the object's actual data). While I try
to keep the descriptions here up to date, if you really need to know the
exact details, please refer to the comments in the file Class (for 68k
Mops) or cg1 (for PowerMops). Some small changes get made from time to
time, and the comments in those files should always be accurate.

  **68k format:**
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  2 bytes
  4 bytes
  2 bytes
  Start&nbsp;of&nbsp;object&nbsp;data&nbsp;
  For indexed objects, the indexed area (after the ivars) is preceded by a descriptor with the format:
  2 bytes
  4 bytes
  **PowerPC format:**
  4 bytes
  4 bytes
  2 bytes
  2 bytes
  Start of object data
  This format means that when multiply inheriting, we need 4 bytes separating each group of ivars (&\#152;embedded object'), not 2 as on the 68k.\<br /\> For indexed objects, the indexed area (after the ivars) is preceded by the indexed descriptor (xdesc) with the following format. This format is the same as on the 68k, except that it starts off-aligned, i.e. the \#elements field is 4-byte aligned.
  2 bytes
  4 bytes

The reason we need the offset from the data to the class pointer relates
to multiple inheritance. In Neon, the class pointer immediately preceded
the object's data. But with multiple inheritance, we will have the
ivars for the various superclasses following each other. If a method in
one of the superclasses is called, and it needs the class pointer, it
can't look just before its first ivar, since that isn't actually the
start of the object's data any more. So what we do is put a 2-byte
offset to the class pointer before **each** group of ivars belonging to
each superclass.

Now for the reason we use 6 as the offset to the indexed area header for
non-indexed objects.(2 on the PowerPC). When doing indexing, we use the
indexed area header or descriptor (I sometimes abbreviate this as
'xdesc') to check for the indexed access being in bounds. We
actually do the check with a CHK instruction (trap on the PowerPC), so
it is a very fast check. Now, for non-indexed objects, an offset of 6
won't get us to any xdesc, since there isn't one, but will get us to
the other offset'the offset to the class pointer. Now this offset is
always negative (the details are different on the PowerPC, but the idea
is the same). When the CHK instruction is executed, it will see a
negative number as the "number of elements", and always
fail. I don't normally resort to clever tricks like this, but
efficiency considerations were paramount here.

68k CODE resources
------------------

In the original Neon implementation, the CODE 0 resource was the jump
table (as in all Mac applications), and CODE 1 was the dictionary. In
installed applications, each module became another code segment, but in
'development mode' these were the only CODE segments there
were. On startup, CODE 1 expanded itself (via \_SetHandleSize) to the
required dictionary size, and the selected dictionary image was then
read in above the nucleus.

The Mops scheme is a slight development of this. Under System 7 I found
the system was loading CODE 1 high, because it was marked
'locked'. It then couldn't expand itself, since it
couldn't relocate while running, and there was no room above it. I
found I could get around this problem by not marking it locked in the
resource file, but felt that maybe I was heading for trouble later on. I
thought that possibly having a CODE segment expand itself, while
actually running, might not be such a marvellous idea. So now we have
another CODE segment. The main dictionary is now CODE 2, and CODE 1 is a
small segment that does most of the initialization stuff. It also gets a
handle to CODE 2, unlocks it (just in case), expands it as needed, then
moves it high, locks it and jumps to it. Once in CODE 2, we unload CODE
1, which has done its job.

CODE 3 is the Handlers segment. It has only one entry point, and an
opcode is passed to it to tell it what to do. The comments in Handlers
have all the details. Installed applications have CODE 0, CODE 1 and
CODE 2 segments. Handlers is not present, and is not needed. The CODE 2
segment doesn't need to be expanded, since all the needed dictionary is
already there. CODE 1 still does all the initialization, but skips the
part where it expands CODE 2. As in Neon, any needed modules become
additional CODE segments. Their resource numbers will be strange numbers
obtained by calling UniqueID, but the names are attached to the
resources so you can tell which is which in ResEdit, if you need to.

The jump table is very short, since it only needs to reference 4 CODE
segments. Modules are accessed through the corresponding module object
in the dictionary, not through the jump table. Other object-oriented
systems on the Mac have used the jump table for implementing dynamic
objects, and so have run into problems with the original 32K limit on
the size of the jump table. This limit has now been removed by Apple
with its new "32-bit everything" addressing scheme, but in
Mops we never had the problem anyway.

Relocatable Address Format
--------------------------

This section is included for information only, and to help debugging. A
I said at the beginning, please don't rely on these details remaining
accurate. I have no plans to change at the moment, but you never know.

Our relocatable address format was determined largely by the need to be
able to address anywhere within a very large dictionary, and also to fit
in 4 bytes. The top byte is 5, 6 or 7 on the 68k, and 8 to 64 on the
PowerPC.

First we'll list the 68k formats. The top byte is 5 if the address is
relative to the main dictionary. The low 3 bytes give the offset from
lobase (A3).

The top byte is 6 if it is a module address. The low three bytes give
the offset from modbase (A5).

The top byte is 7 if it is a self-relative address. We currently use
this for a module address which is stored in the same module. A
situation can arise for which A5 isn't valid&\#148;an action handler in
an object whose class is implemented in a different module, may well be
accessed when A5 is set up for that other module. This relocatable
format will work in this situation since it doesn't depend on A5.

Now for the PowerPC formats.

We had the same problem regarding action handlers as on the 68k, but
things were more complicated because of the separated code and data
areas. So we have adopted the idea of a 'segment'. A
'segment' is a contiguous chunk of memory. So the main
dictionary code area is a segment, the main dictionary data area is a
segment, and for each module the code and data areas are also segments.
We use a 'segment table', which stores the starting address
and size of each segment in memory.

We also take advantage of the fact that much larger RAM capacities are
now commonplace than were normal when Mops was first designed. So, when
a module is loaded into memory, it is locked and never moved. Each
module gets its own pair of segment table entries, which store the
starting address and size of its two segments.

Now, for a relocatable address, we just use the segment number plus the
offset of the item in that segment. Segment numbers start at 8. Segment
8 is the main dictionary code, 9 is the main dictionary data, 10 is the
first module's code, 11 the module's data, and so on.

You can see that this relocatable address can uniquely address any item
in the code or data areas of any part of the Mops dictionary structure.

It only takes a small number of machine instructions to decode a
relocatable address, and we also pick up the case where the top byte
isn't a legal value, and give the "Not a relocatable
address" error. We also give this error on the PowerPC if the
offset is greater than the length of the given segment.

For the top byte values, we use 5 upwards rather than 0 upwards, to give
a higher rate of error detection. If an erroneous 4-byte value is used
as a relocatable address, its probablilty of having a high byte of zero
would be greater than for most other values, I would expect.

Improving the Performance of Late Binding
-----------------------------------------

### BIND\_WITH (68k Mops only)

There are situations where you may want to do a late bind in a loop, but
where you know that the binding will actually be the same each time
around. We have provided a means by which you can do the binding before
entering the loop, and then use the resulting method address in the loop
with almost the same speed as early binding. The syntax is

`BIND_WITH ( ^obj -- <selector> ^obj-modified cfa )`

If `saveCfa` and `\^obj-mod` are values or
local variables, the usage of this word is:

`(get object's address) BIND_WITH someSelector:`\
\
`-> saveCfa  -> ^obj-mod`\
\
`(in the loop) ^obj-mod saveCfa EX-METHOD`

The use of the modified object address is a bit obscure, and is related
to multiple inheritance. The method you actually end up binding to may
be in one of the superclasses, and the ivars for that superclass may not
actually start at the beginning of the object. The modified object
address gives the start of the ivars for the superclass, which is the
address the method needs to execute. Anyway, if you just follow the
above code, you shouldn't go wrong.

`BIND\_WITH` can do a lot to remove the performance
disadvantage of using late binding. See the file Struct for some more
examples, in the `(Col)` class.

### Late Bind Cache (PowerMops only)

This is transparent to users --- it gets used automatically, without
you having to change your code in any way. It saves the binding
information for up to 16 of the most recent late binds, and in this way
gives a useful speedup to many late-bound calls --- especially in
loops, where it counts. If a late-bound call matches an entry in the
cache, the overhead is reduced from around 500 machine instructions to
about 150.

Implementation of References
----------------------------

The most important point regarding our implementation of references is
that we always know where all references are. This makes it reasonably
easy to implement reference operations and garbage collection.

References either look like objects in the dictionary, or ivars within
other objects. In either case they have a class, which is stored in
exactly the same way as for normal objects and ivars --- that is,
with the relocatable address of the class stored in the object header
(for objects), or the ivar dictionary data (for ivars). Now the
relocatable address of a class is always even, so we flag a reference
simply by setting the low bit of the class address to 1.

References in heap blocks can easily be located, since a heap block
represents an object of a particular class, and we can traverse all the
ivars of the class to find references. This is a recursive process,
since an ivar itself is an object with its own ivars, some of which may
be references. To speed this operation up, if the block contains nine
references or less, we store the offsets to these references in the
block header.

The data of a reference is actually three pointers, and is therefore 12
bytes long. The first pointer simply points to the referenced object, or
is nilP if the reference is empty. The second points to the start of the
heap block containing the referenced object, or is nilP if the reference
is not to a heap object. The third points to the start of the vtable for
the class of the referenced object.

The second and third of these pointers are not actually needed for
correct operation since all this information could be obtained from the
header of the addressed object and from its associated class
information. However these extra pointers do speed up reference
operations. For example, having the vtable address in the reference
roughly halves the number of instructions needed for a vtable bind.

When a reference is set to point to a new object, the necessary
information is extracted from the object header. If the object is in the
heap, a reference count at the beginning of the heap block is
incremented. When `release>` is done on a reference
and it was pointing to a heap object, the reference count in the heap
block is decremented. If the reference count becomes zero, we know that
there are no references pointing to the block, so it can be deleted.

Before a heap block is actually deleted, any references in the block
must be found, and the `release>` operation done on
each of these. The reason should be fairly obvious --- since these
references are about to go out of existence, we know we're finished
with them! This may in turn lead to the deletion of other heap blocks.

For more detailed information on the format of references and also for
all the details of our heap block format, please see the comments near
the end of the source file cg1 (in the folder PPC Source).

### Garbage Collection

Reference counting will pick up most situations where heap blocks need
to be deleted, but not all. Circular references will not be picked up.
Circular references are those where a block has references to itself or
to other blocks which directly or indirectly have references pointing
back to the original block. Such a group of blocks may be completely
finished with, but still have nonzero reference counts.

Circular references are picked up by a garbage collection routine
invoked by the word '''garbage\_collect '''. This performs the
following steps:

1.  We go through all our heap blocks and count references to each,
    which come just from other heap blocks. We call this the "heap
    reference count". This is easy to compute since as we saw
    above, we know how to locate all references in each block.
2.  We mark all heap blocks which can't be deleted. To do this we go
    through all the heap blocks again, and whenever we find one whose
    reference count is greater than the heap reference count, we know
    it's referenced from elsewhere in the Mops system. We therefore
    mark it as not deletable. We then go through all its references and
    mark the referenced blocks as not deletable as well.
3.  We do a sweep through all heap blocks and delete those that aren't
    marked.

This is basically a form of the traditional "mark and sweep"
garbage collection algorithm.

**Garbage\_collect** is set up to run occasionally (currently every 100
times we get an idle event). Normally its operation should be quite
unnoticeable.

In some situations you may wish to invoke
`garbage\_collect` yourself --- there's no problem
at all in doing so. If you have an application which is allocating a lot
of dynamic memory and not calling the event loop very often, you may
want to do this.

------------------------------------------------------------------------

  ------------------------------------------- ----------------------------------- -----------------------------------------
  [Reference 13](Reference_13)     [Reference](Reference)   [Reference 15](Reference_15)
  [Documentation](Documentation)                                       
  ------------------------------------------- ----------------------------------- -----------------------------------------



