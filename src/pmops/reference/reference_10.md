---
title: Powermops
layout: default
---

## Introduction

PowerMops is native code Mops for the PowerPC. We've tried to make it
as close as possible to 68k Mops ('Mops Classic'?) at the source code
level, so that you can compile for either platform without difficulty.
However there are inevitably a few differences, which we'll discuss
here.

## Separate Code and Data

The PowerPC microprocessor uses the idea of code and data being in
different areas. Under certain conditions the code area might be
read-only. So, in PowerMops, we keep code and data separate. This
shouldn't normally affect your source code, but it will if you do
certain nonstandard things.

The most common of these will probably be ticking a word, then assuming
the resulting execution token (xt) is an address, and making assumptions
about what is stored at that address. This is not permitted by the ANSI
standard --- in fact, you shouldn't assume that an xt is an address
at all (even though in Mops, it is).

So, if your code has anything like this:

`['] myValue w@`

in order to fetch the top 2 bytes of a Value, this will work in 68k
Mops, but not in PowerMops. A Value in PowerMops has a header in the
code area of the dictionary, but the 4-byte value itself doesn't follow
the header, since it has to be in the data area. So, in the code area we
put a relocatable address pointing to the value itself which is in the
data area. If you tick a Value in PowerMops, you don't even get the
address of this pointer; rather, you get this address minus two. The
lesson to learn from this is that you shouldn't do this kind of thing
at all. Stick to the standard ways of using Values, Variables and
objects, and your code should work in both versions of Mops.

## No Separate Nucleus and Dictionary

With PowerMops we're abandoning the idea of separate nucleus and
dictionary files. This came from a time when everything had to fit on a
floppies, and would have added pointless complexity to the PowerMops
architecture. So in PowerMops, when you do a save, you get a new
application generated, which has everything in it, and you just
double-click on it.

## Under the Hood

If you want to get an idea of how things work under the hood, at the
moment all I can do is refer you to the comments in the code. These,
however, are fairly extensive, and should be up-to-date, since I refer
to them all the time myself!

The code generator is written entirely in Mops. The vast majority of
words are high-level, and for the few assembly words I use the Mops PPC
assembler.

The comments in the code, while reasonably adequate, are scattered
around, generally near the relevant words, rather than all in one place.
In future I may collect them together and include them in an appendix to
the manual.

But if you're interested, at the end of the first code generator file
'cg1', there's a full rundown on our basic code generation strategy,
register usage, etc. as well as a full description of the PPC version of
our class and object formats.

## Toolbox Calls

Remember that for Toolbox calls you MUST use the SYSCALL syntax. The old
'call xxxx' syntax isn't implemented in PowerMops.

As we noted in the Tutorial, if you're passing records to the Toolbox,
you have to use the syntax

`68k_record{ ... }`

This is because the normal `record{ \... }` uses
PowerPC-optimized alignment of fields, which is different to the 68k.
The PowerPC prefers information of 4 bytes or more to start at addresses
that are multiples of 4, while the 68k is happy with multiples of 2.
However, Mac Toolbox calls, for compatibility, all still use 68k-style
alignment.

You'll notice that I've used this syntax in files such as Event which
pass record addresses to the Toolbox. If your code crashes on a Toolbox
call, this is one thing to check.

On the 68k Mops, `68k\_record{` is recognized, but
treated the same as `record{`, so you can always use
`68k\_record{` for records you pass to the Toolbox,
whatever version of Mops you're running.

## Source Filename Conventions and Loading Order

Files 'cgx' belong to the code generator proper. During the building
of the PowerMops system, these get loaded twice --- the first time
is so that we can generate PowerPC code, and the second is so that the
code generator itself can exist in a native version.

So the basic order of loading is, first the code generator is loaded,
then a word CROSS is executed which 'crosses' us over into
PowerPC-land. This begins to lay down a memory image of the native
PowerMops application. Then the nucleus is generated, and then the
(native version of) the code generator. (This is what is called 'target
compilation' since we're compiling code for a different target machine
than the one we're running on --- we're running on a 68k-based
machine, but compiling code for a PowerPC machine, even though they
might actually be the same machine.)

Then finally a word WRITE\_PEF or WRITE\_MACH is executed which writes
out the native application so far generated, as a PEF or Mach-OF file
(which is the normal Mac OS format for a native PowerPC application).

Subsequent generation of the full PowerMops system consists of running
the new native application, and loading all the other necessary files in
fully native mode.

