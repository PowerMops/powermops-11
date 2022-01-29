---
title: Files
layout: default
---

## About this chapter

This chapter describes the Mops classes and words that provide an
interface to the Macintosh file system. Class File combines a Toolbox
parameter block with methods for reading, writing, interpreting and
getting information about files; including Standard File I/O. FileList
provides a mechanism for dynamic allocation of File objects instead of
having to create them statically in the dictionary.

  ------------------------------------------------------------------------------------------------------------
  [Inside Macintosh](http://developer.apple.com/documentation/macos8/mac8.html)
  [File Manager](http://developer.apple.com/documentation/mac/Files/Files-72.html)
  [Device Manager](http://developer.apple.com/documentation/mac/Devices/Devices-10.html)
  [Package Manager](http://developer.apple.com/documentation/mac/OSUtilities/OSUtilities-212.html)
  [Standard File Package](http://developer.apple.com/documentation/mac/Files/Files-302.html)
  [Structure of a Macintosh Application](http://developer.apple.com/documentation/mac/aoceapi/Contents.html)
  ------------------------------------------------------------------------------------------------------------

### Recommended reading

  -------------- --------
  Files          pFiles
  Nav            
  PathsMod.txt   
  -------------- --------

  : Source files

## Using files

All file access in Mops is done through an object of class File. For
instance, when you request that a source file be loaded, Mops creates a
new File object, gives it a filename, opens it, and interprets from the
file rather than from the keyboard. The Toolbox supports two basic means
of File specification and access, the so-called High Level routines,
which all start 'FS' or 'FSp', and the Low Level routines, which all
start 'PB' or 'PBH'. Class File uses the latter type of call, partly
because they are supported in all versions of the MacOS from 6 onwards,
and partly for the flexibility they give. These routines communicate
with the Toolbox through a block of parameters, and class File has, as
the first part of its data, such a parameter block, also called a File
Control Block (FCB). Inside Macintosh refers to this as a basic File
Manager Parameter Block (ParamBlockRec), which is also equivalent to an
HFS Parameter Block (HParamBlockRec). This holds the data about the file
that is needed by the Device Manager and the File Manager. Appended to
this is a 64-byte area that holds the name of the file that is
associated with the File object.

Since the individual components of the parameter block are not named in
class File, you will need to consult I.M. File Manager if you wish to
understand exactly what each call is doing. In addition, because class
File is needed before xcalls is loaded, and therefore before SYSCALLS
are available, the file access is all done through assembly language
calls. Consult the PowerPC version of class File (in file pFile) to see
what routines are being used. To create an access path to a file, you
must first create an object of class File, give it a name, and open it:

`File myFile`\
`" someFilename" name: myFile`\
`open: myFile abort" open failed"`

The Name: message first clears the parameter block so that fields won't
be left over from a previous open. (This implies that you must set
information other than the file name, like setVref:, after sending the
Name: message.) When you open the file, a unique IORefNum is assigned to
it and placed in the parameter block. You may then use any of the I/O
methods to access the file, most of which return a code that reflects
the result code from the Macintosh File Manager. If this code is non-0,
it means that an error occurred during the I/O. You should check for EOF
(-39) on reads, which should not always be treated as an error.

Because File objects are almost 150 bytes in length, it is useful to be
able to allocate them dynamically rather than have them locked into a
static dictionary. Class FileList, which is a subclass of HandleList,
provides this function by maintaining a 'stack' of handles
to file objects in the heap. Mops has a single 6-element object of class
FileList, called LoadFile, that it uses internally to provide a nested
load facility. You can request that LoadFile allocate a new temporary
File with the message pushNew: LoadFile. The objPtr Topfile is
maintained to always point to the last File object allocated, which is
the 'top' of the file stack. Thus, you can use phrases like:

`open: topfile`\
`myBuf 100 read: topfile`

After you are through using a dynamically allocated File object, you
must close it and remove it from the file stack:

`drop: loadFile`

Drop: automatically ensures that topFile is closed, but if you need to
see the 'close' return code you will want to issue close:
topfile before drop: loadfile.

The Clear: method in FileList closes and removes any currently allocated
files in the list, and is called by Mops's default Abort routine.

There is a word, LOADTOP, which will open topfile, then invoke the Mops
interpreter to interpret from that file rather than the keyboard, then
close topfile when it reaches the end. Interpretation will echo loaded
text to the screen if the system Value echo? is true, and will end
immediately if there is an error. There is also an Accept: method in
File that simulates a Mops ACCEPT, but reads from a file.

## Standard File Package

The StdGet: and StdPut: methods give easy access to the Macintosh
Standard File Package. This code is called by most applications when the
user needs to select a file to open, or a "Save As" name.
StdGet: and StdPut: set up and execute the various calls to the package
manager. StdGet: calls SFGetFile, which displays the familiar scrollable
list of files to open within a rectangle, and returns with a boolean on
the top of the stack that tells you whether the user actually picked a
file or hit the Cancel button. If the boolean is true, your file object
will have been set up with the parameters obtained by SFGetFile.

StdPut: is used when you need to get a name from the user for a Save.
You need to provide two strings---the first is a prompt, such as
"Save file as:", and the second is the default filename that
will appear within the text edit item of the dialog. The user is free to
edit the text, and the method will return if the user hits Save, Cancel
or the Return key. Again, a boolean is returned and if it is true, your
file object will have been set up with the parameters obtained by
SFPutFile.

With the StdGet: message, you provide a list of up to four file types to
be filtered by SFGetFile. Only the file types that you have listed will
be included in the list of files to select. For instance,

`'type TEXT 1 stdGet: topfile`

causes the Standard File Package to include only files of type
'TEXT' in its list, (the 1 indicates the number of types
specified). If you want all file types to be shown, do it thus:

`-1 stdGet: topfile`

Keep in mind that neither StdGet: nor StdPut: ever actually open the
chosen file. They are identical in function to sending Name: &
SetVref: to the file object. You must subsequently send a Create:,
CreateNew:, Open: or OpenReadOnly: before you can access the file. The
difference between Create: and CreateNew: is that the former will reuse
a file if it already exists, which has the advantage that the file's
icon stays where it was (useful if you are saving the same file over and
over). The latter always creates a new file, so the file creation date
is always correct.

## Hierarchical File System

Mac folders are the equivalent of MS-DOS or Unix directories. This means
that to find a file, the system needs not only its name but the names of
all the nested folders in which it is located. The names of these
folders, from the top level down, is called the path to the file. If you
need to, you can in fact specify a file with a full pathname, which
takes the form

`volumeName:folder1:folder2:folder3:filename`

This is not normally a good idea, at least not in an installed
application, since a user might rename or move a folder at any time,
which would render the full pathname invalid. Apple recommend that you
use Standard File calls whenever possible to locate files.

However in some situations you may know that some files are always in
particular places, and in these situations you may use a full pathname.
Probably you will always keep your Mops source files in the same place,
for example.

To make the management of full pathnames easier in such situations, we
provide a mechanism which is integrated into the Open: method of class
File, whereby a set of possible pathnames can be prepended to the
filename, one at a time, until the file is found. We use this system in
the running of the Mops development system itself, so that Mops source
files can be stored in a number of different folders without requiring
you to have to provide full pathnames or answer many Standard File
dialogs. We call this set of pathnames a pathlist. You specify a
pathlist in an ordinary text file. The format is, for example,

`::System source:`\
`::Module source:`\
`::Toolbox Classes:`\
`::Mops folder:`

Each line specifies the exact string which will in turn be prepended to
the unqualified filename in the file object in an attempt to find the
file on the disk. Note however, that whatever you specify in the
pathlist, the first folder searched will be the "default
folder", which is the folder from which the application started
up, (the folder in which the Mops nucleus resides until the application
is 'installed'). If the file isn't found in the default
folder, the path specified in the top line of the pathlist file will be
used, then the second, and so on, until either the file is found or the
list is exhausted. If the file still isn't found, a "file not
found" error will be returned.

In this example all the paths start with two colons. This says to step
out of the folder in which the application resides then step down into
the specified folder. You may also specify one colon which says to step
down into the specific folder immediately within the application folder;
or you might use three colons which say to step out of two folder levels
then step down. You may also begin with no colon which specifies a disk
name. To load a pathlist file, type e.g.:

`" myPath" getPaths`

This loads the list from the file named myPath into a string which is
maintained by the PathsMod module, which is called by Open:. From then
on any Open: will search this pathlist to find the file to be opened;
unless the file name is already fully qualified. This technique gives
you a degree of transparency since the specific code which issues the
Open: never needs to know the particular paths which are being searched.

You may disable the use of any pathlist by setting the value use\_paths?
false. This is the initial default in installed applications. When you
call getPaths, this value is set true, so you don't need to do it
yourself.

Classes
-------

### File

------------------------------------------------------------------------

File provides object oriented access to the Macintosh File Manager. An
object of class File should be created for each separate access path
required in your application. File objects can be allocated dynamically
by using a FileList.

```
+------------------------------+--------------------------------------+
| Superclass                   | Object                               |
+==============================+======================================+
| nowrap \| Instance variables |                                      |
+------------------------------+--------------------------------------+
|                              | +----------+----------+----------+   |
|                              | | Class    | Name     | des      |   |
|                              | |          |          | cription |   |
|                              | +==========+==========+==========+   |
|                              | | 134      | FCB      | max      |   |
|                              | | bytes    |          | p        |   |
|                              | |          |          | arameter |   |
|                              | |          |          | block    |   |
|                              | |          |          | (108 but |   |
|                              | |          |          | for      |   |
|                              | |          |          | hg       |   |
|                              | |          |          | etvinfo) |   |
|                              | +----------+----------+----------+   |
|                              | | FSSpec   | mySpec   | record { |   |
|                              | |          |          |          |   |
|                              | |          |          |   ------ |   |
|                              | |          |          | ---- --- |   |
|                              | |          |          | -------- |   |
|                              | |          |          |   int    |   |
|                              | |          |          |        F |   |
|                              | |          |          | SvRefNum |   |
|                              | |          |          |   va     |   |
|                              | |          |          | r        |   |
|                              | |          |          |  FSDirID |   |
|                              | |          |          |   64     |   |
|                              | |          |          | bytes    |   |
|                              | |          |          | FileName |   |
|                              | |          |          |   ------ |   |
|                              | |          |          | ---- --- |   |
|                              | |          |          | -------- |   |
|                              | |          |          |          |   |
|                              | |          |          | }        |   |
|                              | +----------+----------+----------+   |
|                              | | 256      | filename | Buffer   |   |
|                              | | bytes    |          | for      |   |
|                              | |          |          | Open\_Wi |   |
|                              | |          |          | th\_Path |   |
|                              | +----------+----------+----------+   |
+------------------------------+--------------------------------------+
| Source file                  | Files pFiles Nav                     |
+------------------------------+--------------------------------------+
| Status                       | Core                                 |
+------------------------------+--------------------------------------+
| Indexed data                 | None                                 |
+------------------------------+--------------------------------------+
| System objects               |                                      |
+------------------------------+--------------------------------------+
|                              |   Name   description                 |
|                              |   ------ -                           |
|                              | ------------------------------------ |
|                              |   fFcb                               |
|                              |  Used by Mops for system file access |
+------------------------------+--------------------------------------+

  Inherits:   Object
  ----------- --------

  getting file information
  ------------------------------
  size:
  bytesRead:
  result:
  getName:
  getFref:
  getVref:
  getDirID:
  getType:
  getFileInfo:
  print:
  setting file characteristics
  stdget:
  stdput:
  navget:
  navput:
  name:
  setName:
  rename:
  mode:
  set:
  setFref:
  setVRef:
  setDirID:
  file operations
  create:
  createNew:
  open:
  openReadOnly:
  new:
  read:
  write:
  readLine:
  moveTo:
  last:
  close:
  delete:
  volume-level operations
  flushVol:
  parameter block access
  fcb:
  clear:
  interpretation
  accept:

  : Methods

**Error messages** - None --- return codes from File Manager
```
### Container

------------------------------------------------------------------------

Container is a subclass of File, that provides support for persistent
objects. Note that isn't necessarily the only way that this support
could be done.

You link an object to a Container by passing in the object's address to
the Init: method of Container. Then subsequently, when you send Save: to
the Container, the object is serialized and written out to the file, and
the file is closed. When you send Open: the file is opened and the
object is recreated in memory, and the file is closed again. The object
can be a HandleList, and so can be a collection of an arbitrary number
of objects from arbitary classes.

+------------------------------+--------------------------------------+
| Superclass                   | File                                 |
+==============================+======================================+
| Source file                  | Container                            |
+------------------------------+--------------------------------------+
| Status                       | Optional                             |
+------------------------------+--------------------------------------+
| nowrap \| Instance variables |                                      |
+------------------------------+--------------------------------------+
|                              |   Class     Name     description     |
|                              |   --------- -------- --------------  |
|                              | ------------------------------------ |
|                              |   dicaddr   \^obj    po              |
|                              | inter to the object we're linked to |
|                              |   bool      setup?   true once th    |
|                              | e file has been opened at least once |
+------------------------------+--------------------------------------+
| Indexed data                 | None                                 |
+------------------------------+--------------------------------------+
| System objects               | None                                 |
+------------------------------+--------------------------------------+

  Inherits:   File, Object
  ----------- --------------

  ------- -------------------------------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  init:   ( \^obj \-- )                                      Must be called before you use the continer. The passed-in object is the one you're linking to
  open:   ( \-- )                                            Opens the file, as for Open: in class File. Then sends Bring: to the object, with the container's address, so that the object will read in its bytes from the file and reconstitute itself in memory. Finally the file is closed
  save:   nowrap \| ( typ crtr addr1 len1 addr2 len2 \-- )   If save: hasn't been called before, calls the Standard Put file routine using the passed-in parameters, as for StdPut: in class File. If save: has been called before, the boolean setup? will be true, and we assume all the file info is valid, and just send Open: super. Then after that, we send Send: to the object so that it will serialize itself and write its bytes to the file. Finally the file is closed
  ------- -------------------------------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  : Methods

**Error messages** - None

After each File Manager call, the forward defined word OK? is called,
and is passed the return code from the File Manager. You can resolve
this word however you like.

### FileList

------------------------------------------------------------------------

FileList is a HandleList with specialized methods that assume the
elements contain handles to File objects. It provides dynamic allocation
of File objects, keeping the handles in what is effectively a file
stack.

+------------------------------+--------------------------------------+
| Superclass                   | HandleList                           |
+==============================+======================================+
| Source file                  | Files                                |
+------------------------------+--------------------------------------+
| Status                       | Core                                 |
+------------------------------+--------------------------------------+
| nowrap \| Instance variables | None (see HandleList)                |
+------------------------------+--------------------------------------+
| Indexed data                 | 4-byte cells containing handles to   |
|                              | File objects                         |
+------------------------------+--------------------------------------+
| System objects               |                                      |
+------------------------------+--------------------------------------+
|                              |   Name       description             |
|                              |   ---------- ------                  |
|                              | ------------------------------------ |
|                              |   loadFile   6-el                    |
|                              | ement FileList used for nested loads |
+------------------------------+--------------------------------------+

  Inherits:   HandleList, ObjHandle, Array, Obj-array, Handle, Var, Longword, Indexed-Obj, Object
  ----------- -------------------------------------------------------------------------------------

  accessing
  -----------
  pushNew:
  drop:
  clear:

  : Methods

  ------------------------------------
  **Error messages**
  **"My list is empty"**
  ------------------------------------



