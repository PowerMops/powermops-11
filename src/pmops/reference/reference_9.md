---
title: Implementing an Application
layout: default
---

Once you have a blueprint for the class hierarchy of a program, you're
ready to structure the program, actually write the source code, and then
assemble the pieces into a self-running Macintosh application. In this
chapter, we provide the details for the following steps:

-   Structuring the program for keyboard and/or mouse input;
-   Creating readable source code files;
-   Compiling your code and predefined classes with load files;
-   Debugging the program;
-   Installing the program as a standalone application.

Structure of a Typical Application
----------------------------------

In most Mops programs for the Macintosh, a handful of classes will be
the primary, high-level building blocks for your application. Into these
blocks go the specific processing that make your program unique.

**Windows** tend to contain the major sections or 'mini-applications'
within your code. They will contain a number of **Views**, each of which
will handle its own area of the window. The views will probably have a
number of subclasses to handle the different kinds of items in the
window. **Controls** are one such subclass of View, and usually
determine control paths within a given part of the application, or can
be used to provide a more convenient mechanism for setting options. Much
of the important code in your application will probably be called via
the `DRAW:` and `CLICK:` methods of these
various View classes.

**Menus** give the user a means to choose another part of the
application or to alter an option setting.

And **Dialogs** are special-purpose windows that focus the user's
attention on a specific choice or set of choices.

Bringing Objects to Life
------------------------

