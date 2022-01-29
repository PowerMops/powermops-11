---
title: Coding V. 5.1 and Later
layout: default
---

## Introduction

The reason for this document is that Mops has undergone some significant
evolution since the last edition of the full Manual which was done for
Mops version 4.0. A full Manual update will take a while, so in the
meantime there's a need to provide proper documentation of the changes
to the Mops system which have occurred since the 4.0 release.

Carbon
------

In the Apple world, 'Carbon' is the name given to a new set
of conventions for doing system calls---the "Application
Program Interface" or API. Basically, the reason for Carbon is
OSX. This is really a completely new Operating System with its own API.
However, completely rewriting 'classic' Mac applications
would have been a lost cause, so Carbon provides a solution. It does
this in two ways. Firstly, it provides a new API which is sufficiently
similar to the classic Mac OS API that older applications can be
converted to run under it without a huge amount of work (in theory at
least&\#148;see below). Secondly, it provides an implementation via the
shared library CarbonLib, that runs on both OSX and OS9 (and even later
versions of OS8). Thus applications that have been converted to run
under Carbon (i.e. 'Carbonized'), will run natively under
both OS9 and OSX.

Now I did use the phrase "without a huge amount of work",
but having Carbonized Mops, I can only say that this is somewhat
debatable! Still, the hope is that the impact on Mops source code will
be minimal. Most of the changes are in the internals of different
classes, and if your code hasn't been making too many assumptions about
how classes are implemented, moving to Carbon Mops should be fairly
painless.

An example will make this clearer. Under the classic Mac API, a Window
is represented in memory as a block of information which has a Grafport
as its first section. The details of both the Grafport and Window data
have been documented by Apple in the early [Inside
Macintosh](http://developer.apple.com/techpubs/mac/IAC/IAC-2.html)
editions, and programs could freely make use of this
information---and indeed, needed to in order to perform normal user
interface functions.

Under OSX, however, programs don't need to know anything about the
internals of windows or Grafports, and in fact these internals are no
longer publicly documented. This allows Apple the freedom to implement
enhancements in future, making whatever changes to the internal
structures that might be necessary. Therefore, under Carbon, a Window is
something that is represented to the program as a "window
reference" or WindowRef. (Don't confuse this use of the word
'reference' to Mops references, which are a kind of pointer
to an object.) We aren't allowed to know anything more about what a
WindowRef is --- it's just a 32-bit quantity. Any operations we
want to perform on Windows are provided under Carbon by API calls which
take a WindowRef as one of their parameters.

However, Mops programs using Window objects don't normally need to know
anything about how the windows are implemented internally, and as long
as your code just calls the usual methods to manipulate windows, the
Carbonization changes won't affect your code in any way.

In moving to Carbon, however, there are a few changes that may affect
your code. One obvious change is that Standard File doesn't exist any
more, and has been replaced by Navigation Services Manager support. (See
the file 'Nav' in 'PPC Source'.) This is still
rather preliminary, but provides the basic functionality we need. Thanks
to Gorazd Krosl for this.

Another significant change is that TextEdit doesn't run reliably under
OSX, so we now have a MLTE class (Multilingual Text Engine). Apple
intends MLTE to replace TE. One immediate advantage is that the Mops
editing window is no longer limited to 32k of text.

Another change is to callbacks. These have always been nasty, and have
proved so again. On the PowerPC, to pass a callback to a system call, we
have to use a UPP. Pre-Carbon, there was a generic
`NewRoutineDescriptor` call which we could use for all
callbacks, and our `:PPC\_ENTRY` syntax was based on this
mechanism. However, under Carbon, `NewRoutineDescriptor`
has gone away, and we have to use calls `NewxxxUPP` and
`DisposexxxUPP` (in which `xxx` is a name
which is specific to the particular callback we're doing.)

This has forced a new callback syntax, `:CALLBACK` and
`;CALLBACK`. You have to push the addresses of the
`NewxxxUPP` and `DisposexxxUPP` syscalls
before `:CALLBACK`. See the file
'CarbonEvents' for more comments and some actual examples
you can copy.

Changed Classes
---------------

The following classes are those that have needed significant changes
with Carbonization. The following descriptions should be read in place
of the descriptions in Part III of the manual.

The intent has always been to minimize the impact on existing Mops
programs, and hopefully we have achieved this. By far the majority of
changes are in the internal implementation details; the actual methods
and their parameters and results are by and large unchanged. The biggest
changes are in Event handling.

### Window

Window is the basic class of windows without controls:

  Superclass    Object
  ------------- ----------------
  Source file   zWindowMod.txt
  Status        Core

### Carbon Changes

Windows are no longer subclassed from `GrafPor`t. The
first ivar is `theWindowRef`, which is a (MacOS)
WindowRef for this window. To obtain the window's GrafPort, call the
method `getPort:`.

The other significant change is that the old `ProcID`
parameter which was passed to the `New:` method is now
obsolete, so we've replaced it with the (32-bit) attribute flags value.
The new Carbon window attributes are many and varied, and are all
described in Apple's Carbon documentation. To make things easier, we
have redefined the old `ProcID` constants such as
`DocWind`, to the appropriate attributes value. Thus
calling `New:` with `DocWind` as the
fourth parameter, will have the same effect as before, and create a
generic document-style window.

  Instance variables
  --------------------
  var
  rect
  rect
  rect
  rect
  ool
  bool
  bool
  var
  bool
  bool
  x-addr
  x-addr
  x-addr
  x-addr
  x-addr
  x-addr
  int
  bool
  bool
  rect
  \^view\_in\_focus

\<br\>

  Indexed data
  ----------------
  None
  System objects
  fWind

\<br\>

  Methods
  -------------------------
  setting characteristics
  SetLimits:
  setContRect:
  SetColor:
  SetClipGrowLeft:
  SetClipGrowTop:
  setGrow:
  setDrag:
  setScroll
  setIdle:
  set:
  select:
  size:
  setSize:
  move:
  center:
  show:
  hide:
  actions:
  setAct:
  setDraw:
  title:
  name:
  putRect:
  querying
  getName:
  getRect:
  getPort:
  getVSRect:
  getHSRect:
  maxX:
  maxY:
  active:
  alive:
  event handling
  draw:
  idle:
  enable:
  disable:
  update:
  close:
  release:
  drag:
  zoom:
  grow:
  content:
  key:
  initialization
  classinit:
  runtime control
  new:
  getNew:
  test:
  Error messages
  None

------------------------------------------------------------------------

  ------------------------------------------- ----------------------------------- -----------------------------------------
  [Reference 10](Reference_10)     [Reference](Reference)   [Reference 12](Reference_12)
  [Documentation](Documentation)                                       
  ------------------------------------------- ----------------------------------- -----------------------------------------



