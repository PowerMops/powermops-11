---
title: Miscellaneous Topics
layout: default
---

## ANSI Standard

Mops is fairly close to the ANSI Forth standard. If you load the file
ANSI, the remaining differences are dealt with, and you should, we hope,
have a conforming ANSI Forth system, implementing the CORE word set, the
ERROR and ERROR EXT words, and most of the CORE EXT words. Thus ANSI
standard Forth programs using these word sets should be able to run
under Mops.

Note that Mops selectors are not consistent with the standard, since
under the standard, word names ending with colon must be normal Forth
words. We have therefore provided a value SLCTRS? which if set to false
will disable selectors. The file ANSI sets this flag false. Set it back
to true if you need to.

## Local Sections and Temporary Objects

Local sections are an extension to the named parameter/local variable
scheme. Local variables are so useful, that there could be a tendency to
make definitions too long, simply because you need to keep a number of
local variables around. Local sections remove this problem, since they
allow local variables to have a scope which extends over several
definitions. Within a local section, all words have access to the named
parameters and locals.

You begin a local section with the word `LOCAL`. The
syntax is e.g.:

`LOCAL LocName { parm1 parm2 \ loc1 loc2 loc3 -- }`

The word LocName is the 'main' word of the local section,
i.e. the one which takes the named parameters and whose entry causes any
locals to be allocated. It must be the last word defined in the local
section, using `:LOC` and `;LOC` in place
of `:` and `;`. `LOCAL`
doesn't start the definition of this word; it functions like a forward
definition. It is really a means of making the names of the parms and
locals available to the compiler at the start of the local section. All
the words defined between `LOCAL` and the
`;LOC` at the end of the main word, can access the
parameters and locals. These words can be called freely from other
definitions within the local section, but must not be called from
outside, for obvious reasons.

We also have local sections for methods, which work in a similar manner.
You declare a local section for methods with `MLOCAL`
instead of `LOCAL`. `:MLOC` commences the
definition of the 'main' method, and `;MLOC`
ends the definition of that method, and ends the local section.

Temporary objects are rather like local variables. They could also be
called 'local objects' but the word 'local' is
being used for enough things already, so we're calling them
'temporary'. It's the same thing, though. They are normal
objects in all respects, except that they only exist within one
definition (or local section), and have no storage allocated otherwise.
The syntax is as in this example:

```bash
`: SomeWord`\
`temp{  int     anInt`\
`       var     aVar`\
`       string  aString  }`

`       123 put: anInt`\
`       " hello" put: aString`\
`       ...`\
`;`\
```

You can also use the syntax

`temp { ... }`

with '`temp`' and
'`{`' as separate words, if you prefer. I
tend to use both, depending on how many temporary objects I'm
declaring, and how I want to format the declaration.

As you can see, within the definition you can use the temporary objects
in exactly the same way as normal objects. They are actually allocated
in a frame on the return stack. However you can use
`>R` etc freely in the definition, since I keep a
separate frame pointer. Of course, the temporary objects get a
`classInit:` message automatically when the definition is
entered and their space is allocated. They also get a
`release:` message automatically when the definition
exits (either at the semicolon or via `EXIT`). Thus if
you use a temporary string as in the above example, you don't have to
worry about sending it `release:` to get rid of its heap
storage at the end of the definition.

As with local variables, if you call a definition recursively, you will
get a fresh copy of any temporary objects. The syntax for temporary
objects within a local section is exactly as you would expect:

`LOCAL localName { parm1 parm2 \ loc1 loc2 -- }`\
`temp{  int   int1`\
`       var   var1   }`

The local variables here are entirely optional. A local section can have
either local variables, or temporary objects, or both. (Not much point
in having neither!!)

## Case Statements

We provide no less than three different flavors of case statement in
Mops; each of these is most suitable in a different situation.

