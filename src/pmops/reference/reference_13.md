---
title: Utility Modules
layout: default
---

The Mops system contains several modules providing general functions
that you might want to use in your application. You can do this either
by referencing the imported names from the compiled modules as they are
distributed in the Mops Folder, or by altering the source in the Modules
folder and recompiling it to tailor the modules for your own use.
Modules are advantageous in that they take up very little room in the
resident dictionary, and load themselves only when needed on the
application heap.

The Alert Box
-------------

This module gives you a predefined alert box without having to define
any resources. Use `Alert"` within a word or method to
produce an informatory message. Example:

`readLine: myFcb 2 alert" A read error has occurred"`

If the readLine is successful no alert will appear, but if readLine
returns a nonzero result, an alert box with the given message will be
displayed along with the specific error number. You may use Alert" in
place of Abort" in your final application to comply with the 'Mac
Standard'. Although customized alert boxes are better, this gives
you a "quick and dirty" means of producing an alert box.

To use `Alert"`, you must first include the source file
AlertQ in your application. You may use `NEED AlertQ` to
accomplish this.

You may modify the sizes and positions of any of the items, by using
ResEdit to modify the resources ALRT 900 and DITL 900 in your
application. These resources come initially from Mops.rsrc, and are
copied into installed applications by Install, if the file AlertQ has
been included.

The Decompiler and Debugger
---------------------------

These are only implemented for 68k Mops, and will probably never be
implemented for PowerMops. They're integrated into a single module,
DebugMod, since the job of displaying compiled code is very similar
whether you're decompiling or debugging. To decompile a word, type

`see aWord`

or to debug a word, type

`debug aWord`

then keep typing spaces to step through each instruction. Of course, if
you're debugging, nothing will happen until aWord gets executed.

The display gives a kind of pseudoassembler, since we're compiling
native code. But if you've loaded the source file through the usual
load mechanism, the source will appear in a window at the top of the
screen. If you loaded with logging on (turn it on with +LOG and off with
-LOG) then a 'log file' will have been generated, which will
allow the Decompiler/Debugger to find the right place in the source
corresponding to whatever compiled code you're looking at. The source
window will be scrolled to the right place and an underscore will appear
more or less under the right source text. This will move along as you
step through the compiled code.

If you're running under System 7 and also have QuickEdit running, then
instead of Mops producing its own (rather primitive) source code
display, an Apple event will be sent to QuickEdit asking it to open the
source file. If you type <return> instead of space, then if you
are looking at a call to another word (JSR or BSR), you will go down
into that definition. If you type U, you will come back up again. Q will
quit decompiling/debugging.

If you are debugging, G does a 'go' (return to normal
execution) and N is like G except that you will drop into the Debugger
again the Next time you execute the word you wanted to debug. Typing R
gives you a dump of the machine registers. Typing F (for Forth) gets you
to the Forth/Mops interpreter so you can inspect values etc. Typing
Resume gets you back into the debugger with everything as you left it.

Typing the arrow keys forces scrolling of the source text window.
Keypad-7 goes to the top of the source, keypad-1 goes to the end,
keypad-3 goes forward to the next colon, and keypad-9 goes back to the
previous colon. (These keys are used by Microsoft Word to mean Home,
End, Page down and Page up, respectively, which is why I chose them.)

To decompile/debug in a module, type e.g.

`in aMod see aWord`

To decompile/debug a method, type:

`[in aMod] see aMeth: aClass`

