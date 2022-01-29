---
title: Modules
layout: default
---

Mops provides a facility for creating separately compilable, relocatable
modules. Modules encourage you to separate your program into
well-defined, independent units, which makes your code easier to
understand and maintain. You must explicitly state which definitions
from a given module will be available (exported) to callers outside the
module. Any other definitions become unavailable to the rest of the
program after the module is compiled. Modules are loaded automatically
on the heap whenever one of the exported definitions is referenced. The
application must manage and release any modules that are no longer
needed.

Module Guidelines
-----------------

Certain guidelines must be observed when dividing your application into
modules. Exported names are taken to be executable words. Therefore you
mustn't export other things such as objects or Values. If you need to
export an object, you will need to define a word in the module which
gets the address of the object (just naming it will do that), then
export that word name. You can then use late binding to send a message
to the object.

You may export class names. Thus, you can define a class in a module,
include the class name in the imports list, and instantiate objects of
that class anywhere. In fact in the Mops system itself, we handle
windows, menus and dialogs this way. All the methods of the class are in
effect exported along with the class name; you don't have to take any
special action, apart from putting the class name in the imports list,
and taking care with action handlers (see below). Whenever you send a
message to an exported class, the module will be invoked automatically.

Naturally this has some performance implications. There is a fair amount
of overhead involved in invoking a module. You can reduce this to some
extent by locking the module over a number of calls (this is true for
ordinary exported words as well). But if message execution for a
particular class is really time-critical, it would really best to leave
the class in the main dictionary. Where exported classes are most useful
is for those classes that depend heavily on Toolbox calls for most of
their methods (such as windows, menus and dialogs). Toolbox calls are
generally much slower than Mops module invocations, so the extra time
penalty of putting the class into a module won't be significant.

In Mops you can enter modules only through the exported words (otherwise
a machine base address register will not be set correctly, and you'll
crash). Therefore a module should not store the address of one of its
internal words in a vector in the main dictionary. Even if the module is
locked in memory, you would not be able to execute this vector. We have
included a check on stores to vectors, that a module address isn't
being stored outside the module, so as to give an error message if this
is attempted. This check can be turned off, but don't do it unless you
are absolutely sure you know what you are doing!

How to Use Modules
------------------

Each module has a corresponding object in the main dictionary, which is
used for interaction with the module, and which conceptually *is* the
module. These module objects have appropriate methods to load them,
purge them, query their status etc.

**Creating modules in Mops is a three-stage process:**

1.  Create a definition for the module and the entry points that are to
    be available to the rest of the application. This must exist in the
    resident portion of the application, and has the following
    format:`FROM MyMod IMPORT{ word1 word2 word3 }`This
    statement declares a module, MyMod, from which will be imported
    three definitions, `word1`, `word2`
    and `word3`. These two names will exist only in the
    disk image of the module until one of them is referenced, at which
    time the entire module will be loaded into the heap. On the disk,
    the binary image of the module will have the name MyMod.bin (68k
    Mops) or MyMod.pbin (PowerMops).
2.  Write the source code for the module in a separate file, called
    whatever is the name of your module, followed by '.txt'. Thus in
    the above example the source file would be called MyMod.txt.
3.  The module must be compiled and saved in its binary format before it
    will be available to callers. To compile a module, you must send a
    compile: message to the module, e.g. `compile:
    MyMod`When the module has been compiled, a message will
    appear stating that the module has been saved. You must have room in
    your dictionary to load the module source file.\<br\>When we compile
    a module, we temporarily hide all of the main dictionary above the
    module object itself. This means you don't have to worry about what
    you might have loaded in the dictionary when you want to recompile a
    module.

If you need to call a module several times in succession, you can save
some runtime overhead by locking it in memory while you are making the
calls. Do it thus:

`lock: MyMod`

You will also need to lock the module if you get the address of
somewhere in the module --- an object, say --- and need to use
the address again later. If the module isn't locked, it may move in the
heap in the meantime or be removed altogether, so that the address
won't be valid any longer. When you are finished with the module,
remember to unlock it thus:

`unlock: MyMod`

When you are completely finished with a module, you can release its heap
memory thus:

`release: MyMod`

You do not have to do this, however, since loaded modules which are not
actually being executed will be released automatically if more heap
space is needed. If you want a module not to be released from memory,
you can send the message

`keep: MyMod`

This will flag a module as needing to be kept in memory. Unlike the
situation with `lock:`, the module may be moved within
the heap by the Memory Manager, if it isn't actually being executed. To
undo a keep:, send

`drop: MyMod`

This will not release the module from memory, but will once again allow
it to be released if more heap space is needed for something else.

To include a module in an installed application, mark it as installable
any time before calling install. Do it like this:

`true setInstall: MyMod`

------------------------------------------------------------------------

  ------------------------------------------- ----------------------------------- ---------------------------------------
  [Reference 7](Reference_7)       [Reference](Reference)   [Reference 9](Reference_9)
  [Documentation](Documentation)                                       
  ------------------------------------------- ----------------------------------- ---------------------------------------



