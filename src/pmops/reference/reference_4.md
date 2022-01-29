---
title: More About Objects
layout: default
---

## Binding

As you know, there are two principal states that the Mops system can be
in. When you first start Mops, the system is waiting for your input,
ready to **interpret** whatever you enter at the keyboard or from a load
file on the disk. This is known as **run state** or **interpret state**,
and when it is active, Mops immediately executes whatever word names you
enter into the input stream. On the other hand, you may wish to create
colon definitions or methods that compile code to be executed later.
After the Mops interpreter sees a colon (or `:m`) and
before it sees the next semicolon (or `;m`), Mops will be
in **compile state**, and rather than immediately execute the words that
it sees, Mops will compile code to call those words into the dictionary.
A colon definition is thus a list of calls to other words that will be
executed at a later time, when the name of the word is seen in the input
stream and the system is in interpret state.

When Mops sees the name of a word and is in interpret state, it attempts
to find a string matching the name string of the desired word in the
Mops dictionary. A very fast search word, called `FIND`,
does this in the Mops system. When you send a message to an object, such
as:

`get: myint`

the first thing that happens is that the selector,
`Get:`, is converted into a unique 32-bit code known as a
hash value. Then the object name, `myint`, must be looked
up in the Mops dictionary and executed to determine the address of its
data. The class of the object `myInt` is determined, and
from that is derived the address in the Mops dictionary of the method
that was defined last for that class. This process is known as the
**binding** of a compiled method, and is necessary to determine what
code will be processed for that particular message. Note that two
different searches must occur before the method can be resolved: the
object must be found as a word in the Mops dictionary, and then the
compiled method must be found as an entry in the methods dictionary for
the object's class.

### Early Binding

If we were to enter the above message when Mops was in compile state,
the search of both the object and the compiled method would occur at
compile time --- during the compilation of whatever word or method
was being defined. This information would already have been determined
by the time that the new definition was actually executed. This is the
default manner in which Mops compiles messages, and is known as **early
binding**. Because most of the work of searching is done at compile
time, the execution of the message can be very efficient, because it was
bound to the actual address of the compiled method in the dictionary.

### Late Binding

There are occasions, however, when it is very desirable not to bind the
compiled method address when the message is being compiled. Consider,
for instance, a situation in which you have a collection of objects that
you need to print on the screen. You might have rectangles, strings,
bitmapped images, and other objects, all in the same collection. Each of
the objects already knows how to print itself by means of a compiled
method for `Print:` that exists somewhere in its
inheritance chain. Your program could be much simpler, however, if it
didn't have to explicitly concern itself with the class of a particular
object at compile time, but could just send the `Print:`
message to the object and have normal method resolution occur at
runtime. This would allow you could store the addresses of the various
objects that need to be printed in an array or list without concern for
the class of each one.

The technique just described is known as **late binding**, and is used
by Smalltalk and some other object-oriented languages as the only style
of method resolution. While very powerful and elegant, late binding
traditionally has serious performance disadvantages that make most of
these languages poor candidates for production of commercial
applications. Because Mops provides **both** late and early binding, you
can tailor your application for speed or generality where needed. Even
late-bound Mops messages are quite fast, thanks to a highly optimized
search primitive. Late binding makes the various objects in your
application highly independent of each other, leading to much easier
program maintenance. And late binding can greatly simplify the control
structure of your code, because much conditional processing can be
handled via class differences.

### Late Binding and Toolbox Calls

Mops itself uses late binding within many of its Toolbox class methods.
For example, when the `fEvent` object (a default Event
object that is predefined in Mops) receives a MouseDown event from the
Toolbox, meaning that the user has clicked the mouse button,
`fEvent` hands the processing of the Click over to the
window (or menu bar) that was involved. If the Toolbox tells fEvent that
a click was received in the Content region of a window,
`fEvent` sends a `<Content:</code>>;` message
to the window involved. This event must be processed differently
according to whether the window has controls, editable text, graphics,
and so on. In a conventional C or Pascal program, a large switch/case
statement would be required that would handle clicks for different types
of windows. In Mops, the differential processing is handled
automatically by late binding of the `<Content:</code>>;`
method, because the correct processing will occur for the class of the
actual window involved. The programmer is then free to define new
subclasses of Window with their own `<Content:</code>>;`
methods, and `fEvent` can still do exactly the same
thing.

> Carbon Note: Toolbox events in Carbon (called Carbon
> Events) should be handled by event handler callbacks. So carbon events
> are processed by callback words installed for each toolbox object for
> each kind of events in Carbon PowerMops. As the result,
> `fEvent` object no longer performs substantial tasks in
> PowerMops. However, as for the use of late binding, there is essentially
> no change between 68k Mops and Carbon PowerMops.