The debugger works fine on both my Mac Plus and IIsi, and even under
System 7. Since I change two interrupt vectors (T-bit and TRAP \#0), it
may not always work on all Macs or systems. It may, and hopefully it
will, but I may not get a chance to try it out. I will be very surprised
indeed if it works on PowerPC Macs.

Be careful if you are using Macsbug --- the debugger replaces the
vectors when it terminates normally, but if the program crashes or
something, the vectors may be left changed, and Macsbug won't then work
properly. Rebooting is the only way out.

If you're running under System 7 and have QuickEdit running as well as
Mops, then as we mentioned above, Debug and See will send QuickEdit an
Apple event asking it to open the source file. You can use this feature
directly, by typing

`edit someFile`

Then assuming that someFile can be found via the normal Mops file
lookup, the Apple event is sent to QuickEdit so that it will open the
file. If the file can't be found, or QuickEdit isn't running, you'll
get an error message. This works also on PPC/OS X.

The Profiler
------------

Again this is only implemented for 68k Mops. The purpose of a profiler
is to give statistics on time spent in various lines of code, and also
the number of times they have been executed. Because of the hierarchical
nature of the language, it seemed to make the most sense to base
profiling on a given word, whose definition is profiled. This way
bottlenecks can be tracked down interactively, and you can zero in on
the places of interest, rather than have to wade through a mountain of
useless information. Anyway, it was easier to implement this way.

To use this feature, the file containing the definition to be profiled
must be loaded with logging on, since the profiler needs to know the
correspondence between the source and compiled code, and this is
recorded in the log file. Once this is done, just type

`profile aWord`

then after aWord has been run, more than once if need be, type

`showP`

and the source code of the definition of aWord will appear on the
screen, with the statistics on the left side of each line. Turn printing
on first for a hard copy.

Profile and showP are in DebugMod. Profiling works by putting a
breakpoint on the first instruction corresponding to each source line.
There is thus a few instructions' overhead on each line, which will
slightly skew the timing results for lines such as aValue IF which only
contain one instruction anyway. We try to minimize this effect by not
counting time while the profiling code itself is running, but the
breakpoint trap and the return instruction (RTE) do take a number of
cycles. Use your common sense. Also, for processor independence, we use
Mac ticks (1/60 secs) to count time. Therefore the word being profiled
ought to accumulate at least several seconds' execution time, for the
results to be very meaningful. Call it repeatedly in a loop, if
necessary. The longer the execution time, the more accurate the results.
If you get a lot of lines apparently taking zero time, this probably
means you need to run the word more times. (But remember, lines
consisting of just THEN, say, don't actually compile any code. So of
course they won't take any time.)

If you're only interested in the execution counts, you don't need to
bother about the length of the run. These counts ought to be right, no
matter what.

Finally, this is a new feature, and it hasn't been very extensively
tested, so please exercise caution (i.e. don't blame me if you crash
without saving).

Runtime Initialization
----------------------

We have a feature to make it easy to do special-purpose runtime
initialization. Some files such as LongMath need an initialization call
on startup (in the case of LongMath, this is to check if the processor
we're running on has 32-bit multiply and divide instructions). Using
several such packages together could cause problems, as each could have
redirected `ObjInit` without being aware of the others.
And yet we want to be able to have standard packages such as LongMath
which don't have to be aware of what other packages may or may not be
present. To avoid this problem, we have an x-array of words to execute
on startup, called `INIT\_ACTIONS`, and these are all
executed right after `ObjInit` is called. This way,
`ObjInit` can be restricted to just initializing the
standard Mops objects, and any extra initialization can be done by
adding a cfa (xt) to `init\_actions`. If you write a
package that needs special startup action, make the startup action into
a word, let's call it `MyStartupWord`, then at the end
of your code put

`' MyStartupWord add: init_actions`

and that's it. If you do a `Forget` or
`RL` (reload) there's no problem, since the Mops loading
code starts by purging `init\_actions` of any xts above
the current top of the dictionary. This prevents
`init\_actions` from getting invalid xts in it.

------------------------------------------------------------------------

  ------------------------------------------- ----------------------------------- -----------------------------------------
  [Reference 12](Reference_12)     [Reference](Reference)   [Reference 14](Reference_14)
  [Documentation](Documentation)                                       
  ------------------------------------------- ----------------------------------- -----------------------------------------



