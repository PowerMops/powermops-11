---
title: FAQ
layout: default
---


### What is Mops?

Mops is a public-domain development system for the Mac. It's based on
Forth, with extensive OOP extensions, along the lines of Smalltalk. It
comes with a class library which gives support for all the normal Mac
interface functions. While not as full-featured as PowerPlant or MacApp,
say, it's very adequate for the kind of applications which might be
developed by a single programmer.

### Where did it come from?

Mops is derived from Neon, which was one of the first languages for the
Mac that allowed actual development on the Mac itself. It's a close
cousin to Yerk, which is a more "conservative" development of Neon,
basically aimed at keeping up with later Macs and systems while
remaining fully compatible with Neon. Mops is more "radical". It's a
complete reimplementation which compiles native (68k and PowerPC) code
instead of the usual Forth threaded variety. It's very fast --- about
as fast as anything on the Mac in fact. It has a few other improvements
over the original Neon, such as multiple inheritance, public ivars,
temporary (local) objects and object references.

### Where can I get it?

The most up-to-date copies of Mops can be downloaded from the
[website](http://www.powermops.org) and the SourceForge project page
[file download
area](https://sourceforge.net/projects/powermops/files/).

I highly encourage you to check the website every month or so for new
updates. Some other Mops code is available, and there various other
useful links there.

If you've obtained Mops from somewhere else, I recommend you check on
the web site to be sure you have the latest version. There are some
ancient versions around.

### Where can I find Mops discussion?

The
[Powermops-USERS](https://sourceforge.net/p/powermops/mailman/powermops-users/)
mailing list is an unmoderated discussion forum devoted to all issues
relevant to using and programming PowerMops. Everyone is welcome to
join, regardless of programming experience.

Another place to find discussion of Mops is the newsgroup
comp.lang.forth.mac. This is not exclusively Mops, but Mops is an
occasional topic of discussion.

There is a mailing list that for users interested in working with
up-and-coming Mops releases. If you enjoy working with the cutting edge,
or would just like to be kept apprised of new developments and bug
fixes, consider joining [Powermops-BETA](https://sourceforge.net/p/powermops/mailman/powermops-beta/).

There may be other places on the net with an active interest that we
haven't listed here. If you should know of one, please let this FAQ's
maintainer know about them!

### Do you have any other sample code available, apart from what's at those locations? 

Sorry, I can't help much. I've only written two "real" Mops
applications myself, and I'm not free to distribute the source. Most of
my Mops time has been spent on developing it rather than writing
applications in it. If the above ftp and web sites don't have what you
want, try posting on comp.lang.forth.mac or the MacForth Forum - maybe
somebody else there can help.

### Could I learn Mac programming with Mops? 

You could make a good start. Mops comes with an on-line manual, which is
derived from the original Neon manual. This assumes a very basic level
of knowledge about programming, and none about the Mac. However to move
on past the beginner stage with Mac programming, you'll really need to
read some of Inside Macintosh. You can certainly keep using Mops,
though!

### Could I learn OOP with Mops?

Definitely! - for the same reason as in the last question. OOP was still
very new when Neon came out, so the manual explains everything from a
very basic level.

### Can I write things like Extensions or Control Panels in Mops?

No, sorry, you can't do it. Mops only does applications, and shared
libraries on PowerMacs. In fact with OSX and shared libraries, the days
of Extensions etc. as such are pretty much over.

### What's the minimum system I need to run Mops?

If your Mac can run Carbon applications, then you should be able to run
Mops! So just about any machine running Mac OS X, Mac OS 9 (or a version
of Mac OS 8 with CarbonLib installed) should do nicely!

Please note that some newer features introduced in recent releases
(i.e., calling Cocoa frameworks) are specific to Mac OS X, and have no
equivalent functionality on older "Classic" versions of Mac OS.

### Is Mops Carbon-compliant?

It certainly is!

### Does Mops run "natively" under OS X?

Yes! The latest versions of Mops run natively on just about any version
of Mac OS X and Mac OS 9, as well as versions of OS8 with CarbonLib
installed. (The last of the "Classic" (non-Carbon) releases is also
still available for compatibility with older versions of Mac OS without
CarbonLib.)

### What about Cocoa?

With the release of Mops 5.6, it is now possible to call Cocoa
frameworks directly from within your Mops applications on Mac OS X!
(However, it is not possible to create Cocoa frameworks with Mops.)

### Does Mops support the AltiVec vector extensions found on Apple's G4-equipped computers?

Yes, it does! [AltiVec](https://en.wikipedia.org/wiki/AltiVec) was
developed by Apple, IBM, and Freescale Semiconductor (formerly Motorola).

### Can PowerMops do 64-bit arithmetic on 64-bit Macs?

With version 6.0, yes!

### What about the new Mach-O executable format?

With version 6.0, yes!

### Do the Carbon-compliant versions of Mops still support 68k machines?

Not anymore! With the release of Mops 5.6, 68k support has been largely
stripped from the distribution.

If you have a 68k Mac, we now recommend you download Mops 4.0.4, which
is a complete distribution for these machines. However, we're not
planning any further 68k development, so this is not officially
supported.

### Will Mops run natively on Intel Macs?

No. It will run under Rosetta (which allows PowerPC code to run on Intel
Macs), but to run natively the code generator would need to be rewritten
to target the Intel architecture. This could be done, since it's
written in Mops, but would take a lot of time. Adaptation to another
RISC-style architecture could be done in a fairly straightforward way.
The Intel architecture, however, is basically early-1980s vintage and is
CISC, not RISC. Adaptation would be, let's say, exciting and
challenging. And take even more time A LOT of time. It's not time that
I have any enthusiasm whatever for putting in, especially as I strongly
dislike the Intel architecture.

### Do you or could you have plans for some other platform, especially [insert favorite platform here]?

Similar answer to the preceding question. Also, Mops is very closely
tied to the Mac API for all its subsidiary services such as memory
allocation and all the GUI stuff.

### How about a version for [some embedded 68k or PPC machine]?

Same answer as the previous question.

### I tried to compile up the system, but then [whatever it was that went wrong].

The latest versions are fully built up, so unless you're involved in
implementing new features, you won't need to compile them up. You just
have to double-click Mops.dic (68k Mops) or PowerMops, and start using
it!

### I've just got the latest version, but when I double-click on Mops.dic on my 68k Mac, I get a crash.

The most usual cause of this is that you are upgrading from an earlier
version of Mops, and you still have a copy of the earlier Mops nucleus
around. From the Mac's point of view, "Mops.dic" is a document
belonging to the application "Mops". When you double-click on
"Mops.dic", the Mac system launches the application "Mops", but if
you have two versions of Mops around, you can't be sure that it will
fire up the latest. In fact, it probably won't. As the location of
words in the nucleus will be different between versions, you can't have
a new dictionary running on top of an old nucleus - you'll just get a
crash. So trash the old nucleus (if you're the cautious type, save it
offline first). That way, the Mac is forced to fire up the right version
of Mops.

### My code works fine in the Mops environment, but when I install it as an application [whatever went wrong].

There are a couple of things that could be wrong here. A common
situation is if you are using a module in an installed application, but
you've forgotten to put `true setInstall: myModule` somewhere in your code.

That sets the flag that makes Install include it. This will happen, for
example, if you're using dialogs and you've forgotten to put `true
setInstall: dialogMod` somewhere.

Another common source of problems with installed applications can happen
if at compile time you're ticking words, and comma-ing the resulting
execution tokens (xts) into a table, then at run time executing the
words via @ EXECUTE. This might happen, e.g. if you're porting your
application from another Forth. The Forth standard doesn't guarantee
that this sort of thing will work in a standard system, but it's fairly
commonly done anyway. In Mops there's no problem with storing an xt at
run time then using it later, but it's highly dangerous to store it at
compile time, save it with the dictionary, then later try to load the
dictionary and use the xt. This is because in Mops an xt is simply an
absolute address, and absolute addresses of locations in your code will
probably change between runs, depending on where Mops or your
application happens to load into the Mac's memory. The best way to
handle this kind of operation is with a DicAddr, X-Addr or X-Array
object. Please see the section "Addresses--relocatable and absolute"
in Part II of the manual.

### Can I use color in a Mops window?

You have to make the window a color window. The Window class now has a
new ivar, color?, and a method to set it, setColor: which takes a
boolean flag. So before you send new: or getNew: to your window, do:
`true setColor: myWindow`

Then when you send new: or getNew:, the window will be created as a
color window.

### How do I plot an Icon / use the Sound Manager / use an offscreen PixMap / use the serial port / [insert favorite problem here].

Well, this is an interesting question, but as as this is a general Mac
programming problem rather than something specifically to do with Mops,
I'm not really here to answer this sort of question. Try posting on
comp.sys.mac.programmer.help. I'm doing this in my spare time, so it's
probably not right for me to be taking time to answer basic Mac
programming questions. I don't have all the answers anyway. I'm
certainly not a substitute for Inside Mac. Read the appropriate parts
first, and if you're still stuck, try the newsgroup. There are plenty
of people willing and able to help there.

### I've written this nifty code, and I'd like you to look at it and tell me what you think.

I'd rather you didn't ask me that. If you go ahead and do it anyway,
I'll probably give you a nice answer since I don't want to put anybody
off and try to be a nice guy most of the time, but it will go very low
on the priority list and almost certainly never make it to the top.
Maybe consider posting it to comp.lang.forth.mac.

### I tried the code for the WhizBang99 algorithm that Joe Bloggs posted the other day, but it gave an error.

It's very unlikely that I saw the code or have any idea what you're
talking about. Please see above for how to submit a bug report. If I
respond at all, I'm likely to be less than polite. Should I have to do
detective work to find out what on earth you're talking about, when you
have all the information I need at your end? Please try to help me, and
then I'll be able to help you.

### What about a Windows version?

Get Win32Forth (on [Taygeta](http://www.taygeta.com/forth.html)). It now
supports much of the Mops OOP model.

### I think Mops is great, but it would be even better with [insert favorite nifty feature here].

Are you volunteering? (The person with the vision gets the job.)

### The Manual seems to be a bit out of date in places?

Documentation for freeware products sometimes struggles (tm).
Pull requests are welcome!

### Will you continue to support Mops for some time to come?

I've been doing it for 30 years now, and don't plan to stop!

### Why an oddball language that isn't C++?

Try it and see how quickly you can get things done. The most popular way
isn't always the best way. After all, you're using a Mac, aren't you?