### Early vs. Late Binding

You can cause late binding to occur in a particular message with a very
simple modification of your source:

```bash
get: myint         \\ early binding
get: [ myint ]     \\ late binding
```

In the first example, Mops would determine at compile time the class of
the object `myInt`, and in the second example this
resolution would happen at run time. If myInt is truly an object, using
late binding would be a useless waste of time, because the class of
myInt could not possibly change. However, the brackets can enclose any
code sequence that generates an address of a valid object at runtime.
This can be a single Mops word, a sequence of words, messages to other
objects, or anything else. Some examples:

```bash
get: [ dup ]    \\ message receiver is the object whose address
                \\ was duplicated on the data stack
```
```bash
get: [ i at: myArray ]     \\ receiver is the object whose address is
                           \\ at element i in myArray
```
```bash
0 value theObject          \\ create a Value to hold an object address
myInt -> theObject         \\ place the address of myInt in theObject
get: [ theObject ]         \\ receiver is myInt via theObject
```
```bash
get: [ ]                   \\ receiver is object whose addr is top
                           \\ of stack
```

Since the normal use of brackets in Forth is to turn compilation off and
on, this particular interpretation of brackets only applies immediately
after a selector, and the regular Forth interpretation applies
otherwise.

To help avoid (or maybe to add to) confusion, we have
added two more ways to specify a late bind

```bash
method: **
method: []
```

to bind to whatever is on the top of the stack at run time.
`method: []` is really the same as `method: []` with a space
between the brackets.

You will frequently find that it is useful to late bind to `Self`.
This is particularly so with multiple inheritance. For an example, see
the `(Col)` class in the file 'Struct' or 'pStruct'.
`(Col)` knows it will be implementing subclasses multiply
inherited with some kind of array, but it doesn't need to worry about
what kind of array. It can simply send messages such as
`AT:` to `Self`, late-bound, and the right
kind of array access will be done. We have even provided an extra syntax
to make this operation look neater, e.g

`at: [self]`

Thus the following are all equivalent:

```bash
aMethod: [self]
aMethod: [ self ]
self aMethod: **
^base aMethod: **
```

You can take your pick. But in the case of late binding to
`Self`, I think the first one looks the best. Note that,
if you are defining a new class and overriding (replacing) a method
(e.g. `PRINT:`) from a superclass, other methods in the
superclass will continue to use the first definition of
`PRINT:` unless all calls to it are late bound.

### When to Use Late Binding

You should be able to see that this is a very general and powerful
technique. As you become more skilled in building object-based
applications, you will find yourself using the power of late binding
more and more. The following are some situations in which late binding
is particularly useful:

1. **Forward referencing**  
    You may find it convenient to create
    code that sends messages to an object that won't be defined until
    later in the source code. For instance, two classes may need to send
    messages to each other, meaning that one of them will have to be
    referenced before it is defined. Cases like this can be easily
    solved by defining a `Value` that will hold the
    actual address of an object at runtime, and compiling late-bound
    messages using the `Value` rather than an object, as
    in example C above.
2. **Passing objects as arguments**  
    Frequently, you will find
    it useful to pass an object as an argument to a Mops word or method.
    For instance, the following word computes the difference in the
    areas enclosed by two rectangles:  
    `: ?netArea { rect1 rect2 -- netArea } size: [ rect1 ] * size: [ rect2 ] * - ; `  
    In this example, two named input parameters,
    `rect1` and `rect2` are the addresses
    of objects `rect1` and `rect2`, and
    are used as receivers of `size:` messages. This
    definition compiles exactly the same kind of late-bound reference as
    if a Value were used. The `size:` method is looked up
    and executed at runtime, yielding the dimensions of the rectangle.
    The area calculation proceeds easily with that information.