The first is the Eaker model, and was described [in the
Tutorial](Lesson_12#The_CASE_Decision). We'll use expr1,
exprn2 and so on to mean any code that leaves one result on the stack.

`expr1`\
`CASE   expr2 OF some code      ENDOF`\
`       expr3 OF some more code ENDOF`\
`       default code comes here`\
`ENDCASE`

This form of case construct compiles directly to a set of equivalent
simpler operations:

`expr1 expr2 OVER =`\
`IF     some code`\
`ELSE   expr3 OVER =`\
`       IF      some more code`\
`       ELSE    default code`\
`       THEN`\
`THEN`\
`DROP`

As you can see from the equivalent Forth code, If any of expr2,
expr3\... matches expr1, the associated code is executed and then
control passes to after the whole case construct. If none match, the
default code is executed. Note also that right at the end, a
`DROP` is done to get rid of the expr1 value --- this
means that the default code can be left out completely without leaving a
spurious value on the stack. But if you consume the expr1 value in the
default code, remember to put a dummy value on the stack to be consumed
by the `DROP`. Here's a (rather useless) example:

`CASE   10      OF              ." ten"         ENDOF`\
`       12      OF              ." twelve"              ENDOF `\
`       13      OF              ." thirteen or sixteen"         ENDOF`\
`       16      OF              ." thirteen or sixteen"         ENDOF`\
`       20 30   RANGEOF ." twenty to thirty inclusive"  ENDOF`\
`       ( default )             ." something else, namely " .`\
`       0       ( to be consumed )`\
`ENDCASE`

Notice that the `ENDCASE` consumes one value off the
stack, and also that there's no easy way of handling different values
which lead to the same action (as in 13 and 16 above).

The second type of `CASE` we have in Mops is a keyed
case, in which a test value is compared to succesive values in a linear
list. Here's the equivalent of the above example:

`CASE[ 10 ]=>                ." ten"`\
`    [ 12 ]=>                ." twelve"`\
`    [ 13 ], [ 16 ]=>        ." thirteen or sixteen"`\
`    [ 20 30 RANGE]=>        ." twenty to thirty inclusive"`\
`    DEFAULT=>               ." something else, namely " .`\
`]CASE`

This format will compile to more compact code than the former example,
and should execute significantly faster. The former
`CASE` syntax has the advantage that the test values are
computed each time, so can be different on different executions, if this
is what you want. If, however, your test values don't change, which is
more likely, the latter `CASE\[` syntax is better to use,
since the test values are obtained at compile time and compiled once and
for all into the code. As you may gather from the syntax, compilation is
turned off and on when obtaining the test values, so that for example
you could put `CASE\[ value1 value2 + \]=>` etc. The
arithmetic will take place at compile time.

You can also see that there's a straightforward way of handling
different values giving the same action. You can also use
`RANGE\],` with the expected meaning.

The third type of case we have is an indexed case. In this kind of case,
a direct table lookup is done to determine the outcome. Here's our
example again, with one change:

`SELECT[ 10 ]=>              ." ten"`\
`       [ 12 ]=>             ." twelve"`\
`       [ 13 ], [ 16 ]=>     ." thirteen or sixteen"`\
`       DEFAULT=>            ." something else, namely " .`\
`]SELECT`

Notice that the syntax is almost the same as for the keyed case, but
that there's no equivalent of the range test. This is precisely because
it uses a direct table lookup rather than a series of comparisons. Later
we might implement the filling in of a range of entries in the table, in
which case we could implement the range test. But we haven't done this
yet.

This code is the fastest of all to execute, since one direct lookup is
done on the table. However in some situations this construction may take
up too much space. The table which is generated will contain two bytes
for every value in the range between the highest and lowest test values.
Thus in this example the table will have an entry for every integer
between 10 and 16 inclusive, i.e. 7 entries, which will take 14 bytes.
This would be fine, but in many situations the table would be enormous.
Mops will assume that an attempt to build a table of more than 500
entries is an error, and give a message.

## Recursion and Forward Referencing

You may occasionally wish to call a word from within its own definition
(this is called **recursion**). At first glance you may think that the
logical thing to do would be to simply use the word's own name. (This
was actually the way things were done in Neon, the forerunner to Mops.)
However you may often want to call an earlier word with the same name,
in the situation where you are redefining the word to have similar but
slightly changed behavior. For this reason it is now standard Forth
practice to 'hide' the name of the current definition while
it's being compiled, so that a dictionary search won't find it, but
will instead find an earlier word with the same name, if there is one.
This is what Mops does as well. We therefore need another way of
specifying recursion, and this is done, logically enough, with the word
`RECURSE`. Using `RECURSE` means that you
are calling the current definition.