All of the above classes create objects that are recognized by both Mops
and the Toolbox. When your application starts up, it generally must send
`New:` or `GetNew:` messages to all of
these dual role objects (Mops and Toolbox objects that are needed
immediately. Such messages cause the objects to make themselves known to
the Toolbox, and to allocate any heap data that the Toolbox needs to
keep track of the objects' states. Then the application will begin
listening to events --- thereby becoming sensitive to the user's
keyboard and mouse input.

Waiting for Events
------------------

Mac applications, rather than simply starting at the beginning and
working through to the end, are **event driven**. That is, they
basically sit waiting for the user to ask for something to be done, by
clicking, typing a key, selecting a menu or whatever. When something has
to be done, the program is notified via an event. The program acts on
the event, and then waits again. The waiting loop is called, naturally
enough, the **event loop**. Mops simplifies this for you by providing a
word, `EventLoop`, which executes this loop. The
definition isn't very complex:

```bash
`: EVENTLOOP`\
`       BEGIN`\
`               next: fevent`\
`       AGAIN ;`\
```

`FEvent` is our one-off object of class
`Event`. The `next:` method makes the
system call `WaitNextEvent`, which returns to the program
when an event is ready. The `next:` method then executes
the appropriate action handler which Mops has set up for this kind of
event. This will usually lead to a message being sent to some object in
your program.

On the other hand, in Carbon PowerMops the definition of
`EventLoop` is much more complex and procedural. Carbon
event handling is the task of callbacks. We should write our event
handling as a callback word and register it in each system object. Then,
if we call `RunApplicationEventLoop`, appropriate word
would be callbacked on an event by OS. Ideally this system call function
could have replaced our word `EventLoop`. But
unfortunately processing much task in a callback sometimes causes
trouble. Especially, compiling code in a callback is unsafe. So we
should call `QuitApplicaitionEventLoop` and execute
appropriate words out of the callback in some cases. As the result,
`EventLoop` in PowerMops contains some conditional
branches.

The grDemo source file (explained in the Tutorial) provides a simple
example of an event-driven Mac application, and is worth examining
rather closely for the manner in which the program and user communicate
with each other.

Apple Events
------------

Mops is "System 7 friendly". Among other things, this means
that it recognises [Apple
events](http://developer.apple.com/documentation/Carbon/Reference/Apple_Event_Manager/index.html),
which are described in [Inside
Macintosh](http://developer.apple.com/techpubs/mac/IAC/IAC-2.html),
volume VI. Mops handles the &\#152;core' Apple events: OpenApplication,
OpenDocuments, PrintDocuments and QuitApplication. These have to be
available in the nucleus, so that the nucleus can be properly System 7
friendly. We have provided handlers for these Apple events, as required
by Apple. The code for the handlers themselves is in assembler, so is
not available for modification (and wouldn't mean much to most people).
However, we have also provided four corresponding vectors (vects) so
that your application can customize things.

The handlers do some setting up, call the appropriate vector, then do
some winding up. These handlers are `:PROC` and
`:CALLBACK` routines --- they get called from the
system, and return to the system, i.e. they are **callback routines**.
As the handlers do the `:PROC` and
`:CALLBACK` bits already, the words you put into the
vectors are ordinary Mops words.

When an Apple event handler is called from the system, there are three
parameters on the stack:

`( ^AE ^AEReply RefCon -- )`

`\^AE` is a pointer to the Apple event itself.
`\^AEReply` is a pointer to an Apple event that can be
used for a reply from the handler. RefCon is a longword that has been
associated with this particular Apple event by the caller --- this
can be used for anything. The Mops Apple event handlers first call the
word AEhandler, which does the setup housekeeping. It pops these
parameters into the values `fAE`,
`AEReply` and `AERefCon`. It then
redirects `AbortVec` and `QuitVec`, first
saving the old values. This is because within a `:PROC`
routine we mustn't `Quit` or `Abort`. If
either of these is called during the execution of the Apple event
handler, a Mops error number is put in the value (ERR\#), and the
handler winds itself up and returns to the system. Back in the Mops
event handling code, which originally called the system to handle the
Apple event, we bring up a Mops error in the usual way.

After calling `AEhandler`, the Mops Apple event handlers
call their particular vector to do whatever processing is necessary to
handle this Apple event. They then branch to some common windup code
which takes some action depending on the result returned from the vector
(see below), then restores the previous values of
`QuitVec` and `AbortVec` and returns to
the system.

> **Warning:** In Carbon PowerMops, all Apple event vectors
> described below are `NULL` at present. Apple event
> handling scheme described below also has been changed in Carbon
> PowerMops.

The Apple event vectors are `OpenAppVec`,
`OpenDocVec`, `PrintDocVec` and
`QuitAppVec`. We will now describe the first three of
these, and leave `QuitAppVec` for later, as it is the
exception.

These three vectors have the stack effect

`( -- code True | -- False )`

If False is returned, the default handler windup is used, which performs
the recommended system calls to check if we got all the parameters and
returns the appropriate error if not. If True is returned, we assume
that the event has been fully handled within the vector routine, and so
we return straight to the caller --- the code is the result code
that gets passed back. The default for these vectors assumes that the
Mops development environment is running, and does the appropriate
things.

OpenDocVec finds the number of files in the given list of files, and
puts the number in the value `\#DocsToOpen`. It then
handles each file in the given list of files by opening it (read and
write permission) using the default file object fFcb, then calling the
vector Read1DocVec to read and close it. If this is sufficient for your
application, you just have to redirect Read1DocVec appropriately, as we
describe in the next paragraph. As set up, `Read1DocVec`
assumes the file is a Mops dictionary.

`Read1DocVec` must point to a routine which will read the
file designated by the file object `fFcb`, close it, and
return a result on the stack. True indicates the
`OpenDocVec` loop can continue, i.e. open the next file
in the list of files passed by the system, and call Read1DocVec again.
False means the loop must terminate. You could return False, for
example, on an error, or simply if your application can't accept more
than one document open at a time.

If you decide to redirect `OpenDocVec`, you will have to
take care of getting the details of the files 'dropped' on your
application youself. In brief, this involves a call to
`AEGetParamDesc` to get the docList, then a call to
`AECountItems`, then a loop through calls to
`AEGetNthPtr`, which returns the pointer to the info
about the Nth file. The procedure is complex, and involves a large
number of parameters, so read the appropriate section of [Inside
Macintosh](http://developer.apple.com/techpubs/mac/IAC/IAC-2.html) very
carefully first. It is perfectly possible to get your application to
open it's own documents tidily just with redirection of
`Read1DocVec`.

`PrintDocVec` is set to the same routine as
`OpenDocVec`, since it doesn't make sense to try to
print a Mops dictionary. Your application really ought to do something
different if it supports printing.

`QuitAppVec` is the exception, in that it is NOT called
from the `QuitApplication` Apple event handler. This is
because if you try to quit to the Finder from inside an Apple event
handler, you'll crash! You MUST return in the normal way from an Apple
event handler, or the system won't be pleased with you at all. So what
our `QuitApplication` handler does is set a flag
`QuitApp?` and return. Then back in normal Mops
execution, after handling an Apple event, we check if
`QuitApp?` is True, and if so, we execute
`QuitAppVec`. This code is in the source file Event. The
current setting for `QuitAppVec` is simply to call
`BYE`. Your application will probably want to do
something a bit more intelligent.

Well, sorry about that terribly long winded dissertation on Apple
events. They do represent a major new addition to Apple's system, and
are decidedly nontrivial to handle and describe!

> **Note:** Unfortunately, you must write your Apple event
> handlers almost from scratch in Carbon PowerMops (see file CarbonEvents)
> at present. But, on the other hand, you can use
> `Class\_AEDesc`, `Class\_AEList`, and
> `Class\_AEAddress` classes defined in file AEClasses.

## Compiling Your Source

As you write portions of your program, you can load them into Mops (they
compile while loading) to let the compiler search the code for errors
and to let you fully test how well the code executes. You won't
necessarily save the compiled program until a logical section is
completed and debugged --- once you save a compiled chunk of code,
you will no longer be able to edit what is saved. Instead, while you're
reworking a section, you should maintain your program as text files and
load them into Mops each time you want to test the code.

When you load a typical program, you will be doing so on top of Mops.dic
(or MopsFP.dic), which contains a number of -- but not all of
-- Mops' predefined classes already compiled. It is important to
understand how source files for your program and the optional predefined
classes should be loaded onto Mops.dic. When you loaded the grDemo in
the Tutorial several predefined classes were automatically loaded before
loading in the grDemo code. This was done by the `NEED`
command at the start of the grDemo file. The sequence of loading is
important, but can easily be handled by `NEED`.

Incidentally, Mops has a powerful **file stack** facility that allows
you to nest loads up to six deep. Thus, a file loaded by
`NEED` can also `NEED` other files. When
this happens, Mops stacks the currently open file (i.e., temporarily
interrupt loading of one file) and begins loading the new file. When the
second file load is complete, the load of the original, stacked file
resumes on the line following the `NEED` statement.

### Switching Between Compiler and Editor

When you compile a source file the first time, you may discover that an
error crops up, at which point, the compiler displays a message
directing you to the problem area and stops loading. You'll then want
to go back into the source file to remedy the problem. This can be done
as simply as switching windows to your editor. If you're using
QuickEdit, it will have already scrolled your source file to the right
place.

Your process of program building will take the following steps:

-   Using the editor, load an existing source file or create a blank
    page for new work.
-   After entering a few definitions, you may want to test them. Save
    your work in the editor (an easy step to forget!), switch to the
    Mops window and type L (for load), or choose Load\... from the File
    menu, or type Command-L. A dialog box will come up. Select your
    source file, and it will load. Alternatively you may type //
    followed by the name of your source file, if you don't want to have
    to reply to a dialog box.
-   After doing this once, you can reload the same file (having made
    changes or additions) by typing `RL`. Mops remembers
    which source file you are using, via a special dictionary entry
    which is added automatically when a file begins loading. When you
    type `RL`, Mops first does a FORGET --- although
    not really the effect of the word `FORGET` in
    PowerMops --- back to that point in the dictionary, then loads
    the file. If you just want to FORGET back to that point but not load
    the file, type `FM` (Forget to Mark).
-   In the event that you made a mistake in your coding, Mops will
    report an error of some sort. Switch to the editor window, edit your
    source file, save, switch back, and `RL`.

If you have been accustomed to working with a compiled language like C
or Pascal, you might be somewhat startled by the immediacy of Mops while
you are in the editor. It can speed your development time tremendously
to be able to interact with the language as you write, and you should
learn to do this often (sometimes it's easy to forget). Frequently, in
the time that would be taken to remember something while editing, you
could have gotten an answer directly by using the full power of Mops'
interpreter.

### Saving Compiled Programs

You can Save an image of the dictionary at any point during compilation
of your source (this is different from installing a finished
application, as described later), by selecting Save as&\#133; from the
File menu. This creates a binary image on disk of that portion of the
dictionary from the top of the nucleus up to the last word compiled.
Save your work often, because you can always use FORGET or FM to remove
any part of the dictionary other than the nucleus. It is good to do a
Save just before loading any file that is in a questionable state or in
the process of being debugged. Then, if the machine crashes, you need
only double-click on the saved image's icon to get right back to where
you were.

You can have several saved images on a disk without causing any problem.

As you will see in the next chapter, we have changed this slightly for
PowerPC Mops, where we actually save the whole dictionary, including the
nucleus, each time.

### Other Compiling Tips

When loading a file that has never before been compiled, select Echo
During Load from the Mops menu to cause each line of the file to be
echoed to the screen as it is loaded. If an error occurs while you're
watching a file load, you'll have a much better idea of where the
problem is.

For files that you know well, disable Echo During Load for a much faster
load, but you won't get as detailed messages if an error occurs during
compilation. You might then use WORDS to determine the last name loaded
into the dictionary&\#148;this should be the name of the word containing
the error.

After an error, Mops prints the contents of the file stack&\#148;the
file at the top of the stack is this file containing the error. You can
pause an echoed load at any time by hitting the space bar. You can then
either continue (by pressing the space bar again), or abort the load (by
pressing a different key).

## Debugging Your Code

You should begin debugging as soon as you have a small section of code
that compiles successfully. Start testing the lowest-level words or
methods first, so that you can establish a firm base of code that you
have confidence in. Call these words interactively (i.e., from the Mops
prompt), setting up reasonable parameters on the stack, and then using
the .S stack dump to determine if the results are correct. You can also
use the Debugger utility to step through a definition instruction by
instruction. We will describe this utility shortly.

### Evaluating Error Messages

It's quite possible that in the early stages of program development,
you'll generate a Mops error during execution or compilation of a word
or method. If this is the case, find the error in the Error Handling
section of this manual (not yet in existence) and try to determine the
precise cause in your code.

Frequently, Mops might catch an error that is actually an indirect
result of another problem which Mops did not catch. For example, if your
code accidentally overwrites the header of a previously defined array,
upon execution, the error will point to the array, when, in actuality,
the problem is with the errant code. Another example would be a number
accidentally left on the stack that doesn't interfere with execution
until much later in the program. In cases like these, you must work
backwards, tracing the origins of each value on the stack, and seeing if
it makes sense. Eventually, you will find the word that is producing an
incorrect result, and make a change in the source code accordingly. It
can be very helpful to place statements in your code that print out key
data values.

### System Errors

Sometimes, your code will produce an error that is caught by the
Macintosh system before Mops becomes aware of it. In these cases, unless
you have Macsbug installed, you will get the 'bomb box'. The most
common system error codes are 2 (when the CPU tries to access an illegal
address) and 3 (when the CPU attempts to execute data as code). You'll
probably have to reset your Mac if you're not using Macsbug, but if you
are using Macsbug (always a good idea when testing code) you may be able
to resume by typing:

`a5=currenta5<br /> g 1e4`

Sometimes, however, enough 'damage' will be done to the heap or 68000
register contents to necessitate a restart, even with Macsbug installed.
Therefore, be sure you save your source code files. This will provide
you with a safe record of the code that caused the errors.

If you tried to execute a `@` or `W@`
operation on an odd address, such as 2001, you would generate a System
Error 2 (only on 68000 CPUs). The 68000 processor has a set of
instructions that are optimized for even addresses, and some Mops words
use these instructions in their code. Odd address errors can be caused
directly in the manner described, but are more likely to result from a
different problem that just happens to generate an odd number which then
gets used as an address.

Macs with 68030 or 68040 CPUs won't generate odd address errors, but
will give a 'bus error' if something is used as an address which is
outside the range of legal addresses for that machine. As with odd
addresses, these are most likely to arise from some other problem which
leads to something being used as an address which isn't really an
address. Note that we store an illegal address value, which is also odd,
in nil handles and pointers. Thus any attempt to use a nil handle or
pointer will give either an odd address error or a bus error depending
on the CPU.

Any fatal system error is best tracked down by first finding the precise
location where the error occurs. Do this by testing words interactively,
and then reasoning out why the offender isn't working properly.

A System Error 28 means that the system stack (the Mops data stack) has
grown down into the top of the heap. Because Toolbox routines use the
system stack for their data storage, stack overflow can occur if a
deeply nested Mops word calls a Toolbox routine that uses a lot of
stack. You can use the [ Install Utility](lesson_22)
(described in the Tutorial) to adjust the proportions of heap available
for the stack and the dynamic heap.

Some errors may cause the machine to lock up, make strange sounds, or
break up the video. In these cases, the code has destroyed something
essential to the operating system before either Mops or the Macintosh
Operating System could detect it. The only choice here is to reset the
Mac and try to determine where the code is going wrong. You might want
to scatter ." messages through your code, which can print values and
strings to keep you posted on where the code is executing at a given
moment. This will help you narrow down the location of a problem fairly
quickly.

## Your Application Icons

We have already described the use of the Install utility in the final
Tutorial lesson. Here we will discuss how to give your application and
its documents their own icons.

There is a complex interplay of resources within a Macintosh application
that describe an application and its icons to the Finder. You may want
to read "Structure of a Macintosh Application" in [Inside
Macintosh](http://developer.apple.com/techpubs/mac/IAC/IAC-2.html)
before proceeding, especially if your application manipulates its own
document files. We will describe here only the steps that relate to Mops
and your application.

When you first use Install to create your application, it has no icons.
You can use ResEdit, Icon Edit or various other utilities to create
icons. If you give them the expected resource IDs, you can paste them
straight into your application using ResEdit. The expected IDs are 128
for the application itself, and 129 to 132 for the various document
types which your application uses. Your icon editing utility will have a
way of specifying the resource IDs of the icons.

Assuming you have created a resource file using one of these utilities,
and that you have given the icons the right IDs, do the following:

1. Start ResEdit, then open both your new application and your icon
    resource file
2. Select your icon file, and do Select All (Command-A), then Copy
3. Select your application
4. Do Paste, then Save
5. Quit ResEdit

Your application may not appear with its new icon immediately, since the
Finder keeps icon information in its own 'desktop file'. If you close
and then open the window containing your application, this may cause the
Finder to recognize the new icon.

However, in case of **Mach-O** application, data fork icns resource is
needed for the application icon. Your application installed from Mach-O
PowerMops is a Mach-O application. It will be a not yet packed folder
structure of the application bundle at first. Assuming you have created
a data fork icns resource file, do the following:

1. Rename the icon file to be "app.icns"
2. Put your icon file in "yourApp:Contents:Resources:" folder
3. Complete your application bundle packaging by adding .app extension
    to the name of outer most folder of your application bundle, i.e.
    rename 'yourApp' to 'yourApp.app'

"app.icns" is set as a default application icon file name in
file 'info.plist'. You can change it by editing the info.plist file.