3. **Algorithmic determination of message receivers**  
    Because you can use any code sequence that results in an object address
    between the brackets of a late-bound method call, you can
    algorithmically determine which object will be the receiver of a
    given message. This allows you to traverse a list of objects,
    sending the same message to each one; it also permits sending a
    message to an object whose address came from another source, such as
    a Toolbox call. It might be that the routine itself that generates
    the object address must be dynamically changed at runtime, in which
    case you could use a **vector** as message receiver. A vector is a
    special kind of `Value` that holds the execution
    token (xt, see [Lesson 20](Lesson_20#Scroll_Bar_Actions)
    of the tutorial) of an executable Mops word (not an object); for
    brevity they are known as `Vect`s, and have to be
    initiated with the xt of a Mops word:`' null vect
    myvector`Just as giving the name of a `Value`
    puts its contents on the stack, giving the name of a vector causes
    the word it holds to be executed. A late-bound message to a vector
    in your code will compile a late-bound reference in which the vector
    is executed first, which in turn executes the Mops word whose xt it
    holds; this places an object address on the stack that will be the
    actual receiver of the late-bound message. By changing the contents
    of the `Vect`, you can substitute a new algorithm to
    generate the object address.
4. **Dynamic (heap-based) Objects**  
    A very important use of
    late binding is for communicating with dynamic objects, but they are
    a subject that needs a section all of their own.

## References

References are a new feature in PowerMops 4.0. A reference may be
thought of as a pointer to an object, but references have many other
capabilities as well, since with PowerMops 4.0 they provide the primary
means of implementing dynamic objects.

Because references represent a fundamental new Mops feature, there are
many places in the manual which will eventually need to mention them.
This however has not happened yet, so most of the information you will
need to use references effectively is here in this section.

Anyplace you declare an object, you can now put the word **ref** in
front. So, for example, let's say you have a `View` object

`view myView`

you can instead make it a reference:

`ref view myView`

Before you can send messages to it, you need to set it to point to an
actual view object. You can do this in two different ways, using one of
two prefix operators, `->` and `new>`

### Prefix Operator ->

If you want to set a reference to point to an existing object, just get
the object's address, and use the -> prefix. The object can be
anywhere. So for example if you already have a view someView, you can
set the reference myView to point to it thus:

`someView -> myView`

or, equivalently

`addr: someView -> myView`

of course you can determine the source object's address in any way you
like. Any arbitrary computation can precede the `->`. The actual
assignment is done by an internal Mops word which does a check that the
address you use is the address of an object of the appropriate class,
and will give you an error if it's not.

There is only one restriction on using `->`. The object must not be an
ivar within a `record{...}`. This is because such
objects don't have a header, which prevents Mops performing the above
class determination, along with other housekeeping operations associated
with references. If you attempt to assign the address of such an object
to a reference, you will get the "not an object" error at
run time. (Although it might be an object, Mops can't verify that it
is.)

### Prefix Operator new>

If you want to create a new view object in the heap and set myView to
point to it, use the `new>` prefix:

`new> myView`

That does the whole job. The heap block can't move (for the technical,
it's a pointer-based block), so you don't have to worry about locking
or unlocking handles.

Either way you set the `myView` reference, you can now
send messages to it exactly as if it were a normal view.

Note carefully that we clearly distinguish in the syntax if we are
sending a message to the object, or performing some operation on the
reference itself (as opposed to the referenced object). Any **message**
goes to the **object**, while the **prefix** operators `->` and `new>`
are operations on the **reference**, and don't affect the object in any
way.

### Prefix Operator release>

This is the prefix operator that you use when you are finished with a
reference. Now it is important to realize that `release>` does **not**
cause a heap object to be deleted. What it does is simply reset a
reference to point nowhere (by setting it to the nil pointer value
`nilP`). Think of `release>` as releasing the link
between a reference and an object.

So when does a heap object get deleted? Simply when it doesn't have any
more references to it. Mops now incorporates a "garbage
collection" routine to find these objects and delete them. This
should make the programming of complex data structures much simpler than
before. Any class can have any number of references in its ivars, and
objects of that class can themselves be pointed to by any number of
other references, and can be in the dictionary or the heap.

All you have to take care of is doing release> on a reference when
you're finished with it. If you accidentally try to send a message
through a reference that has had a release>, you'll get an error,
not an access to some strange place in memory. But note that multiple
release> operations on a reference are harmless. Only the first one
will do anything; the following ones will be ignored. This scheme also
explains why you can merrily do -> operations on references without
having to worry about where they might have been pointing before. Mops
simply does an internal release> before assigning the new address to
the reference. If the reference was already nil, the internal
release> is ignored.

When Mops detects that a heap object has no more references pointing to
it, it first sends a release: message to the object (so that the object
gets a chance to free any heap blocks that it might have allocated for
itself), then it performs a `release>` on any references in the object,
then finally the heap block is deleted

If you are already a Mops user, you'll be able to see that using
references should make certain classes of application --- those that
involve complex dynamic data structures --- much simpler to handle
than they were before. But we're not finished with references yet.
Lurking beneath that simple interface is another binding method. This
allows you to set a reference to point to an object of any subclass of
the class of the reference, and when you send a message, you will invoke
the method of the subclass rather than the original class.

This mechanism uses a table of addresses associated with each class,
which points to the methods of that class in an order which doesn't
change when you go to a subclass. This sort of table is used by C++ and
called a vtable (for virtual table). It does take a small amount of
extra space, but only 4 bytes per public method, which isn't a lot.

For a speed comparison, an early bind only takes a couple of machine
instructions, while a vtable bind through a reference takes about 30. A
late bind can take as many as 500, but we use a cache which is very
effective and reduces the overhead to about 100 instructions most of the
time.

You are not forced to use a vtable bind through a reference, however
-- this is just the default. If you want to have a reference which
can point to an object of any class whatsoever, and invoke late binding,
declare

`ref any <name>`

Naturally enough you can't use the **new>** prefix on a ref any,
since there's no class we can use to create the object!

You can also specify early binding through a reference, if you declare

`ref <class> <name> no_subclasses`

For this kind of reference, you will get an error if you try to assign
an object whose class doesn't match exactly. You can't have an
object whose class is a subclass of the reference's class. But the
advantage is that since Mops knows the class at compile time, it can
compile early binding code for messages. This can give you some extra
speed if you know that the reference will always point to an object of
exactly a specific class.

So far references are only implemented for PowerMops. For 68k Mops, you
can continue to use object pointers (see below), although they lack a
lot of the functionality of references.

But for PowerMops, we now recommend you now use references instead of
object pointers, since they can do everything object pointers can do and
a whole lot more. (We will however retain object pointers so as not to
break old code.)

## Dynamic (heap-based) Objects

A very important use of references and late binding is for communicating
with dynamic objects. Many applications need to create objects
dynamically rather than build them into the dictionary at compile time.
For instance, an application that handles multiple windows cannot know
in advance how many windows will be open at any one time. It would be
clumsy to have to predefine a number of windows in the dictionary called
Window1, Window2, and so on. The best approach in this situation is to
create a list of window objects that can expand and contract
dynamically. To avoid wasting storage, it is most appropriate to create
the window objects on the heap when they are needed, and return the heap
to the system when a window is closed.

In PowerMops, as we saw in the last section, this is best done with
references. In 68k Mops, you will have to use the older method involving
ObjHandles, which we describe here.

`ObjHandle` is a subclass of `Handle`. In
this class we provide methods for creating and accessing heap objects. A
heap object can be created thus:

`ObjHandle anObjHdl<br /> ' someClass newObj: anObjHdl`

Then, to access the object, the method `obj: anObjHdl`
returns a pointer to the object, and also locks the handle so that the
object won't be unceremoniously moved while we are doing things with
it. Remember to `unlock: anObjHdl` when finished. So,
using the above example, you can access the object thus:

```bash
mssg1: [ get: anObjHdl ]
       ...
       unlock: anObjHdl
```

When you are completely finished with the object, send
`release: anObjHdl`. This will automatically cause a late-bound
`Release:` to be sent to the object itself, before its
storage is released, in case it has some heap storage of its own. Be
careful not to send `release: anObjHdl` if the heap
object has already been disposed of, as will happen with a dynamically
created Window that has been closed by a click on the close box. The
**object** no longer exists, although the space it occupied is still
allocated. You dispose of that with
`anObjHdl release: class_as> handle` (see below) which uses the
release method of the superclass Handle.

If you know that a dynamic object has one particular class, you can
avoid the time penalty of late binding to it, as we'll now see.

## More Ways of Early Binding

### Declared References

As we saw above, in PowerMops you may declare a reference to an object
in which you specify that messages to the object will use early binding,
by using the word **no_subclasses**.

`ref <class> <name> no_subclasses`

In 68k Mops, to do the same kind of thing, you will need to use the
older feature, Object pointers.

### Object Pointers

The idea of an object pointer is to provide a convenient way of early
binding to an object whose identity is determined at run time (for
example, a heap-based object), but whose class we know at compile time.
In cases like this we would like the efficiency of early binding to the
object.

With an `objPtr`, the class is associated with the
pointer at compile time, then whenever an object address is stored in
the pointer there is a check that the class of the object matches. After
that, sending a method to the pointer actually sends it to the object
the pointer points to, with early binding (since we know the class at
compile time). An object pointer is a 'low-level' entity, rather like
a `Value`. The syntax for object pointers is:

```bash
objPtr anObjPtr  class_is theClass
`               ...

( get obj addr to the stack ) -> anObjPtr
               ...

aMethod: anObjPtr
```

Occasionally, the desired class for an object pointer may not be defined
at the time the object pointer needs to be defined. In this case, use
the syntax

`objPtr anObjPtr`

then after the class is defined:

`' anObjPtr set_to_class theClass`

This, of course, must precede any code which sends a message to
`anObjPtr`. See the file Dialog+ for some examples
--- there I had to implement methods manipulating a chain of
pointers to objects of the same class as was being defined. For this
purpose I put the `set_to_class` line straight after
the `:class` line, but before the ivars and methods. This
is quite allowable.

Note that the address you store in an `objPtr` must be an
**object** address. If you use ' (tick) or ['] on an object in the
dictionary, you will get the cfa of the object, which isn't the same.
As we saw earlier, an object has a pointer to its class at the start (it
has some other information there as well). To get the object address,
which is the address of its first ivar, you just use the name of the
object without any selector. Alternatively, if you already have the cfa
of the object, use the word `>OBJ` to convert it to
the object address. So, either of the following will work:

```bash
anObj -> anObjPtr

' anObj >obj -> anObjPtr
```

### class_as>

There's a way to force an early bind to an object, without having to
set up a reference or an `objPtr`. The disadvantage is
that it's less secure. With earlier versions of Mops you could say

`( obj addr on stack ) aMethod: theClass`

with the object's class being used as the 'object' to which the
method is sent. This syntax was available in Neon, but was undocumented
(!). It was, and still is, available in Mops. It can be dangerous if you
don't know what you're doing, since there can't be any check on the
real class of the object whose address is on the stack (since it's not
known at compile time), and there isn't even a check that what's on
the stack is a legal address. If it isn't the address of an object of
that particular class, an immediate crash is probably the best you can
hope for. But if you know what you're doing this syntax can be very
handy.

The only difficulty I have had with it is that in reading code it isn't
glaringly obvious that you're not sending a normal message to an
object. If your class names aren't well chosen, it might appear that
the thing following the selector is an object name, not a class name,
which would give that code quite a different meaning. (Of course I'm
not talking to you, since you always name your classes in such an
unambiguous manner that they just couldn't be anything but classes.)

Anyway for those who do sometimes give their classes less than ideal
names, with version 2.6 we have a new syntax for the above operation:

`<obj addr on stack> msg: class_as> someClass`

The old way will still work --- I don't plan to delete it and maybe
break existing code --- but the new way reads less ambiguously (and
compiles exactly the same code). As mentioned above (in the section on
heap-based objects) this can be a useful way of accessing a method of an
objects superclass, if that is more appropriate.

## Public and Static ivars

From version 2.5.1, we have provided some extra features relating to
ivars. Most simple programs won't need these features, but more
experienced Mops users may well find them very useful. Although you may
not use these features youself at first, you will find them in use in a
number of the fundamental predefined classes, e.g. class Window, so it
is as well to be aware of them.

Static (or class) ivars belong to the class rather than to an object.
They're rather like globals except that they don't clutter the global
namespace. The syntax for accessing them is just the same as for normal
ivars.

They're declared like this:

```bash
class myClass super{ mySuper }
       var     oneVar
static
{      var     someVar
       int     someInt
}
       var anotherVar
```

In this example, `someVar` and `someInt`
are static, `oneVar` and `anotherVar` are
normal ivars. In the methods of `myClass`, whenever you
access `someVar`, you are accessing the **SAME** ivar, no
matter what object you are in, and similarly for
`someInt`.

Public ivars can be accessed from outside the class. They're declared
this way:

```bash
class myClass super{ mySuper }
public
       var     aVar
       int     anInt
end_public
       var anotherVar
       int anotherInt
```

They're accessed from outside the class via this syntax:

`msg: ivar> anIvar IN someObject`

(where `someObject` is an object of
`myClass`, of course.)

I've considered adding this feature to Mops for some time, doing this
for some time, with mixed feelings, but eventually decided it was worth
it in some situations where otherwise I'd need to define dozens of
pass-through methods. It may not be brilliantly elegant, but it's very
practical.

This is really an extension of the public/private distinction which we
already have for methods. The default is for ivars to be private, and
methods to be public. You can now use `PUBLIC` or
`PRIVATE` anywhere in the ivar list or method
declarations of a class to change this default. You can use
`END_PUBLIC` or `END_PRIVATE` to restore
the default.

If you combine these two new features, you can get a 'public static'
ivar. To access this from outside the class, you can't use the above
syntax since there's no object to refer to. So the syntax is:

`msg: ivar> aStaticIvar IN_CLASS myClass`