If a situation arises in which you need to reference a Mops word before
it has been defined, you can use Mops' **forward reference** facility.
Before the word can be referenced the first time, you must declare it as
forward in the following manner:

`forward newWord`

This declares newWord as a forward referenced Mops word. Later, when you
are able to define newWord, you must do so in the following manner:

`:f newWord ... ;f`

`:f` is a special colon compiling word that resolves
forward referenced definitions. It creates a headerless entry for the
new word in the dictionary, and then sets the previous entry, built by
`FORWARD`, to branch to the new definition. This will
cause all compiled references to the `FORWARD` definition
to actually execute the later definition. If you forget to resolve a
forward reference with `:f \... ;f`, you will see a
message at runtime informing you of the exact nature of the unresolved
forward reference.

An important example of forward referencing is the word
`OK?` This is used in many places in the predefined
classes and modules to check the return code from file and other I/O
operations:

```bash
forward        I/O_ERR         \ ( err# -- )  Call when there's an I/O error.

: OK?          \ ( rc -- )  A useful word to use after an I/O op.
       ?dup  0EXIT  I/O_err  ;
```

The word `I/O\_ERR` is not actually defined in the basic
Mops dic.! You won't notice this unless there is an error code
returned, in which case Mops will try to execute
`I/O\_ERR` and give an "unresolved forward
reference" error. You must therefore define
`I/O\_ERR` in any application to handle the error in some
intelligent way, and it must be defined as a `:f\....;f`
word.

## Using Resources in Mops

A resource on the Macintosh is essentially a structured database into
which you can store initialization information for Toolbox objects and
other data items, such as strings. Resources can improve the
maintainability of your program: if you store all of the textual
information for your application in a resource file, for example, it
becomes very easy to convert your application to another language or
change the wording of a given string. Another benefit of resources is
that they shift the burden of storage for initialization values from
your resident code to the dynamic heap, so your application takes up
less memory space.

### Toolbox Resources

There are several ways in which you can use resources with Mops. For
example, Toolbox objects such as Windows generally have two methods you
can summon for bringing a window alive. `NEW:` relies
upon values passed to the method via the stack, and is independent of
resource files. `GETNEW:` uses only a resource ID to find
the template for the object in the currently open resource files. For
instance, a Window would have a resource of type
`'WIND'` (`'wind'` in PowerMops) from
which it would get its size, visible and goAway values, etc. Note that
resource templates such as those of type `'WIND'` only
contain information relating to the portion of the object that the
Toolbox knows about'in the case of a Window, the window record. Other
parts of the object, such as the window actions, must still be
initialized by the application's code. Certain objects, such as those
of class Icon, get all of their data from a resource item, and simply
read the resource data whenever they are called upon to do anything.

Another way to use resources is for non-Toolbox objects that have no
predefined template type. For these objects, you will need to use an
existing type such as STR, or define your own types using ResEdit (see
Putting Together a Mops Application).

### Defining and Using Resources

Mops provides an easy way to define a resource item from within your
application. For instance:

`resource myWind<br /> 'Type WIND 256 set: myWind`

defines a resource called myWind that has type WIND and a resource ID of
256. When you need to access this resource, send the message

`getnew: myWind`

Resource is a subclass of Handle, so you can now obtain a pointer to the
resource data with

`ptr: myWind`

Note that if you then do anything that might cause a heap compaction,
this pointer will be wrong; but you can avoid this with the lock: method
of class Handle, thus:

`lock: myWind`

You can open a new resource file in the following manner:

`" myFile.rsrc" openResFile`

This opens the resource file named 'myFile.rsrc' and make it
the first file in the search order. All open resource files are closed
automatically when your application terminates. Mops uses the file
mops.rsrc for its resources during normal operation, and you can add
your own resources to this file with ResEdit.

> **Note:** At present, `openResFile` is not
defined in PowerMops. You need to use Carbon function like
`HOpenResFile`. For example : 
`0 0 " myFile.rsrc" str255 0 HOpenResFile ( \-- fileRefNum ) `

The source file QD1 includes support for cursors, icons and QuickDraw
pictures via the resource interface. This makes it very easy for you to
dress up your application with fancy graphics that you can create with a
graphics application, and then add them to a resource file.

