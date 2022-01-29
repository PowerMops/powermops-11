---
title: Object Creation and Message Syntax
layout: default
---

'Instantiation', or the instantiation of a class, is used in this
manual to mean the creation of an object instance without regard to how
that creation is achieved. For instantiation to occur the instance must
be associated with a class, must be sized if the class is indexed, and
must be named unless created at runtime as dynamic and nameless. Objects
range in complexity from simple BYTEs and INTs through the
"toolbox objects" such as windows and views that participate
in Mac Toolbox operations. Mops provides several language elements
designed to cope with this range of complexity in an economical way.

Message syntax is very uniform unless you need to explicity control the
binding of a message, that is, the association of a message with a
specific method definition. In the simple case no uncertainty about the
receiver's class exists and the binding occurs at compile time (early
binding), but in other cases it must be achieved at runtime (late
binding). The choice between the two, and the attendant tradeoffs, is
dictated by overall program design as discussed in the following
chapter, "More About Objects". Complete syntax for
early-bound messages is given below, and some differences are commented
on.

## Object Declarations vs. Creation Methods

### Declaration Instantiation

All compiled -- as opposed to dynamic -- objects require only
a simple declaration for their instantiation. Typically, the predefined
classes described as basic data structures in Chapter 1 of Part III, as
well as the string, file, floating-point, and vector objects (Chapters
2, 3, 10, 11, and 12) are instantiated in this way. (See below for
toolbox classes.) A declared class instance is implicity created as a
compiled object in the dictionary unless qualified as TEMP. The form of
the declaration is simply

`[array-size] class-name instance-name`

(Brackets indicate optionality.) As can be seen, the declarations for
scalar and array classes differ only in the array-size value that
specifies the number of indexed elements the object is to have. Some
examples are:

```bash
       Var             MAXTEMP
       Uint            MASK_1
       Handle          BUFFER4
32     wArray          GAME_STATE
6      X-Array         IOERR_VECTS
       HandleList      HEAP_OBJS
       String+         LOGDATA
       File            INITIALVALS
       Float           BIGNUMB
16     fArray          BIGNUMBS
       SWord_vector    VECTORVALUE
```

> NOTE: Though constant and value definitions look much
> like array-object declarations, they are not objects but simply
> primitive data items, i.e., Mops words. (Unlike the analogous objects
> they cannot participate in complex objects as either ivars or array
> elements.)

The event-related classes Event and Mouse (Chapter 4, Part 3) would be
instantiated as above but are seldom if ever subclassed as it is very
unlikely that the need to do so would arise.

### Special-case TEMP Declarations

The `TEMP{ \... }` declaration 'envelops', or takes a
list of data-object declarations and declares them to be temporary
within the scope of a word definition or a local section (see
"Miscellaneous Topics", Part 2). Its effect within a
definition is to make the objects local in scope as well as temporary.
An additional effect is to allow an elementary data object to be
instantiated in a register, or in a vector register if a Vector
object.\<br /\> Otherwise the objects declared as TEMP are created in a
memory area on the return stack. The TEMP declaration syntax is

`TEMP{ [ REGISTER ] obj-declaration [ [ REGISTER ] obj-declaration ... ] }`

The optional form `TEMP { \... }` (with white space
characters after the `TEMP`) is equivalent to
`TEMP{ \... }` . A syntax example:

```bash
Temp{                  Var          AVARIABLE
       register        Uint         AUINTEGER
       9               bArray       ABARRAY
       register        Float        AFPVARIABLE
       register        Word_vector  AVECTVARIABLE
}
```

### Creation-Method Instantiation

Nameless dynamic objects, that is, heap-based objects of variable
lifetime, are accessed either individually by a handle or by index into
a collection of such objects (mediated by implicit handles). You declare
either an `ObjHandle` or `HandleList`
object and then send the appropriate object-creation message to either.
The name of the creation method in either case is
`NEWOBJ:` and the class of the desired instance is passed
on the stack (as an xt). Examples:

Note that the deferred tick of the class name gives the method the
needed class information, and that in the case of a
`handleList` the `newObj:` message may
appear within a DO loop that instantiates some required number of
same-class instances.

