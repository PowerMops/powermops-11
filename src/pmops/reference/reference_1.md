---
title: Mops and QuickEdit
layout: default
---

## The Mops Menu Bar

Mops has a simple set of menus, yet the features built into them make
writing code, compiling, and debugging rather easy. When you start
Mops.dic or PowerMops, a specially designed Mops 'front end' brings in
the basic Mops menus --- Apple, File, Edit, Utilities, and Mops.

To help you understand the functions of each menu selection, we'll
describe the action of each menu item. We'll also explain the built-in
utilities, which can make you more productive in program creation and
debugging. Also see Part II, Chapter 2 for more details on the operation
of an Editor.

### The Apple Menu

<dl>
<dt>About Mops...<dt><dd>Displays the Mops version number and the date that version was released.</dd>
<dt>Quit PowerMops</dt><dd>OS X only. This is the equivalent of the Mops command, 'bye'. All files are immediately closed, and you are returned to the desktop.</dd>
</dl>

### The File Menu

<dl>
<dt>Load...</dt><dd>Allows you to load text source files on top of the Mops dictionary currently in memory (the same as issuing the ˜// filename' command from the Mops prompt). The standard file dialog box appears, from which you can select the file to load. As the source file loads, it is compiled by Mops. If your program requires the loading of several text files, the files must be loaded in the proper order (so that dependent words and classes are loaded after the words or classes they depend on). The word NEED, which we described in the Tutorial, makes it easy to ensure everything is loaded in the right order.</dd>
<dt>Save Dictionary</dt><dd>Copies to a disk a compiled image of a program you have in memory. It saves the image to a file with the same filename as is shown at the top of the Mops window. For this reason, Save should be used with care. If you have added code to Mops dictionary and wish to save the image as a separate application, then use "the Save As…" selection, below; otherwise, your Mops.dic or PowerMops file will contain your additions.</dd>
<dt>Save Dictionary As...</dt><dd>Lets you copy to a disk a compiled image of a program you have in memory (you are prompted for a new filename, and you may save to a different disk, if you like). For example, when Mops.dic or PowerMops was originally built, its compiled image was saved with this command. To start a program saved in this manner, double-click the appropriate Mops document icon from the desktop, just as you start Mops. It is recommended that you save programs in this manner only after their source code has been sufficiently debugged. Until then, you'll want to take advantage of the interactivity of the Mops interpreter while debugging source files by maintaining the code as source files and Loading them to test how well the program runs.<br />
In Mach-O PowerMops, the executable file must be renamed to be "PowerMopsM" before making it run. Control+click on PowerMops icon, select "Show Package Contents" from popup menu, then dig into the folder structure there to the "MacOS" folder. You will find your newly saved PowerMops executable among files.</dd>
<dt>Quit</dt><dd>This is the equivalent of the Mops command, 'bye'. All files are immediately closed, and you are returned to the desktop.</dd>
</dl>

### The Edit Menu

<dl>
<dt>Cut, Copy, Paste, Clear and Select All</dt><dd>These perform all the customary editing functions in the Mops window.</dd>
</dl>

### The List Menu

<dl>
<dt>Words</dt>
<dd>Presents a running list of all words in the current dictionary, starting with the word most recently defined (i.e., highest in memory). The name field of each dictionary entry is displayed along with the hex address of the name field. To pause the list, press any key once. To restart the list, press the Spacebar; to cancel the list display, press any key other than the Spacebar.</dd>
<dt>Objects...</dt>
<dd>Presents a list of all objects and its class in the current dictionary, alphabetically sorted.</dd>
<dt>Classes...</dt>
<dd>Presents a list of all classes and its superclass(es) in the current dictionary, alphabetically sorted.</dd>
</dl>

### The Show Menu

<dl>
<dt>HFS Paths</dt>
<dd>Presents a list of all classes and its superclass(es) in the current dictionary, alphabetically sorted.</dd>
<dt>Free Space</dt>
<dd>Displays in the Mops window the amount of memory available for new dictionary entries, as well as the condition of the heap. The Total heap figure is the current available heap if you do nothing to purge modules from it. The Largest block figure represents the largest amount of heap available in a contiguous block if you purged all extraneous blocks from the heap. A typical listing is:<br>
<br> 	
68k Mops sample:
<pre>
Room in dictionary:                    223926
Distance to top of hibase range:        61906
Total heap (no purge):                 325888
Largest block (purge):                 325990
</pre>

PowerMops sample:
<pre>
Room in data area of dictionary:                200000
Room in code area of dictionary:               1500000
Distance to top of mainData range (neg is OK):   49268
Distance to top of mainCode range:             -336632
Total heap (no purge):                         20971520
Largest block (purge):                         20971520
</pre>
</dd>
<dt>Show Module Status</dt>
<dd>Lists all modules defined in the dictionary in memory, and indicates which one(s) are currently on the heap by printing their load addresses. Modules are locked while executing to prevent their being removed from the heap at an inopportune time. A typical listing is shown below:
<pre> 	
ZUTILMOD       modHdl    6D32E8 -> 185CC00 
seg#      42 
flags     0 
install?  false

ZMINSTLMOD     modHdl    (not loaded)
seg#      40 
flags     0 
install?  false

ZFEMOD         modHdl    A3DE0 -> 181FC00
seg#      38 
flags     0 
install?  false

MLTEFWINDMOD   modHdl    A3E2C -> 182D800
seg#      36 
flags     0 
install?  false

PREFERENCESMOD modHdl    A3E38 -> 6C9000 
seg#      34 
flags     0 
install?  false

ZEXTRASMOD     modHdl    (not loaded)
seg#      32 
flags     0 
install?  false

SHAREDLIBMOD   modHdl    (not loaded)
seg#      30 
flags     0 
install?  false

ZDIALOGMOD     modHdl    (not loaded)
seg#      28 
flags     0 
install?  true

ZMENUMOD       modHdl    A3DEC -> 1828000 
seg#      26 
flags     0 
install?  true

ZWINDOWMOD     modHdl    A3E34 -> 1830600 
seg#      24 
flags     0 
install?  true

GCMOD          modHdl    6D32D8 -> 1852200 
seg#      22 
flags     0 
install?  true

MACHOMOD       modHdl    (not loaded)
seg#      20 
flags     0 
install?  false

ZCALLSMOD      modHdl    (not loaded)
seg#      18 
flags     0 
install?  false

PASMMOD        modHdl    (not loaded)
seg#      16 
flags     0 
install?  false

ZCASEMOD       modHdl    (not loaded)
seg#      14 
flags     0 
install?  false

CALL1&LMOD     modHdl    (not loaded)
seg#      12 
flags     0 
install?  false

PATHSMOD       modHdl    A30D8 -> 1806800 
seg#      10 
flags     2 
install?  false
</pre>
</dd>
</dl>

### The Utilities Menu

<dl>
<dt>Echo During Load</dt>
<dd>Displays every line of text from a source file as it is being loaded and compiled into Mops. Use this feature in the early stages of program development to aid you in discovering exactly where your bugs are cropping up. By following the load, line-by-line, you can see exactly where Mops runs into trouble and stops the load. Once your code is sufficiently debugged, you can turn off echo to speed up loading. This selection is identical to the Mops command +echo. If you select "Echo During Load", a check mark appears next to the menu listing. Selecting it again turns off the feature and removes the check mark. You can pause an echoed load by hitting a key, while quiet loads do not pause to permit type-ahead.</dd>
<dt>Clear Stack</dt>
<dd>Clears the stack. This command is also available in QuickEdit.</dd>
<dt>Clear Window</dt>
<dd>Clears all text from the Mops window. This command is also available in QuickEdit.</dd>
<dt>Install</dt>
<dd>The use of Install is described in the Tutorial.</dd>
<dt>Purge Modules</dt>
<dd>Clears the heap of all modules loaded by your program.</dd>
</dl>

## Communication with QuickEdit

Mops and QuickEdit send [Apple
Events](http://developer.apple.com/documentation/mac/IAC/IAC-94.html) to
each other, with a number of benefits. Of course, to use these features,
both Mops and QE must be running. If this isn't so, or if you're
running an earlier system which doesn't support Apple events, these
commands will be ignored.

1.  If an error occurs during loading a file, Mops sends QE an Apple
    event asking it to open the source file at the error line.
2.  The Mops command 'edit someFile' will ask QE to open the given
    file.
3.  The Mops command 'openSource someWord' will ask QE to open the
    source file containing the definition of someWord. If there's a log
    file, QE will put the cursor to the start of the definition. If
    there isn't, QE will search to the first occurrence of 'someWord'
    in the file (which will probably be at the start of the definition
    anyway, or maybe in a comment just before).

In QE, there is now a **Mops** menu with a number of commands:

1. Load
2. Save and load (command- K)
3. Clear Stack (command- 0). Also now available in Mops as command-0.
4. Open Source (command- =). You highlight a word, 'someWord' say,
    then choose this command, and QE asks Mops to execute 'OpenSource
    someWord' as described above.
5. Clear Window (command- --). Clears the Mops window. Also
    available in Mops as command-2.
6. Glossary (command- Y). Opens QE's glossary of Mops words and
    classes. The word under or to the left of the cursor (if any) is
    searched for automatically.
7. Edit file (command- E). You highlight a word, then choose this
    command. If Mops is running, it will open the file with that name
    (if it exists).



