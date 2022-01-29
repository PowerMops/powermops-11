---
title: The Mops Manual
layout: default
---

Before you dive into Mops, it will be most helpful if you have an
overview of the organization of this rather lengthy manual.

The Mops documentation is divided into three sections.

Mops was designed as both a serious Macintosh development language and a
language that beginning and casual programmers can learn to access the
powers of the Mac. This manual addresses both audiences, and some in
between.

The manual is divided into these major parts:

| | | |
|:---      | :--------------------- | ----------: |
| PART I   | **Overview** (this document)   |  1 Chapter  |
| PART II  | [Tutorial](/pmops/tutorial)   | 21 Lessons  |
| PART III | [Reference](/pmops/reference) | 14 Chapters |
| PART IV  | [Classes](/pmops/classes)     | 12 Chapters |

## Tutorial

The Introduction is a section is for
everyone, regardless of expertise. It should be the first section of the
manual you study.

We have devoted a large section of the Mops Manual to a 21 lesson
tutorial, which will lead both the beginner, even someone who has never
programmed a computer before, and the more experienced programmer
through the essential elements of Mops. We recommend that every Mops
user, regardless of expertise, work through the Tutorial. Even if you
think parts of Mops resemble a language you already know, there will be
significant differences that will be reinforced in the Tutorial. Plan to
spend ten to twelve separate sessions over several days with the lessons
in the tutorial. Mops is based on Forth, and if you have some
familiarity with that language, it will certainly help. Mops adds the
power of the Object Oriented paradigm to traditional Forth, as well as
other very useful tools.

## Reference

Six chapters in this Part provide
numerous details about Mops, including considerable expansion on topics
touched on in the Tutorial. Read this part only after going through the
Tutorial.

## Classes

This part of the manual will become one of
the most used reference sections once you begin writing Mops programs.
It contains details about the parts of the Mops language that have
already been written for you to help you communicate your program ideas
to the Macintosh's unique way of doing things. Each chapter is devoted
to a category of predefined classes, and begins with a general
discussion about the class. You should be familiar with the content of
Part III before writing programs.

Additionally, the Mops package contains many files with the source code
listings for many parts of Mops. These files are actually further
documentation for you. You will get instructions in the Tutorial about
how to organize them for ready reference.

## Developing standalone applications

Mops can be used to produce stand-alone doubleclickable applications,
whose users won't need to concern themselves with what language the
application was written in. These users won't have or need access to
the Mops dictionary and interpreter. Instructions for this procedure are
given in the Tutorial.

## What your Mops system contains

Once you have installed the Mops system as described above, you will
find several folders containing Mops files. They are:

- **Mops 𝑓** &nbsp;&nbsp;  Essential files including:
  - The Mops kernel (Mops).
  - An image of a Mops dictionary with many of the predefined
    classes already loaded (Mops.dic).
- **QuickEdit 𝑓**&nbsp;&nbsp; Files in this folder are for Doug Hoffman's QuickEdit programming editor.
- **Mops source** &nbsp;&nbsp; All the Mops source code. There are various
  other folders inside here, as follows:
  - More classes  
    Source files for a number of other (possibly) useful classes.
    - System source  
      Source code for the basic Mops classes and other support code.
    - Toolbox classes  
      Source code for Mops classes that interact with the Mac Toolbox.
    - Module source  
      Source code for the Mops modules.
    - Asm source  
      Source code for the Mops 68k assembler.
    - Demo folder  
      Source files for demonstration programs used in the tutorial.
-   **Mops manual** &nbsp;&nbsp; Uhm. That's where the documentation you are
    reading is stored.

Most of the source code files in System, Toolbox, and Demo folders are
provided not only for added documentation, but also if you want to
recompile a modified version of Mops. A study of that code, along with
the tutorial, will help you master the powers of Mops.

The predominant file you will be opening will normally be one of
Mops.dic, MopsFP.dic or PowerMops. They contain the majority of the Mops
words and predefined classes on which you will build programs.

## Conventions used in this manual

We use a couple of conventions throughout this manual that you should be
aware of.

In the Tutorial, we present many examples of things you should type into
the computer. To differentiate the characters you type from the
characters that the computer generates on the screen, we 
`stylize` those characters you type. The
computer's prompt and other responses are printed in regular monospace
type.

In both the Tutorial and the chapters in Part II, whenever we introduce
a new Mops term, or intend for you to pay special attention to the
terminology, we underline the key words. When you see underlined words
and phrases, it means that we are trying to acquaint you with a new term
or re-emphasize a term or concept already mentioned.

You will also find many cases in the manual and in the Mops source code
of Mops words being capitalized in what may seem odd places, such as in
the middle of a word like bArray. While this style of capitalization is
common among experienced programmers for the sake of ease of reading,
rest assured that you won't have to master any scheme of capitalization
in learning Mops. Mops itself is **case insensitive**, which means that
you can type a word in all lower case, all upper case, or any
combination thereof, and Mops will recognize it as the same word. As you
become more experienced in Mops, the capitalization standards we have
set will make more sense to you.

> **Special note to experienced Forth and Smalltalk programmers:**
> Mops is based on Forth, and its object-oriented features owe a lot to
> Smalltalk. Experienced programmers in either Smalltalk or Forth should
> take care not to jump to any conclusions regarding Mops' behavior on
> the basis of previous experience, and to read carefully through the
> tutorial.

## History

Mops is an object oriented programming system, derived from the Neon
language developed by Charles Duff and sold by Kriya, Inc. Kriya
discontinued support for Neon, and released the source code into the
public domain, retaining only the ownership of the name Neon.

Mops is a complete reimplementation of Neon, with many additional
enhancements. It is also in the public domain.

Many portions of this manual were pulled directly from the Mops 4
manual, released in September 2000 in MS Word format. The original HTML
release was completed in 2003 by Gnarlodious.

At that time some parts
of the material were updated to reflect the advent of OS X, and this
will be ongoing, however as a web site the versioning seems irrelevant
and so this manual has no version numbers but rather an *Updated on*
entry in this page's title bar.

## Mops

The name Mops could well be an acronym for *Mike's Object oriented
Programming System* but since Mike feels the computing world has enough
acronyms already, he has taken pity on us. Hence we spell Mops as Mops,
not MOPS.

Mike's hope is that over a period of time Mops users will, by sharing
their developments, contribute to the ongoing Mops effort. As a one-man,
very part time operation, Mike can't hope to singlehandedly compete
with all the commercial outfits producing gargantuan bells and whistles
encumbered development systems for the Mac, and would be happy to
concentrate on the low-level implementation of the Mops nucleus and
basic system code.

  Mops implemented by:    Michael Hore
  
  Able assistance from:   Doug Hoffman, Nao Sacrada, Greg Haverkamp, Xan Gregg
                          
  Documentation:          Mike Hore, Ed Williams, Nao Sacrada, Arthur W. Green

  HTML:                   Gnarlodious, Arthur W. Green, Jim Tittsler

Please direct corrections, suggestions and criticism regarding this
documentation to the [PowerMops
Users](http://lists.sourceforge.net/lists/listinfo/powermops-users)
mailing list.

