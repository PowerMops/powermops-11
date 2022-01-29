---
title: Predefined Classes
layout: default
---

Mops comes with a large number of predefined classes that provide you
with a strong foundation upon which to build your programs. The more you
know about these classes, their methods, and the functionality of the
objects they create, the more comfortable you will be in designing your
programs. Mops in many ways is like an Erector Set, it provide many
pre-built pieces, but you provide the imagination to turn those pieces
into a usable program.

Predefined classes serve an important function in Mops. They insulate
you from the concerns of extensive coding required for all the commonly
used Mac functionality: windows, dialogs, menus, graphics, disk file
manipulation, and dozens more. The nature of the methods in the
predefined classes will be largely understandable to you by the time
you're finished with this tutorial.

What this all means is that while you send comparatively simple messages
to objects created from those classes, you are automatically performing
very sophisticated operations not all that different from those that an
Assembly Language programmer would use. You are also left with fewer
concerns about making your program Mac-like, since the predefined
classes lead you in the right direction from the very start. To a large
extent, the predefined classes act as the Macintosh development
environment or framework that is provided with more traditional compiler
languages. They are also part and parcel of the object orientation of
Mops.

You will soon want to begin scanning through the source code of the
predefined classes. While much of the code is already compiled in the
"`PowerMops`" application file, all the Mops source
code is supplied in the folders 'Mops source' and 'Mops &fnof;'. You
can view and print the source code files using QuickEdit, or another
text editor of your choice. Eventually, you may find it helpful to print
out some of the source code in the 'PPC source', 'Toolbox source',
and 'Demo folder' folders within the 'Mops source' folder. (Some of
the 'PPC source' and 'Toolbox source' files refer to source code in
the 'Module source' folder.)

The Mops predefined classes can be divided into two general groups. One
group, called Mops System classes, consists of classes that are not
necessarily specific to the Carbon framework. The System classes control
things like file manipulation, basic data structures (integers,
variables, arrays), and other computer housekeeping tasks. These classes
of course have been designed to work specifically with the Mac, but they
work largely behind the scenes, since they don't directly affect the
way you and the computer communicate with each other.

The second group, called Toolbox classes, are those that make the
connection between the programmer/user and the graphic elements of the
Mac operating system. "Graphic elements" is a broad category that
includes such things as menus, windows, text input, mouse manipulation,
and program control via the mouse or keyboard. The Toolbox classes are
the highly visible, "show biz" classes of Mops.

Most of the predefined classes in both categories are subclasses of a
kind of master superclass, called class `Object` (which
you were introduced to in previous lessons). While class
`Object`, itself, is a subclass of yet another
superclass, class `Meta`, you won't have to concern
yourself with that particular relationship. Just think of class
`Object` as the ultimate superclass of all classes, and
you won't go wrong. Class `Object` is predefined in
Mops, in the Mops source file '`qpClass`'. It has very
primitive functionality, and no instance variables.

Data Structure Classes
----------------------

Among the most used predefined classes are several that are grouped into
a cluster called data structures. The diagram below shows the
organization of the Mops data structure classes, which are listed in the
files called '`pStruct`' (in 'PPC source'), its
companion source file '`zStruct`' (in 'Mops &fnof;'),
and '`Struct1`' (in 'Extras').

![](/pmops/DataStructure.png "DataStructure.png")

These classes form the basis of much number and string (text character)
storage and manipulation inside a Mops program. In the rectangle example
in [Lesson 6](Lesson_6), you already saw how instance
variables of one basic data structure class, `Int`, were
used as components of coordinate `Point` objects, which
were, in turn, used as components for a rectangle object.

The classes to the left of the vertical line in this digram are called
scalar classes because they reserve a fixed amount of memory space for
each instance of their class (just like a ruler marks a fixed area
according to its "scale"). An integer object (`Int`),
for example, always has two bytes reserved for data (whether or not the
bytes contain any meaningful data when an integer object is created).

To the right of the vertical line in this diagram are a group of indexed
classes. You can tell from the names of most of them that these classes
provide the rules for setting up arrays in Mops programs. An indexed
array is a convenience that helps your program reach into a list of data
in memory and pick out desired pieces. If you consider that an array
object might look something like this in memory:

![](/pmops/IndexedData.png "IndexedData.png")

you'll notice that some data cells have reference numbers attached to
them. Each number is an index&\#148;like an index tab in a three-ring
binder&\#148;to that data cell. It is much easier and more efficient to
reference an object's data by an index number than it is to provide the
address in memory for the datum your program needs at a given moment.

The differences between the various indexed classes include the number
of bytes each data cell is to contain (1, 2, or 4), as well as other
considerations that we will discuss later.

You'll also notice that the class `Ordered-col` has two
lines leading to it; this is because it has two superclasses, that is,
it uses multiple inheritance. The class `(col)` defines
some methods that all "collection" type classes need, regardless of
the size of their elements. Then the `Array` superclass
determines that the class Ordered-col has 4-byte elements.

The class `(col)` is an example of a class which doesn't
have any objects of its own. It is just a convenient way of defining a
group of classes where each class that inherits from
`(col)` will automatically have a number of methods in
common. Rather than repeat the definitions of these methods in each
class definition, we "split them off'" into a single superclass in
which they can be defined just once. We call this kind of superclass a
generic superclass The class `Longword` is another
example of a generic superclass. It is useful for defining methods
common to the classes `Var` and `Handle`,
but it doesn't have any objects of its own.

Other Predefined Classes
------------------------

Another group of classes that gets a workout is the one that links you
to QuickDraw, a powerful graphics library (included with the Carbon
framework). The following diagram shows the QuickDraw classes and the
superclasses from which they were derived:

![](/pmops/QuickDrawClasses.png "QuickDrawClasses.png")

Other graphics-oriented classes (not shown in this diagram) include
those that help you create windows, menu bars, and menus, plus a set of
classes called controls ("`zCtl`" in 'Toolbox
classes') that handle reactions to clicking the mouse on buttons and
scroll bars.

In addition, there are numerous predefined classes and objects that give
you shortcuts to opening and closing files, sending output to the
printer, producing sound, and other functions. The
[Classes](Classes) section of this manual contains in-depth
explanations of all frequently used Mops classes. You will look to these
reference sections very often once you have completed this tutorial.

------------------------------------------------------------------------

  ------------------------------------------- --------------------------------- -----------------------------------
  [Lesson 8](Lesson_8)             [Tutorial](Tutorial)   [Lesson 10](Lesson_10)
  [Documentation](Documentation)                                     
  ------------------------------------------- --------------------------------- -----------------------------------