## Clearing Nested Stacks - Become

In a non-hierarchical, non-modal environment such as the Macintosh, the
user is generally free to select another menu choice or open a different
window at any time. This could happen while your code is nested several
levels down, listening to events. If the user selects a new menu option
that leads to an entirely new part of the program and your code is
already several words deep on the return stack, the routine dispatched
by the menu will nest several levels more. This could continue
indefinitely until your application runs out of return stack, at which
point it will bomb.

You have two ways to avoid this situation. One is to create an inverted
architecture for your program, such that its event loop is at the
highest level, and the code always returns to that level before
listening to the event queue. This implies that you can never use
`KEY` from within a called word, but only from the
highest level. This may often be a good solution, but in other
situations it may not lead to the easiest or the clearest implementation
of a particular problem.

Mops gives you an alternative method by providing you with a Mops word
called `BECOME`. `BECOME` causes Mops to
erase everything that currently is on the stacks, and resets them to
their normal empty values. Mops then executes the word whose name
follows `BECOME` in the input stream. This automatically
makes that last word the highest-level word in the application. In this
manner you can actually have several mini-applications within one, each
callable from the other. At the point that `BECOME` is
executed, you can rest assured that the stacks are empty and the
application is essentially at ground zero.

## System Vectors

Mops uses a powerful technique called **vectoring** to provide maximum
flexibility for the programmer. Vectoring is the name given to the
process of using a global or local variable to hold the address of a
Mops word. For example, let's say that you would like Mops to interpret
a file from disk just as though you were typing it at the keyboard. A
built-in Mops system vector, named `KEYVEC`, always holds
the address of the word that Mops normally uses to acquire key-board
input. By changing the contents of `KEYVEC` to point to a
special word you define --- a word that reads a single character
from disk --- all Mops words that accept keyboard input will then
take their input from disk, instead of from the keyboard. For example:

```bash
: diskKey Here 1 read: ffcb drop       \ get 1 character from disk
       here c@ ;                       \ place it on the stack

" sam" name: ffcb
open: ffcb .
' diskKey -> keyVec                 \ set KEYVEC to get chars from disk file Sam
```

Of course, in a real example you would have to restore the proper
`KEYVEC` value when EOF (end of file condition) was
reached.

Mops has a full set of vectors for all critical I/O and compilation
routines, allowing you to tailor the behavior of the Mops environment
very easily. These vectors cannot reside in the Kernel, since that would
preclude having several saved images that used different vectors. Thus,
each saved image has its own set of system vectors, located near the
start of the dictionary.

System vectors are slightly different to normal vectors, in that a 0
value may be stored in a system vector. This means that the default
action is to be taken. Each system vector has its own predefined default
word (which cannot be altered).

