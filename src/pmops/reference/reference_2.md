---
title: Classes and Objects
layout: default
---

Building a Mops program is largely a process of defining classes of
objects --- classes which are the 'framework' and objects which
are the "movers and doers". In this chapter, we provide you with
details of the inner workings of classes and their components, with
special emphasis on instance variables and methods. We'll also discuss
several Mops words that may be particularly useful in building your own
class definitions. You won't need to know everything in this chapter to
be successful at building classes, but you should at least survey the
information. It may come in handy later, as your programming skills
grow.

## Planning Your Subclasses

Mops comes with many predefined classes --- building blocks, which
have been designed to be as general as possible. Your application will
probably require more specific behavior than the predefined classes are
capable of, in which case you will want to define one or more of your
own subclasses of existing classes. Your program's unique operations
and flavor will be the result of the behaviors you define in your
sub-classes.

## The Class Hierarchy

Determining the relationship between a new class and existing ones is an
important step in designing a Mops program. The relationship should be
guided by the way in which the new class is to rely on instance
variables and methods of classes already defined.

A subclass can add new instance variables to those of its superclass,
but it can never redefine the original ones. Therefore, a new class
should be defined as a subclass of another *only* if the instance
variables of the superclass are needed for objects of the new subclass.
If you find that an object of a subclass is not using many of the
superclass' ivars, then the subclass should probably be a subclass of a
different class.

Methods, on the other hand, can be redefined in subclasses without
hesitation. It is practical to carry through the methods of the
superclass that apply to the subclass, and then redefine or add new ones
where needed to give the subclass its unique properties. Of course, the
more methods a subclass inherits, the more compact the code will be.

