---
title: Mapping Class-Object Relationships
layout: default
---

An object-oriented language like Mops builds programs around the same
kinds of relationships as portrayed in the accountant analogy from the
preceding lesson. Class definitions play a central role in the structure
of a program. As such, the most important early step in planning a Mops
program is to visualize what the main objects (the Actors) in your
program will be doing. Because Mac OS is capable of recreating on-screen
metaphors for so many different real-world objects; a bank book, an
artist's canvas, a calendar, it is best to devise classes of Mops
objects that bear a behavioral resemblance to the real-world items. Once
you've determined what the program's classes will be, it's time to
start writing the program by defining those classes with methods. Then
create objects of those classes. Finally, write the messages to those
objects that set the program in motion. Let's take the first steps in
applying class-object relationships to a Mops program by defining a
class that is capable of drawing rectangle objects on the screen. At the
same time, you'll also be introduced to the way Mops programs really
look. Pay particular attention to the physical structure of program
listings, indentions, spacings, capitalizations, and the like. While
Mops is pretty loose about how you can make your programs look, the ways
prescribed hereafter will help you read printouts of your code for
debugging and enhancement. Also consult Chapters 3, 5, and 6 of the
\[../Reference/index.html Reference\] for in-depth discussions of this
and related topics.

Defining a Class
----------------

As you may have noticed in the accountant class metaphor, each class was
defined by what amounts to a series of behavioral rules or procedures
that are to be followed whenever an object of that class is called into
action. Defining a class then, entails establishing those rules and
procedures: the methods.

Most classes also have information (data) associated with an object of
the class. For example, the class of Family Accountants can dictate that
every accountant of its class should be paid for his work. Every family
accountant (John and Percival, for instance) carries with him a figure
for his hourly rate. The class definition merely states Thou shalt have
an hourly rate. When the objects are created, the rate is plugged into
that variable. Importantly, John and Percival can have entirely
different hourly rates, because they hoard their own data to the
exclusion of other objects in the same class. One of their methods would
retrieve the rate, multiply it by the number of hours spent on your
taxes, and send you the bill.

Let's see what it's like to build a Mops class called
`Rect`, which will define all the procedures for creating
rectangle objects.

In the Carbon environment, a rectangle is defined by two points on the
screen: the locations of the top left and bottom right corners of the
rectangle. In other words, for every instance of a rectangle on the
screen, an object of class `Rect` will need numbers to
fill in these two variables. These variables, then, are called instance
variables (ivars for short). They are the holding places in an object's
definition for the requisite data (the two points) required before a
rectangle can be drawn.

The class definition up to this point looks like this:

```bash
`:class  RECT  super{ object }`\
`       point     TopLeft`\
`       point     BotRight`\
```