```bash
(1)    objHandle   SHORTLIFE_OBJ               \ Declaration of handle for object
       ['] Fugit  newObj: SHORTLIFE_OBJ        \ Creation of Fugit-subclass
                                               \ instance
```

```bash
(2)    handleList   BUNCH_OF_OBJS              \ Declaration of a list of implicit
                                               \ handles

       ['] Lotsa  newObj: BUNCH_OF_OBJS        \ Creation of one object with
                                               \ implicit handle
            ...

       ['] Lotsa  newObj: BUNCH_OF_OBJS        \ Creation of another object in the
                                               \ same list.
            ...

       ['] Oddball newObj:  BUNCH_OF_OBJS      \ Creation of an object of a
                                               \ differing class
```

### The Mops Toolbox Classes

Many interactions with the Mac Toolbox are quite complex and so are the
Mops predefined classes and corresponding objects that deal with them.
This is particularly true of objects of the classes (or subclasses) that
facilitate windowing, e.g., `WINDOW`,
`WINDOW+`, and `VIEW` plus a few others
(Chapters 5, 6, and 9 of Part III). Window objects specifically might be
said to lead two lives in that, while they are normal Mops object in
most respects, some portion of their data area is shared between Mops
and the toolbox. (Also, much of the object&\#146;s behavior is
transparent to the user, which is after all the purpose of the toolbox
classes, to hide lower-level detail of toolbox interactions.) Except for
View they all have one or more methods that result in a toolbox call.

Like other objects a toolbox-class object can be created at compile time
by declaration, as is shown in most examples. When necessary one or more
or more can also be created dynamically using either of the
`newObj:` messages discussed above. The one thing that is
different about most classes of toolbox object is that they must be sent
a `NEW:` or `GETNEW:` message to become
effective. While these mesages may superficially look like
object-creation messages they are not but serve to make the existent
object known to, or 'alive in', the Mac toolbox.

Much of the necessary `NEW:` messaging is performed by
Mops automatically and transparently via the class hierarchy. To take a
common example, when the user's code sends a `NEW:` to
an object of class `Window+` (or user-declared subclass
thereof), the receiver's default action is to 'call'
`NEW:` on its contained view which in turn does the same
on any child views, and so on down the line. (Similar default behavior
is defined for other messages as well, such as `DRAW:`)
Thus, not only is the user insulated from system calls and all the
attendant details, but also much inter-object messaging is made as
transparent as possible.

### Message Syntax

The basic form of a message to an object is:

`[ stack-item ... ] selector [ object-name | objPtr-name | SELF | SUPER ]`

where:

<dl>
<dt>stack-item<dt>
<dd>implies any sequence of required message parameters</dd>
<dt>selector</dt><dd>is the name of method to be executed</dd>
<dt>object-name</dt><dd>is the name of the receiver</dd>
<dt>objPtr-name</dt><dd>is the name of the object pointer to a receiver
    object created at runtime in non-relocatable memory</dd>
<dt>SELF </dt><dd>implies the sending object as receiver, with message
    lookup</dd>
<dt>SUPER</dt><dd>beginning in the sender's own class (i.e., last
    defined method) implies the sending object as receiver, but with
    message lookup beginning in the sender's superclass (bypassing any
    message override in the sender's class).</dd>
</dl>

Although the syntax diagram above may look complex, it results in just a
few simple forms. All messages conforming to that syntax are subject to
early binding, i.e., complete resolution at compile time, the standard
for Mops objects and messages. Some examples are:

```bash
" A Window Title"  new:     MyWind2
         elemIdx   at:      stateArray
                   update:  theScreen
         winMsg    Writer:  self
                   clear:   self
                   moved:   super
                   where:   theMouse
```

Sometimes late binding is necessary, however, typically for dynamic
objects or program-design reasons as described in the next chapter. In
this case square brackets, i.e., `[ ]`, usually appear
in the message surrounding the identity of the receiver, which might be
given by a runtime expression. Also, the receiver may be given by an
object handle. Forms such as `selector **` and `selector []`
are possible, as well as `selector [SELF]`

The possible forms of late-bound messages are described in detail in the
"Early Vs. Late Binding" section of the following chapter.