Multiple inheritance can be a powerful technique if used judiciously. If
overdone it can cause unnecessary complexity, but used wisely it can
simplify things considerably. Let's say a class
`MyClass` has three superclasses, `sup1`,
`sup2` and `sup3`. In an object of
`MyClass`, the ivars corresponding to
`sup1` will come first, then those of
`sup2`, then those of `sup3`. In typical
Forth laid back manner, we don't check for any clashes in method names
in the superclasses. When we look up a method name in
`MyClass`, we look at the methods declared in
`MyClass` itself first, then in `sup1`,
then in `sup2`, then in `sup3`. If, say,
that particular method name had been declared in both
`sup2` and `sup3`, the one in
`sup2` will be used, and the one in `sup3`
will never be accessible within `MyClass`. In typical
Mops fashion, we provide an out for this problem: as we saw in [Lesson
19](Lesson_19#Positioning_Views) of the Tutorial, when
referring to a method of a superclass, we use the syntax
`aMethod: super`. We can be more specific and use
`aMethod: super> aSuperClass`, where
`aSuperClass` is the one containing the method we want;
this overrides the normal left-to-right search.

If more than one of `MyClass` and any of the superclasses
is indexed, we do a check that the specified indexed widths are the
same. We give an error if this condition isn't met.

Of course this isn't the only possible approach we could have taken to
multiple inheritance. For example we could have had the ivar regions
overlay rather than concatenate. We could do this as an option later, if
anyone wants it.

For a good example of the use of multiple inheritance to simplify code,
look at the class `Ordered-Col` in file Struct, and its
associated classes.

## Choosing Between ivars and Objects

In addition to designing the class inheritance of your application, you
will have to decide what should be an instance variable and what should
be a public object. Because an instance variable is invisible to objects
other than its owning object, any communication between an ivar and
other objects must be passed explicitly through the ivar's owning
object. If you find yourself creating numerous 'passthrough'
methods that are only there to provide access to a single instance
variable, you should reconsider your design. It probably indicates that
the instance variable should more appropriately be a a public ivar (see
below) or a global (and therefore public) object.

A good example of this kind of realization occurred when we wrote the
grDemo source file. In an earlier version, the three scroll bars were
designed as instance variables of the window. We found, however, that we
were sending many messages to the scroll bars by way of the window
object. By changing our strategy and making the scroll bars public
objects, the program now has more direct communication to the scroll
bars with the added bonus of shortening the source for grDemo by
approximately 30 percent. Ideally, then, your objects should do most of
their communication internally (i.e., sending messages to self, super,
or ivars). Keep to a minimum the number of messages that are to be sent
between objects. This minimizes inter-object coupling, makes objects
more independent, and makes your application more maintainable.

## When to Use ivars

But there are times when it makes sense to define instance variables, as
we originally tried in grDemo. For example, whenever you find that one
object communicates frequently with only one other object, it is likely
that one of those objects should be an instance variable of the other.
The same holds true when you find it necessary to create objects in
pairs (or other multiples) instead of creating two similar
objects, consider creating a third object that consists of two instance
variables. If the window in grDemo had been intended as a
general-purpose class instead of a one-time application, it would have
made sense to keep the scroll bars as ivars, because it would be easier
to add the entire window to later applications.

Much of the work that goes into writing a Mops program should be devoted
to designing object boundaries. A well-planned application will be much
more understandable at the source code level. By clearly defining class
functions, a better sense of structure will prevail. This, after all, is
what object-oriented programming is all about, and you will probably
need to work with objects for awhile before you really fine-tune your
ability to create an optimal design. The best design is one in which
inter-object communication is minimal and well-defined, reflecting
clearly the structure of the problem being solved.

## Defining a Class

Now, let's take a closer look at the mechanics of building a new class.
A class definition has the following skeletal structure:

```bash
:class  ClassName  super{ super1 ... superN } [ n indexed ] [ large ]
       [ instance variable names ] 
       [ method definitions ] 
;class
```

In the above example, the brackets indicate optional sections of a class
definition. If you build a class with one superclass that omits all of
the optional sections, it will behave in exactly the same manner as its
superclass, because you will not have added any ivars or methods to make
the new class any different. **ClassName** is the name that you assign
to the new class. **super1** etc. are the names of existing classes that
are to be the basic models for the new class. The word **indexed**, when
preceded by a number, defines the width in bytes of each indexed
instance variable cell for the new class. An indexed width of 0
indicates that the class is not indexed; if this number is nonzero, the
class will require that a number, indicating the number of elements, be
on the stack when the class is instantiated (i.e., when you create an
object of that class). Thus, the line of Mops code, 3 Array A1, builds
an **indexed object**, called A1, of class Array that has 3 indexed
elements.

If you include the word LARGE in your class definition, you are saying
that this is an indexed class, and its objects may have more than 32k
indexed elements. Indexing operations on LARGE classes will use 32-bit
arithmetic, which will slow accesses very slightly (on 68000-based
machines only --- Plus, Classic, SE). No bounds checking is done,
since the CHK machine instruction, which we use for bounds checking,
uses only 16-bit index values. For these reasons, don't use LARGE
unless you really have to.

Note that you can declare as LARGE a subclass of an indexed class which
isn't LARGE. But this isn't really a good idea. Any methods inherited
from the superclass won't know that the class is LARGE, so if they try
to access the indexed area they won't do it properly. For example, they
will execute a CHK instruction, checking the low 16 bits of the index
against the low 16 bits of the limit! This for sure won't be what you
want. So in this kind of situation, you had better know what you're
doing, and only inherit methods which don't access the indexed area.

## Ivars

Next in a class definition come the instance variable declarations,
which are simply statements of the form:

`[ # of elements ] ClassName ivarName`

  ClassName here is the class that defines the characteristics of the ivar. Each ivar declaration statement creates an entry in the private **instance variable dictionary** of the class currently being defined. The entry for each ivar contains fields for the header, data, and a pointer to the class specified by the ivar's ClassName. An instance variable definition is really just a **template** for the private data of the object. When an object is created, the object's data area is assembled (i.e., memory space is reserved) according to the specifications in the template.

  ![](/pmops/IVars.png "fig:IVars.png")

  Figure 2-1---Instance Variables and Objects   Notice that the 'object' in the diagram has some 'Mops info' at the start --- as we mentioned in [Lesson 5](Lesson_5#Defining_a_Class) of the Tutorial, Mops objects have 8 bytes of extra information at the start. Part of this extra information is a pointer to the class of the object, as we show in the diagram. (We'll give the full details of this extra information in the technical section later).
  
Then comes the first ivar, so this is the start of the actual data area of the object.

Instance variables are also objects. The main difference (other than the
private/public distinction) is that they can be declared as part of a
'record', and in this case their 'Mops information' is omitted, as
we discussed in Lesson 5.

In a practical example, a Toolbox Rectangle is stored as 4 consecutive
2-byte integers (the x and y coordinates for the
`TopLeft` and `BottomRight` corners). To
pass these parameters to the Mac Toolbox, it is most convenient to map
this structure with 4 Int ivars (each 2 bytes wide), using the
`68k_record {...}` syntax, knowing that the 2 bytes of
data for each Int will be adjacent to one another.

### For Advanced Mops Programmers

Indexed ivars also have, in addition to the Mops info, a 6-byte indexed
header. The data in the indexed header consists of the number of indexed
elements and the length (in bytes) of each element. This data is used
for **range checking**.

### Ivars as Toolbox Data Structures

As you may have noticed in the sample applications in the tutorial,
instance variables are very often used as representations of the data
structures that the Macintosh Toolbox expects to see when Toolbox calls
are made. In essence, the list of ivars creates a mapping between the
data fields in an object and a structure that the Toolbox recognizes.
The Toolbox structure might only be a subset of the entire body of data
in the object, as it is in the case of class Window.

In defining a new class that calls a Toolbox routine, you will often
need to map the layout of the class's data structure to mirror a
Toolbox data structure (Toolbox data structures are listed at the end of
each section of [Inside
Macintosh](http://developer.apple.com/documentation/index.html)). To map
the data such that the Toolbox will be able to use it properly, define
all of the Boolean fields as Byte ivars, Integer or Char fields as Int
ivars, and all Long (32-bit) Handle or Pointer fields as Var ivars, and
remember to use `68k_record {...}` around the whole
group of ivars.

If there is a section of the data record that you will not need named
access to (e.g. data that never changes in the course of a program, but
must be in the object's data structure for the Toolbox call), you can
save ivar dictionary space by using the `BYTES`
pseudo-class to allocate a string of bytes with a single name. For
instance, the following ivar declaration:

```bash
var    v1
20     bytes   junk
var    v2
```

builds a data area that has two 4-byte `Var`s,
`v1` and `v2`, with 20 bytes of data,
called `junk`, between them. The Toolbox will use this
area, but the object will never need to access it directly. This is more
space efficient than assigning individual names to a lot of little
fields --- names that will never be used because the data placed
there never is used by Mops. `BYTES` actually builds an
ivar entry of class `Object` and then reserves a data
length equal to the number that you declare. This means that, if
necessary, you can get its address with the addr: method. But don't
send it a `length:` message, since this will always
return zero (the length of an `Object`). Note also that
`BYTES` is **not** an indexed data type like
`bArray` --- it creates one named field, not an array
of bytes.

### How ivars are Linked

  This table shows the format of an instance variable dictionary entry. It bears some similarity to a standard Mops dictionary entry, except that the ivar name is converted to a hashed value (a compacted form automatically derived from a complex math algorithm). All of the ivar entries for a given class form a linked list back to the root of the ivar chain (see the left column of [Figure 2-1](#fig2-1)). This root is the pseudo-ivar, `SUPER` (`SELF` and `SUPER` exist as instance variables in class `META` --- the superclass of the all-encompassing class OBJECT). The **message compiler** detects references to these two special ivars, and begins the method search in a place appropriate for each. Therefore, when a new class is being defined, the ^class field of `SUPER` is patched (directed) to the new class' superclass, and that of SELF to the new class itself. In this way, the search for a given method automatically begins in the proper place for `SELF` and `SUPER` references.
  
![](/pmops/IVarFields.png "fig:IVarFields.png")

Figure 2-2---Instance Variable Fields

### Potential ivar Errors

There is an **extremely** small possibility that you could get an ivar
redefinition error when loading a new class, even if the names of the
two ivars in question are different. Because the names of the ivars are
hashed, two different names could conceivably generate the same hash
value. This situation should be extremely rare, since we use a 4-byte
hash value. But if it arises, try a different name for one of the ivars.

## Methods

After all of the instance variables are declared, you must write the
methods for the new class. A method definition takes the form (here
brackets denote optional sections):

```bash
:m SELECTOR: [ { named args \ local vars -- results } ] 
       [ method code ]  ;m
```

A valid selector name (any alphanumerics ending in a colon) must follow
the `:m` (separated by at least one space). The selector
becomes the name of the new method in the dictionary. A class' method
has access to all public objects, to all instance variables of its own
class and all of its superclasses up the chain, and to
`SELF` and `SUPER`. A method can use any
previous methods already defined in the current class, and can recurse
by simply using the name of the method being defined with
`SELF` as the receiver. Be sure to use
`SUPER` rather than `SELF` as the message
receiver in a redefined method if you want to call the original method
in the superclass.

### Special Mops Words for Primitive Methods

You will find that the methods that you write for classes at the ends of
long superclass chains consist primarily of messages to ivars or
`Self`, instead of a lot of Mops words or primitive
operations. You can see an example of this in the predefined class,
`Ordered-Col` (see Basic Data Structures in Part III),
which has several superclasses.

But you may find it necessary from time to time --- especially after
you've gained some experience defining simpler classes --- to
define a new class that uses primitive methods involving direct access
to the class' data area. An example of this kind of object is class
`Var` in the Struct source file, which manipulates its
data directly. Several Mops words described below will come in handy for
writing primitive methods like this.

### ^BASE and ^ELEM

You can use `^BASE` (pointer to the base address of the
current object) from within any method to place the **base address** of
the current object onto the stack. Note that `^BASE`
leaves the same address as the phrase `Addr: self`, or
that left by using the name of the object in another word or method.
This address points to the data field of the object, which also happens
to be the beginning of its named ivar data area.

Primitive methods generally have to get the base address of the data
area, and then perform some kind of fetch or store operation at that
address. The get: method for class LongWord, for instance, could have
been defined in this manner:

```bash
:m GET: ^base @ ;m
```

which fetches the longword (32 bits wide) at the object's data area.
For a `LongWord` this is the entire data area, defined as
a single ivar: 4 Bytes Data. The actual definition of
`get:` in class `LongWord` is somewhat
different, since it compiles inline code for speed.

Because a primitive method will often be the code that gets executed
after a long chain of nested messages, it pays to make it as efficient
as possible. Mops has very fast code operations for its most often used
primitive methods.

Indexed classes, for example, have an extensive set of primitives for
their most often-used operations. `LIMIT` returns the
maximum number of cells allocated to an indexed object. After the phrase
" `3 array a1` " (creating an indexed object,
`a1`, of class array, with 3 data cells), executing
`LIMIT` within one of `A1`'s methods
would produce 3 on the stack. `^ELEM` (pronounced
"pointer-to-element") expects an index on the stack to begin
with, and leaves on the stack the address of the corresponding indexed
element; it will invoke an error routine if the class is not indexed.
(Incidentally, `^ELEM` performs **range checking** to
make sure the index on the stack is within the range of the index.)
Another fast primitive, `IDXBASE`, leaves a pointer to
the 0th (i.e., the first element) element of an indexed object or ivar
(equivalent to " `0 ^ELEM` " ).

Other optimized primitives you should be aware of are those that access
1, 2, and 4-byte arrays. Instead of using `^ELEM`, it is
faster to use `^ELEM1` for 1-byte elements,
`^ELEM2` for 2-byte elements, or
`^ELEM4` for 4-byte elements.

Finally, the message " `width: self` " will
leave the width of an object's indexed elements on the stack.