Here are the main system vectors and their required behaviors ---
there are others that are used internally in the Mops system and should
not normally be changed, unless you really know what you are doing. Also
there are some system vectors relating to Apple events which are
discussed separately later.

  ---------- ------------------------------ ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  KEY        ( \-- char )                   gets keyboard input
  EMITVEC    ( char \-- )                   sends one character to the primary output device
  PEMITVEC   ( char \-- )                   sends one character to the secondary output device
  CRVEC      ( \-- )                        sends a carriage return to the primary output device
  PCRVEC     ( \-- )                        sends a carriage return to the secondary output device
  TYPEVEC    ( addr len \-- )               sends a string to the primary output device
  PTYPEVEC   ( addr len \-- )               sends a string to the secondary output device
  ECHOVEC    ( char \-- )                   handles echoing to the output device of the keys being input by ACCEPT
  ABORTVEC   ( \-- )                        cleans up the stacks and notifies the user of an error. The Mops word CL3 (&\#152;clean-up 3') is normally executed by this vector, and your error word should call CL3 if it is to return to the Mops interpreter
  QUITVEC    ( \-- )                        this word will be executed before the interpreter enters its main loop. It should be the startup word for an installed application
  UFIND      ( \-- xt true OR \-- false )   is a special purpose variant of FIND (this vector is actually called by FIND before FIND searches the Mops dictionary for an occurrence of a particular name at the top of the dictionary \-- HERE. You won't have to worry about this vector unless you plan to write new compiling words for Mops
  OBJINIT    ( \-- )                        initializes certain areas of the kernel at Mops startup. It normally contains the xt of SYSINIT. Should not be altered by the user
  HEADER     ( \-- )                        lays down a dictionary header
  ---------- ------------------------------ ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Defining and Compiling Words

Much of the Mops language is, itself, written in Mops. This seemingly
unlikely loop is possible because Mops is an **extensible** language
--- meaning that you can write new words in Mops that modify or
extend the basic behavior of the language itself. In a sense, every word
that you write extends Mops, because it adds to the same dictionary used
by the Mops system. There are three layers of extensibility in Mops:

1. **Vocabulary extensions** Whenever you write a new word,
    instantiate a new object, create a new Value, and so on, you are
    extending the vocabulary of words that succeeding words can use.
    This obviously adds more power and function to the language.
2. **Class extensions** When you define a new class of objects,
    you are extending Mops in a somewhat more profound way than in a
    vocabulary extension. Creating a new class creates a new template
    for building other objects. These templates are known as **defining
    words**, because they can, themselves, define new dictionary
    entries. This is a powerful technique, because there is a good
    chance that you will be able to reuse defining words in your other
    applications. Eventually, you'll develop a large library of
    Classes, which should make your future application development much
    easier.
3. **Compiler extensions** The deepest layer of extensibility
    is concerned with constructing the tools that create defining words.
    Words such as `:CLASS` or `:M` are
    specialized compiling words that can truly extend the language
    syntax and add entirely new features. Compilers are the inner soul
    of the Mops language. They create control structures (such as
    `IF`, `BEGIN` and
    `DO`), Mops' class compilation facility, message
    processing, prefix operators\...even colon itself is an example of a
    Mops compiler word. Mops' compiler words come largely from Forth.

You can use Mops for years without ever writing a compiling word. But if
you are an advanced programmer and are interested in writing compiling
words, the best source of ideas and learning is from the Forth
community. The Forth newsgroup is comp.lang.forth, where newcomers are
always welcome to ask questions. There is also a great deal of Forth
literature around, although you won't usually see it in mainstream
computer bookstores. It can, however, be obtained through the [Forth
Interest Group](http://forth.org)

## Error Handling

Mops' error handling is based upon the ANSI Forth Standard, which uses
the two words `CATCH` and `THROW`.
`CATCH` is used as follows:

`['] someWord catch`

(of course, if interpreting rather than compiling, put
`'` instead of `\['\]`). The action
which takes place is to execute SomeWord, and if no error occurs, push a
zero on top of whatever SomeWord may have put on the stack.

By saying "if no error occurs", we really mean that
`THROW` did not take an error exit.
`THROW` pops the top item on the stack, and if it is
nonzero, it restores the stacks to where they were when the current
`CATCH` was called (assuming that at least one
`CATCH` is in effect). Then the nonzero value, assumed to
be an error code, is pushed onto the stack and execution continues
straight after the `CATCH`. If `THROW`
finds a zero value on top of the stack it means no error, and execution
continues normally.

From this you can see that `CATCH` and
`THROW` provide a flexible means of unwinding out of
deeply nested code if an error occurs. If `CATCH` catches
an error, but doesn't want to recognize that particular error code, it
can simply re-`THROW` it.

If no `CATCH` is in effect when an error occurs, Mops
takes its default error action, which is to display an error message and
execute `ABORT`. `ABORT` sets all stacks
to their empty state, and initializes other Mops system variables to a
suitable value before returning.

Before it executes, `ABORT` executes the System Vector
`ABORTVEC`, to give extra flexibility in error recovery.
Mops normally installs its own error handler word in
`ABORTVEC`, called `CL3`, which prints the
current stack of load files and clears this stack. You should call
`CL3` if you install an error routine for use during
development, although the use of `CATCH` and
`THROW` would probably be better. For your final
installed application, since much of the Mops system won't be present,
the Install routine asks you to specify an error word, which will be
placed in `ABORTVEC`. You should provide a routine which
tells the user what is happening and a suitable action to take (most
likely in an Alert or Dialog box).

There are two error routines that indirectly call `ABORT`
--- `ABORT"` and `?ERROR`.
`ABORT"` must be followed by a space, and then a string
terminated by a quote. Its action at runtime is as follows: if the top
of the data stack is true (nonzero), it will print the string between
the quotes and then execute abort. If false, `ABORT"`
returns without doing anything. For instance, the phrase

`read: theFile abort" File read failed"`

would check the return code from a disk read operation, and abort if it
indicated an error. You can force an `ABORT"` to occur
with the statement `TRUE ABORT" \..."`.

Embedding a lot of error strings in your code can take up unnecessary
memory space, and it also makes the messages difficult to change.
`?ERROR` allows you to specify the actual text for your
error strings in a resource file, and takes the resource ID number of
the string to print, assumed to be a resource of type 'STR ' (note the
space at the end). It works conditionally in the same way as
`ABORT"`. For instance,

`find not ?error -13`

prints the string with resource ID `-13` if the word in
the input stream is not found, and then aborts. Mops uses
`?ERROR` for most of its error messages. If you want, you
can just print a resource string without executing
`ABORT` by using the word `MSG\#`. It
takes a resource ID just as `?ERROR` does. All of the
error words function in compilation state only. To get a list of all
messages and their numbers, type

`.msgs`

If you want to add a new message, do it this way:

`<msg number> " the text of your message" addMsg`

If you want to change an existing message, you can't just use
`AddMsg` as above or you'll get an error --- this is
just as a safety check. You have to remove the existing message first,
thus:

`<msg number> removeMsg`

If adding your own messages, please use numbers above
`200`, so as not to clash with future error messages we
may want to add to the Mops system.

For an error while loading with echo off, the last word in the
dictionary will usually be the word that experienced an error.

The file Mops.rsrc is a resource file containing all of Mops' error
messages. Whenever one of the error words executes, it checks that
Mops.rsrc is open. Of course, you must have Mops.rsrc within the folder
Mops &fnof;, or Mops won't be able to find it.

## Assertions

Assertions are provided by a number of programming languages, and are a
very useful way of catching bugs. Assertions allow you, during
development, to ensure that things are the way they're supposed to be
at key places.

Mops assertions must come within definitions. You use them like this:

`ASSERT{ <something that evaluates to a flag>  }`

If `ASSERTIONS?` is true, this will give error
`216` ('assertion failed') if the evaluated
flag is false. If `ASSERTIONS?` is false, nothing will
happen -- the code between `ASSERT{` and
`}` is skipped.

`ASSERTIONS?` can be defined and redefined however and
whenever you like, as long as it returns a flag.
`ASSERT{` tests it via `EVALUATE`, so the
most recently defined definition will be the one that gets looked at.
You can define it at the start of your project, or at the start of each
source file, or more often. It's up to you. This way you can enable or
disable `ASSERT{` to suit whatever you're doing in your
project development.

Note also, wherever you have `ASSERTIONS?` defined as a
constant with value `false`, no code will even be
compiled for the assertion test. You can use this for code that you know
works, so that there's no performance penalty whatever.

## Inline Definitions

You may specify that a definition or method is to be compiled inline
whenever it is used. This allows faster execution. The syntax is:

```bash
: XXX inline{ <some code>} ;
```

The code `<some code>` is stored as a string, and
whenever `xxx` is compiled into a definition, the string
is compiled using `EVALUATE`. We actually store the
source text for `<some code>` as a string, and
`EVALUATE` it. This can give very good compiled code due
to our optimization, which is why we took this approach. This syntax is
really equivalent to

```bash
: XXX " <some code>" evaluate ; immediate
```

but the syntax is probably clearer. It also has advantages when used in
methods. The syntax for an inline method is as you would expect:

```bash
`:m YYY:`\
`       inline{ <some code>}`\
`;m`\
```

We assume that inline code chunks will be fairly short, and are to be
optimized for speed. Therefore, when compiling the inline code (on an
early bind), we do not change the machine's address register which
normally points to the current object's base address. A normal method
entry involves saving the previous base address on the return stack and
setting up the new value, then popping the previous value when we exit
the method. Thus making a method inline saves significant time at the
cost of a little space. The file Struct has many methods which use
inline code, so if you look there you will see plenty of examples of how
to do it.
