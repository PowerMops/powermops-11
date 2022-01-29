---
title: Calling the Toolbox
layout: default
---

Toolbox calls are calls you make to the Macintosh Operating System.
Sometimes a distinction is made between 'Toolbox calls' and 'System
calls', but this distinction isn't really relevant to us here, so I
will use the term 'Toolbox calls' to refer to all calls to the Mac OS.

Mops 2.7 on, you should use the word `SYSCALL` to set up
your Toolbox calls, as we described in the Tutorial. In fact, in
PowerMops, you *must* use this syntax, since the old syntax (call xxxx)
isn't supported any more, as indeed it couldn't be on the PowerPC.
Here's an example of a word to set the cursor:

```bash
`syscall GetCursor              \ Note: these are CASE-SENSITIVE!`\
`syscall SetCursor`

`: set_my_curs { curs# -- }`\
`       curs#                   \ push cursor #`\
`       GetCursor               \ Returns handle to cursor`\
`       @                       \ needs to be a pointer for SetCursor`\
`       SetCursor`\
`;`\
```

Note the following points:

1.  You have to 'pre-declare' any Toolbox call you're going to use,
    outside any definition, and before any definition in which you do
    the call. It doesn't matter if you use `SYSCALL`
    several times over for the one call&\#148;in different source files,
    say --- subsequent ones will be ignored.
2.  The name of the Toolbox call (following `SYSCALL`) is
    case-sensitive, unlike everything else in Mops! This was
    unavoidable, because of the way Toolbox calls are handled on the
    PowerPC. So for example, if we had put `syscall
    getcursor` above, we would have copped a compile-time error
    message telling us that Mops couldn't find the name.
3.  The returned result from a function is simply pushed on to the stack
    --- in earlier versions of Mops you had to push a zero there at
    the beginning to make room, but this is now not needed.
4.  Likewise, the words `makeint`,
    `I->L`, `Word0`,
    `pack` and `unpack` are no longer
    necessary for Toolbox calls although, as we shall see later, they
    may be necessary for **callback** routines, routines that are
    **called from** the Toolbox. You may not have to worry about these.
    `Makeint` etc. are used for manipulating 16-bit
    quantities on the stack. With `SYSCALL`, you simply
    push the parameters onto the stack in order, and don't worry about
    whether they are 16 or 32 bit. Mops reads information bytes stored
    with the `SYSCALL` declaration in the dictionary,
    figures things out and adjusts the stack before executing the
    calling sequence. (On the PowerPC, the lengths will be different
    --- generally a fixed size of 32 bits, and they're passed in
    registers, not the stack,. so we really had to do something about
    this.)

SYSCALL and the Universal Headers
---------------------------------

As many of you no doubt know, for the last few years Apple has been
releasing updates to its API in the form of 'Universal Headers' (for
C) and 'Universal Interfaces' (for Pascal). (API stands for
"Application Program Interface", and covers all Toolbox
calls, the data structures which participate in those calls, and
system-defined constants.)

In Mops, we have always provided a way of accessing the Apple API via
the Tools module, which provided the words `CALL`,
`KONST` and `GLOBAL`. The Tools module
gets its API information from some files which I obtained around 1991,
so are quite a bit out of date now.

In 1992 I collaborated with Xan Gregg who was developing Power MacForth
for Creative Solutions, and I wrote a program to parse the Universal
Headers and produce output files which would be suitable for reading by
both MacForth and Mops. `SYSCALL` is implemented by a new
module, CallsMod, which when it is compiled reads in a file called
'xcalls' which my program generates (this file should be in the Module
Source folder). All the API information we need is read out of this file
and built into the dictionary of CallsMod when it compiles.

This means that we are now up to date with the latest Apple information,
and it will be easy to keep up to date in future.

CallsMod also implements `KONST`, which functions exactly
as it did before. But CallsMod does not implement
`GLOBAL`. This word is still available as it was, via the
old Tools module, but it now definitely isn't a good idea to refer
directly to low memory globals. The Universal Headers (and therefore
`SYSCALL`) provide accessor functions to do what you used
to do by directly accessing the globals. But most importantly, in future
systems such as
[Rhapsody](http://en.wikipedia.org/wiki/Rhapsody_%28OS%29), the globals
will not be there any more!

I know there are still a number of places in the Mops system where I
access globals directly, but I'll be trying to get rid of these
progressively.

> Note: Rhapsody has been realized as Mac OS X. Now that
> PowerMops runs with Mac OS X, the task described above has been
> completed.

## Time and Space

The Universal Headers are large, so the xcalls file turns out to be 1.4
megabytes long. We achieve some savings by encoding the information
stored in the dictionary in CallsMod, but CallsMod.bin still weighs in
at over 700K. This means that there must be this much heap space
available when you use `SYSCALL` in Mops. I have
therefore increased the default and minimum partition sizes for Mops to
2500K. If you reduce it much below this, you won't be able to use
`SYSCALL`.

But note, this increased memory footprint won't apply to installed
applications, since these won't contain CallsMod (unless you need it
because you do compiling at run time in installed apps&\#148;in this
unusual situation, you will need the memory space).

CallsMod also takes quite a while to compile, if you have a slower Mac,
take a long coffee break. CallsMod will be compiled when you compile up
the Mops system for the first time, so this will be an even longer
process than it was before. Sorry, but normally you'll only have to do
it once per new Mops release. Such is the price of progress.

You may conclude that once you've compiled up Mops, you can trash the
xcalls file. This is right, but probably not a good idea in case you
need to recompile the Mops system at a later date for any reason (such
as to incorporate bug fixes).

(Bugs? What bugs?)

Toolbox Data Types
------------------

For all Toolbox data types which are 32 bits long or less, you just push
the value onto the stack before doing the call. Thus you do this for the
common types Integer, Boolean, Char, Longint, and Pointer. Other data
types are either stored in a 32-bit cell, or you pass a 32-bit pointer
to a longer data structure. Any composite structure longer than 32 bits
(e.g. a Rect) uses a pointer when passing it as a parameter.

When a Toolbox routine specifies a VAR parameter, this is a call by
address, and must use a pointer to the actual data structure, even if it
is an Integer or a Long. This is because the Toolbox will actually
change the value of the parameter, and needs its location to do so.

Procedure and Function Calls
----------------------------

Toolbox routines have been, for historical reasons, defined in terms of
the Pascal language. More recently, Apple have been defining the
routines in terms of C, so you may encounter examples of either. They
can be either **Procedures** or **Functions**, depending on how the
Toolbox responds to their calls. In C terminology, we would say that
they either return a result or don't. If they return a result, they
return only one --- Mops will let you write a definition that
returns several results, but Pascal and C don't, and so the Toolbox
doesn't do this either.

Here are examples of typical Procedure and Function calls, first with
the (Pascal and C) definitions as in [Inside
Macintosh](http://developer.apple.com/techpubs/mac/IAC/IAC-2.html), then
with the equivalent Mops code:

Pascal:

`PROCEDURE InvertRndRect (r: Rect; ovalWidth, ovalHeight: INTEGER);`

C:

`pascal void InvertRoundRect (const Rect *r, short ovalWidth, short ovalHeight);`

Mops:

```bash
`syscall InvertRoundRect`

`rect   myRect                  \ declare a rectangle object`

`: InvertMyRect { rWidth rHeight -- }`\
`       addr: myRect            \ get a pointer to the rectangle`\
`       rWidth rHeight          \ push width and height`\
`       InvertRoundRect         \ call the Toolbox routine`\
`;`\
```

&nbsp;

&nbsp;

Pascal:

` FUNCTION GetNewWindow (windowID: INTEGER; wStorage: Ptr;`\
`    behind: WindowPtr) : WindowPtr;`

C:

` pascal WindowPtr GetNewWindow (short windowID, void *wStorage, WindowPtr behind);`

Mops:

`syscall GetNewWindow`\
\
`[let's say we're in a method in the Window class here]`\
\
`get: resID             \ get this window's resource ID (ivar)`\
`^base                  \ addr of this window object window i.e. wStorage`\
`-1                     \ in front of all other windows i.e. behind window -1`\
`GetNewWindow           \ call the Toolbox routine`\
`put: windowPtr         \ save the returned window ptr (ivar)`

## Accessing System Constants

You may sometimes need to access system constants which Apple defines by
name. You do it thus:

`konst <name>`

and the value corresponding to `<name>` will be pushed at run time.

## Callback Routines

"Callback routines" are definitions you write which you
don't call from your Mops code, but which get 'called back' by the
Toolbox, for example a routine that gets called repeatedly while the
mouse button is held down inside a scroll bar, or a routine that
provides the functionality of a user-defined item in a dialog.

Mops defines the most common callback routines for you, which implement
the normal behavior. However you might occasionally need to do something
special with a callback, so we provide a way to write your own. This
isn't quite as easy as normal Mops programming, but hopefully if
you've got as far as writing callbacks you'll be able to handle the
slightly increased complexity. A future Mops version may make this
simpler, but this doesn't have a very high priority, and so probably
won't happen very soon.

Here's an example of a callback routine, taken from the class
`Control` (68k Mops) or `RootCtl`
(PowerMops).

PowerMops:

```bash
`' NewControlActionUPP  ' DisposeControlActionUPP`\
`:callback  CtlProc  { ^ctl part# -- }  \ on PPC, callback parms must be named`\
`   part#  ctlExec`\
`;callback`\
```

68k Mops:

```bash
`:proc CtlPROC      \  ( ^ctl int:part# -- )`\
`   word0  nip  ctlExec`\
`;proc`\
```

Note firstly, that callbacks are a bit different on the 68k and on the
PowerPC, so we have to use some conditional compilation to handle the
differences. A short preliminary word of explanation will make it
clearer why this needs to happen. The Mac OS on the PowerPC has to be
able to tell if a callback is in native PowerPC code or 68k code which
needs to be emulated. So, whereas on the 68k you just pass the address
of a callback routine to a Toolbox call which uses that callback, this
can't be done on the PowerPC since the system then wouldn't have any
way of telling what kind of code is used by the callback.

So, on the PowerPC (CFM), instead of passing the address of the callback
itself, you pass the address of an information block. The information in
this block tells the system where the callback is, as well as what sort
of code it consists of. The address of such an information block is
called a 'Universal ProcPtr', or UPP for short.

In Mops, we handle the setting up of these information blocks for you.
The word which introduces a callback is '`:callback`',
and you terminate the definition with '`;callback`'.
`:callback` expects two xts on the stack. These xts are
of a pair of special system calls which are defined for that particular
callback, and tells the system about the parameters it must pass to the
callback. You will need to consult [Inside
Macintosh](http://developer.apple.com/techpubs/mac/IAC/IAC-2.html) for
the name of the appropriate functions for your callback. These names
should always have the form
"`New<something>UPP`" and
"`Dispose<something>UPP`". When Mops
encounters '`:callback`' in your code, it creates an
information block for that callback, and puts the xt values in the
appropriate place in that block, where the system expects it.

When you tick a `:callback`, Mops assumes that you're
going to pass a UPP to the Toolbox, and it automatically gives you the
UPP (the address of the information block).

One more thing to note is that you must declare the parameters for your
callback as named parameters. This tells Mops which PowerPC registers
will contain the parameters, when your routine is called.

Now for callbacks on the 68k. The word which introduces a callback is
'`:proc`', and you terminate the definition with
'`;proc`'. In complete contrast to the PPC version, you
must not use named parameters or local variables in a
`:PROC` word. If you want them, the safest thing to do is
to have the `:PROC` word directly call an ordinary Mops
word. The parameters passed by the system to your routine will be on the
stack. However, the shorter data types (16 bits or less) will occupy
only 16 bits. So you will need to use the words that Mops supplies for
manipulating half-size stack cells (`word0`,
`pack`, `unpack`,
`makeint`, `i->l`,
`tbool`). These are almost obsolete, since our
`SYSCALL`-based way of calling the Toolbox means you
don't have to use them any more when you call the Toolbox. However,
this is the one place where you might still have to use them. As we said
above, we might address this inconsistency in a future Mops release, but
it doesn't have a high priority at present.

Example: if you have a user-defined object in a dialog, the Toolbox will
call the routine you provide with a pointer the the dialog (32-bit) and
the number of the item (16-bit) on the stack. Your
`:PROC` might look like this:

```bash
`:proc mydrawitemproc ( dlgptr w:item -- )`\
`       i->l                 \ convert 16-bit to 32-bit`\
`       MyDrawItemWord`\
`;proc`

`: MyDrawitemWord { dlgptr item -- }`\
`                               \ the value 'item' is now a 32-bit value and can `\
`                               \ be taken off the stack normally by Mops`\
`(Do your stuff here)`\
`;`\
```

If the callback requires you to return a result to the Toolbox,
typically a boolean, you must adjust the Mops True or False on the stack
(32-bit) to be 16 bit. You also need to convert from a Mops True (-1) to
a Toolbox True (1), if necessary. You can do this with the word
`TBOOL`, as in `TRUE Tbool`. As this
messes up the stack as far as Mops is concerned, you do it right at the
end of your `:proc`.