Before CROSS-time, we have to redefine some immediate words such as IF,
so that although they are still running on the 68k (which they need to
be, since we're going to execute them!), they will generate PowerPC
code. These are in the files qpCond, qCase, qpCreate, qBase, qpClass and
qArgs. Notice that all these filenames start with 'q'. This is just an
arbitrary convention to make things a bit more understandable. Then we
execute CROSS and build the nucleus'these files are setup, pnuc1,
pnuc2, pnuc3 and pnuc4. (CROSS itself is at the start of setup.)

Then we need to load the immediate words again, but this time they'll
be native. This is done in the files pBase, pArgs and qpClass. Note that
these files start with a 'p' -- except for qpClass, which gets
loaded at 'q' time as well. I have been able to use conditional
compilation of the form PPC? \[IF\]\...\[ELSE\]\...\[THEN\] to be able
to get most of the Class-related code into one file. (The flag PPC? get
set true by CROSS).

Then while we're still target compiling, we need to load other Mops
files up to where class File is defined, otherwise our new PowerPC
application wouldn't be able to save itself to disk. So we have files
pStruct, pString, pBytestring and pFiles.

Then after that, we target compile the code generator, by loading the
files cgx again. Then we write out the PEF or Mach-O file for the new
PowerMops application (PMops), and our target compilation is finished.

Now we fire up PMops, and continue loading files. These are mainly the
normal Mops files, but a few need a special customized version. I had to
think of another initial letter for these, and since this is the last
time, I used 'z'. So we have files zBase, zArgs, zClass, zStruct,
zModules and zPEF or zMachO (which is a modified version of the code
generator file cg4). A few of the other Mops files have 'z' versions
as well.

## Performance

I expect the performance will be quite competitive with C or even
assembler. If you have a look at the source, you'll notice that there
are very few words written in assembly. I originally rewrote a couple of
others in assembly to compare them, but found that the code that had
been generated from the high-level version of those words wasn't
significantly different! So I ended up only writing those words in
assembly that absolutely had to be, because they needed access to
special registers or whatever.

## Install

This is a little simpler than in the 68k version. You don't get a
separate dialog for setting the stack and dictionary sizes, since we
only needed that in the 68k version for saving a new nucleus. On the PPC
we assume you won't be adding to the dictionary, and you can set the
heap size via a SIZE resource or by using 'Get Info' from the Finder,
once you've created your new application, when on Mac OS 9.

So when you install, you now go straight to the 'second' install
dialog. When you click 'OK', you'll get a standard file dialog for
saving the new application. If you change your mind about its name, you
can do it here if you want to.

If you want to create a 'FAT' application (with native code for both
68k and PPC), at the moment you'll have to build a 68k and PPC version
separately. Then you can use ResEdit to copy all the resources of the
68k version to the PPC version. Here's one way you might do this:

1. Let's say you want your final fat application to be called
    'MyApp'. Start 68k Mops, load your source files, do Install. Call
    the application 'MyApp_68k'. Use ResEdit to copy your resources
    over to MyApp_68k.
2. Now run PowerMops, load your source files again, and do Install.
    This time call the application 'MyApp'. When you're finished, run
    ResEdit, and this time copy ALL the resources in MyApp_68k over to
    MyApp. This will include all your usual resources, since you copied
    them to MyApp_68k before, and it will also include all the CODE
    resources from MyApp_68k, which is where all the compiled 68k code
    lives.

That's all you have to do. MyApp should now be a fat application, which
will run in native mode on both the 68k and PowerPC.

In a future Mops version I might provide a simpler way to handle this
process, but as you can see it's not very difficult as it is.

## Shared Libraries

PowerMops allows you to both call and compile shared libraries. Shared
libraries are intended to replace things like extensions or
INITs&\#148;they are a little like applications, but in another way they
are a bit like additions to the Toolbox, in that they contain routines
that can be called from any application, which can do all sorts of
useful things. And although they may be being used from several
applications at once, only one copy of the shared library's code need
be in memory. Another feature of shared libraries is that all calls to
them use the standard PowerPC calling convention, which means they can
be written in any language, and called from any language.

This last point means that since PowerMops can produce a shared library,
you can write code in Mops that can be called from some other language.

### Calling a Shared Library

You do this in a rather similar way to calling the system. You must
first declare your library, like this:

PEF shared library:

`library MySharedLib`

Mach-O framework:

`framework Myframework.framework`

(As with `SYSCALL`, the library name is case sensitive.)

Then you declare all the calls you want to make to that library using
the new word `LIBCALL` (PEF shared library) or
`FrwkCall` (Mach-O framework) (the name is deliberately
similar to `SYSCALL`). You use `LIBCALL`
and `Frwkcall` like this:

PEF:

`libcall myEntry { parm1 parm2 %parm3 -- result }`

Mach-O:

`frwkcall myEntry { parm1 parm2 %parm3 -- result }`

You'll notice that the syntax is similar to the declaration of named
parameters. A floating parameter has '%' in front of it. We have to
specify all this parameter and result information since Mops doesn't
otherwise have it available (unlike SYSCALLs, for which we have the
xcalls file). However the parameter syntax is exactly as for named
parameters for normal Mops words. If the call returns a floating result,
you indicate this the in way you'd expect:

`libcall [or frwkcall] myFloatWord { %parm1 parm2 -- %float_result }`

The library that will be used is the one given by the nearest preceding
LIBRARY/FRAMEWORK declaration.

The only possibilities for returned results are integer, floating, or
nothing. This is determined by the C/Pascal convention, in which
functions or procedures can only produce one result at most. We have to
observe this convention for shared libraries, because as we mentioned
above, they have to be callable from any language.

If you are writing a shared library in Mops, you are not bound by this
limitation for your internal words in the code for your library. But for
your 'entry points' --- the words that are to be callable from the
outside world --- you do have to observe this convention.

### Generating a Shared Library

You generate a shared library via a new option in the Install dialog.
Generating a shared library is a special case of Install, since in both
cases we're producing an executable file that runs independently of the
Mops development environment.

Now, you need to be able to specify which words in your shared library
you want to be callable from the outside world. These are 'entry
points' to your library. You declare them like this:

```bash
`:entry  myEntry  { parm1 parm2 %parm3 -- result }`\
`       <your code> `\
`;entry`\
```

That should look familiar! It's the same as the word we called with a
LIBCALL or FRWKCALL above. You'll see that the syntax is basically the
same. And here, the parameters not only have the same syntax as named
parameters; they really ARE named parameters. You access them within the
definition of `myEntry` in exactly the way you expect.
(And of course you can have local variables in the definition as well,
if you want.)

------------------------------------------------------------------------

  ------------------------------------------- ----------------------------------- -----------------------------------------
  [Reference 9](Reference_9)       [Reference](Reference)   [Reference 11](Reference_11)
  [Documentation](Documentation)                                       
  ------------------------------------------- ----------------------------------- -----------------------------------------