Notice several things. First of all, the beginning of a class definition
is `\<nowiki\>:class\</nowiki\>` (pronounced "colon
class") with no space between the colon and the word "class". There
is at least one space or a tab between
`\<nowiki\>:class\</nowiki\>` and the name of the class.
We have put `RECT` in capitals to make it stand out,
since this is where it is defined. However, this is not necessary, since
upper- and lower-case are treated the same by Mops. You can use whatever
style of formatting you prefer.

On the same line as the name of the class is a reference to the
superclass from which our rectangle class is derived. This reference
takes the form of the word `super{` (no space between
"super" and the left brace), then the name of the superclass, then a
`}`. These three items are separated by spaces or tabs,
as for all Mops words. We will see later that it is possible for a class
to have more than one superclass, known as multiple inheritance. We
won't go into the details of this now, except to say that if there is
more than one superclass, these are put one after the other before the
`}`, again separated by spaces or tabs.

Although in this example the superclass name is `Object`,
this should not be confused with the general use of the word object in
the Mops system, where it refers to all objects generally. In this one
special case `Object` is a class. This may seem a little
confusing, but it is actually because we do use the word "object" in a
general way, that we have named this special class
`Object`. This is because all classes in Mops can trace
their inheritance to class `Object`. Thus, class
`Object` defines the behavior appropriate to *all* Mops
objects. This is why the name "`Object`" is appropriate
for this class.

So by its inheritance, class `Rect` has at its disposal
all the methods defined in class `Object`. If you are
interested in what methods are defined for class
`Object`, you could check the source code listing
(located in 'PPC source' folder as the source file
"`qpClass`").

The instance variables tell Mops to reserve memory space in the data
area of any object created from this class. The amount of space to be
reserved is determined by the characteristics of the instance variables,
which are themselves defined by other classes. Here, the instance
variables (ivars) are named `TopLeft` and
`BotRight`, both belonging to the class
`Point`. It would not be possible to create ivars
`TopLeft` and `BotRight` in class
`Rect` if class `Point` had not been
previously defined. Fortunately, class `Point` is one of
[ Mops' many predefined classes](Classes).

> Note: For procedural language buffs, a key to understanding the object
> orientation of Mops is that as you follow the threads through the
> dictionary in the next few steps, you are not watching straight
> execution steps. Rather, you are building a framework that will reside
> in memory as a kind of potential energy that is released only when a
> message is sent sometime later in the program.

To understand what the rules and procedures are for the
`Point` objects (`TopLeft` and
`BotRight`) created inside class `Rect`,
you can look up the Mops source code for the `Point`
class (located in the "`zQD`" source file in the
'Toolbox classes' folder). The class definition should look something
like this:

```bash
`:class  POINT  super{ object }`\
`record`\
`{      int     Y       \ Vertical coordinate`\
`       int     X       \ Horizontal  coordinate`\
`}`

`...`

`;class`\
```

We'll explain all of this shortly, but the main thing to notice first
of all is that this class, itself, uses two more ivars,
`X` and `Y`, of class `Int`
(integer). They specify the data area inside any object of class
`Point`. In other words, any object created from class
`Point` will need two integers to fill the cells reserved
for data. The `Point` class was designed in this way so
that two values, representing a coordinate point, would be conveniently
coupled together whenever a `Point` object (an instance)
was created.

Notice too, that we've started adding plain English remarks about the
code as a way of *documenting* the program. There are three ways of
specifying comments in Mops:

```bash
`( this kind of comment continues to a )`

`\ This is another comment, which extends to the end of the line`

`(* This kind of comment`\
`can go over several lines,`\
`    (* and can be nested *)`\
`*)`\
```

Note that `(`, `\\`, `(*`
and `\<nowiki\>*)\</nowiki\>` are Mops words, and so
must be followed by a white space character. Thus if you had

`(this isn't a comment)`

Mops would try to recognize the word `(this`, and
wouldn't treat the rest of the line as a comment. You'd probably get
an undefined word error message.

We'll come back to the rest of the statements in the
`Point` class in a moment. First, we must search once
more, but this time for the class definition of class
`Int`, because the data of class `Point`
consists of ivars `Y` and `X` that have
the characteristics of class `Int`. Class
`Int` is defined in the file "`pStruct`"
in 'PPC source' folder. The search reveals:

```bash
`:class INT     super{ object }`

`       2 bytes data`

`:m PUT:                inline{ ^base w!}    ;m`\
`...`

`;class`\
```

Class `Int` is another one of [ Mops' predefined
classes](Classes). It states, first of all, that its
superclass, like many in Mops, is class `Object`. Next,
it states that two bytes (16 bits) of data are set aside for each value
whenever an integer object is created. The third line is a method of
this class (preceded by `\<nowiki\>:m\</nowiki\>` and
ended by `\<nowiki\>;m\</nowiki\>`). These message inside
this method definition stores an integer in a special area of memory.
(Don't worry about details of this method definition for now.)

Going back to the definition of class `Point`, the ninth
method:

```bash
`:m PUT:                put: Y  put: X   ;m`\
```

is a single instruction for Mops to store *both* the `X`
and `Y` coordinates in memory. Therefore, every time one
of the ivars (`TopLeft` or `BotRight` of
our rectangle class) is given two numbers for an
`X`,`Y` coordinate, the entire coordinate
is stored by one `PUT:` message. In other words, a
`PUT:` message to a `Point` object
requires two numbers (`X` and `Y`) on the
stack.

Next in the class `Rect` definition come two methods:

```bash
`:class  RECT  super{ object }`\
`       point     TopLeft`\
`       point     BotRight`

`:m PUT:                put: BotRight   put: TopLeft  ;m  ( l t r b -- )`

`:m DRAW:       ^base  FrameRect  ;m`

`;class`\
```

As detailed in the stack notation, the first method,
`PUT:`, requires four integers on the stack (here
signified by the letters '`l`',
'`t`', '`r`', and
'`b`') before an object executes it. The
first two integers (the ones on the top of the stack) are put into the
object's `BotRight` reserved cells as soon as the
'`put: BotRight`' message finds the definition of the
`PUT:` method in `BotRight`'s class,
which is class `Point`.

The second two integers are placed in the object's
`TopLeft` cells as the result of the '`put:
TopLeft`' message in *this* `PUT:` method. In
other words, when an object of class `Rect` receives a
message consisting of the `PUT:` selector, the object
searches its own class for the corresponding methods definition. The
method sends messages of its own to objects of other classes, and so on
back through a chain of classes and objects until a method is reached
that is defined purely in Mops words (as in the `PUT:`
method in class `Int`). All the actions taken by this
series of messages affect only the private data of the
`Rect` object that received the message.

The second method in our rectangle class, `DRAW:`, calls
a Carbon framework routine named `FrameRect` (part of the
QuickDraw graphics library), to draw the rectangle according to
coordinates currently in the data cells of the object being drawn. The
data, of course, must be in the proper order that
`FrameRect` expects. `FrameRect` and most
other Carbon framework calls seek the address of an object's data. This
is obtained by the word `\^BASE` in the
`DRAW:` method. This address is then passed to the Carbon
framework call.

What we have so far, however, won't work properly when we call the
`DRAW:` method. This is because by declaring
`TopLeft` and `BotRight` as we did, we
have made them proper Mops objects. The problem with this is that Mops
objects have some extra information at the start of the object's
location in memory, which Mops uses to keep track of certain things
including the class of the object. However, the Carbon framework
doesn't know anything about Mops objects, and just expects 2 bytes each
for `TopLeft` and `BotRight`, with no
extra bytes present. Accordingly we have to have a way of omitting this
extra information, and we do this with the '`record{ ...
}`' syntax, as follows:

```bash
`:class  RECT  super{ object }`\
`record`\
`{      point     TopLeft`\
`       point     BotRight`\
`}`

`:m PUT:                put: BotRight   put: TopLeft  ;m  ( l t r b -- )`

`:m DRAW:       ^base  FrameRect  ;m`

`;class`\
```

> Note: You can either use either '`record{ ... }`'
> or '`record <var><optional name></var> { ... }`'.

Any ivars declared as part of a record won't carry any extra
information. This will limit some of the things you can do with these
particular ivars (as you might expect), since Mops doesn't have the
extra information available. But as we'll see, this isn't a very
serious restriction.

Finally, be sure to end the class definition using
`;class` (pronounced "semicolon class").

One last thing: you can format your class definitions (and all of your
code for that matter) however you like, as long as at least one space or
tab separates Mops words. The formatting we use here in the Manual and
in the Mops source code is considered quite readable by most people, so
we recommend something like it. Plenty of white space and comments are
always a good idea as it will greatly help anybody else who has to read
your code to understand it (and you yourself for that matter, when in a
few weeks time when it's no longer fresh in your mind). But in the end,
the choice is up to you.

