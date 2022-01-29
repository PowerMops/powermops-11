---
title: Assembler and Disassembler
layout: default
---

The Mops' PowerPC assembler and disassembler were originally written by
Xan Gregg for Power [MacForth](http://www.macforth.com/). They've been
adapted for use in the Mops environment as modules. The source files are
"`pasmMod.txt`" and "`disasm`". The
syntax is traditional Forth postfix-style.

Assembler colon definitions
---------------------------

You write a code definition thus:

```bash
`:ppc_code  someName`\
`       </nowiki><var><ppc instructions></var><nowiki>`\
`;ppc_code`\
```

This will create a normal header for `someName` in the
dictionary, then align the CDP to a 4-byte boundary (as required for
PowerPC code), and compile the code. Note that if you tick
`someName`, the resulting xt on the stack will be the
address of the first instruction, **minus 2**. The extra 2 bytes are
used internally (by Mops) as flags. Remember to add 2 if you need the
actual address of the first instruction. If, however, you use
`EXECUTE`, you pass the xt in the normal way.

We don't provide a full rundown of the assembly syntax here; however
the comments in the source files are fairly extensive. So if you're the
type of person who might want to write assembly language, you'll
probably be able to figure out what to do! &\#148;especially as the file
"`test pasm`" in the 'Module Source' folder has a
definition containing all the PowerPC instructions supported by the
assembler. Remember that it's a Forth-style postfix assembler. We also
give a short example at the end of this section, and there are a number
of code definitions in the source files in 'PPC source', especially
the file "`setup`".

We don't provide any way of writing a method with the assembler. This
should never be necessary for performance, and if you really need access
to machine-level features, you can write a
`\<nowiki\>:ppc\_code\</nowiki\>` word and call it from
your method.

Accessing the dictionary
------------------------

If you need to get the address of an item in the code or data area of
the dictionary, you can do it with this syntax:

`r0     ' <var>someWord</var>   <var>dicaddr,</var>`

This generates an `addi` instruction, using the
appropriate base register and offset to place the address of the
location you want into a register. We used `r0` in this
example, but you could have used any free register. For a location in
the data area, remember that ticking the name of the item won't get you
there&\#148;you have to do something like this:

`r0     ' <var>myValue</var> >body  <var>dicaddr,</var>`

You can execute any code you like between naming the register and
putting `dicaddr,`. You are in execution mode, and can
execute any Mops words, so long as you leave just one item on the stack.
One proviso is that at the moment, the target address must be within 32k
bytes distance from where the base register points, as otherwise the
address can't be generated with a single `addi`
instruction. If the assembler gives you an out-of-range error on a line
with `dicaddr,` this is probably the reason.

Executing colon definitions from code
-------------------------------------

In a word, don't. Mops colon definitions will expect various numbers of
their parameters in registers when they're called, and the algorithm
for working this out is quite complex (and might even change!). So you
should really only use code definitions for words that don't call any
other words.

Executing other code definitions from code
------------------------------------------

There's no problem with doing this, since you have full control of the
registers. Remembering that the first instruction of a code definition
starts two bytes after where the xt points, you call another code
definition this way:

`' <var>someWord</var> 2+       bl,`

The Assembler automatically converts the absolute address of the first
instruction of `someWord`, which we generate with
'`someWord 2+`', to the offset that is required by the
`bl` instruction.

Assembler source
----------------

The assembler-related source files are all in the 'Module source'
folder. They are:

  ------------------- ---------------------------------------------------------------
  pasmMod.txt         the assembler
  disasm              the disassembler (loaded by "`pasmMod.txt`")
  test pasm           a big test definition with all the PPC instructions
  vectors pasm test   another big test definition with all the AltiVec instructions
  ------------------- ---------------------------------------------------------------

On entry to a code definition, the top-of-stack item is in register
`r4`, the second item is in `r3`, and the
next stack item is in memory, pointed to by the data stack pointer,
`r18`. You can do whatever you like with the stack
(within reason), but on exit from your definition you must observe this
same convention.

Within the definition, you can use registers
`r5`-`12` freely for whatever you like
without having to save or restore them. You can also use
`r23`-`31`, but as Mops uses these for
locals, they might contain values in use by the calling code. So you
will need to save and restore any of these that you use.

The same applies to the floating point stack. On entry to a code
definition, the top-of-stack item is in register `fr2`,
the second item is in `fr1`, and the next stack item is
in memory, pointed to by the FP stack pointer, `r19`. You
can use `fr0` and
`fr3`-`13` without saving or restoring
them. `fr14`-`31` are used for FP locals,
so you can use them if you save and restore them.

PowerPC register usage
----------------------

Here's a summary of the register usage in the PowerMops runtime
environment:

  ----------------------- -------------------------------------------------------------- ---------
                          `r0`                                            scratch
  `r1`     system stack pointer (leave it alone, normally)                
  `r2`     RTOC (Table Of Contents pointer \-- leave alone)               
  `r3`     initially, second stack cell                                   
  `r4`     initially, top stack cell                                      
  `r5`     scratch                                                        
  `r6`     scratch                                                        
  `r7`     scratch                                                        
  `r8`     scratch                                                        
  `r9`     scratch                                                        
  `r10`    scratch                                                        
  `r11`    scratch, also used in system calls                             
  `r12`    ditto                                                          
  `r13`    base address of main dic code area                             
  `r14`    base address of main dic data area                             
  `r15`    base address of current module's code area                    
  `r16`    base address of current module's data area                    
  `r17`    return stack pointer (points to top cell)                      
  `r18`    data stack pointer (points to top memory cell)                 
  `r19`    floating point stack pointer (points to top memory cell)       
  `r20`    base address of current object                                 
  `r21`    loop counter I                                                 
  `r22`    limit value for `DO`\...`LOOP`   
  `r23`    can use if you save and restore                                
  `r24`    ditto                                                          
  `r25`    ditto                                                          
  `r26`    ditto                                                          
  `r27`    ditto                                                          
  `r28`    ditto                                                          
  `r29`    ditto                                                          
  `r30`    ditto                                                          
  `r31`    ditto                                                          
  &nbsp;                                                                                 
  `fr0`    scratch                                                        
  `fr1`    initially, second stack cell                                   
  `fr2`    initially, top stack cell                                      
  `fr3`    scratch                                                        
  `fr4`    scratch                                                        
  `fr5`    scratch                                                        
  `fr6`    scratch                                                        
  `fr7`    scratch                                                        
  `fr8`    scratch                                                        
  `fr9`    scratch                                                        
  `fr10`   scratch                                                        
  `fr11`   scratch                                                        
  `fr12`   scratch                                                        
  `fr13`   scratch                                                        
  `fr14`   can use if you save and restore                                
  `fr15`   ditto                                                          
  `fr16`   ditto                                                          
  `fr17`   ditto                                                          
  `fr18`   ditto                                                          
  `fr19`   ditto                                                          
  `fr20`   ditto                                                          
  `fr21`   ditto                                                          
  `fr22`   ditto                                                          
  `fr23`   ditto                                                          
  `fr24`   ditto                                                          
  `fr25`   ditto                                                          
  `fr26`   ditto                                                          
  `fr27`   ditto                                                          
  `fr28`   ditto                                                          
  `fr29`   ditto                                                          
  `fr30`   ditto                                                          
  `fr31`   ditto                                                          
  ----------------------- -------------------------------------------------------------- ---------

Example
-------

Finally, here's a short example, from the file
"`pnuc1`" (in 'PPC source'). This is the definition
of `PICK`.

```bash
`:ppc_code PICK`\
`       r4      0               cmpi,       \is it 0 pick?`\
`  eq if,`\
`       r4      r3 r3           or,         \yes - copy TOS`\
`  else,`\
`       r5      r4 2 0 29       rlwinm,     \no- mult index by 4 by left shift`\
`       r5      r5 -4           addi,       \and subtract 4 to get SP offset`\
`       r4      r18 r5          lwzx,       \grab the cell`\
`  then,`\
`                               blr,        \and return.`\
`;ppc_code`\
```

Note that `PICK` doesn't push or pop from the data
stack, but simply replaces the top cell (in `r4`) with
the stack cell that it fetches. Also, since it doesn't call any other
routine, there's no need to save and restore the return address which
is in the link register on entry. If we had needed to save and restore
the link register, we would have put the instructions

`       r0                      mflr,      \save lr on return stack`\
`       r0      -4  rRP         stwu,`

at the beginning, and

`       r0                      mtlr,      \restore lr`

at the end before the `blr,`.

Note also that we need to special-case the '`0 pick`'
case, since the desired cell isn't in the memory part of the stack, but
is already in `r3`.

For an example of a much longer code definition, have a look at
`(EX)` in the file "`setup`" (in 'PPC
source').

> Warning: If you are already familiar with the old 68k Mops Assembler,
> note that you *must* write instructions at the end of your code routine
> so that it will return. The PowerPC Assembler doesn't do this for you,
> since it can't always know where your return address is. (It might not
> necessarily be in the link register at that point&\#148;you might have
> put it in the count register or have saved it on the return stack or
> somewhere else.)

## Disassembler

The disassembler will disassemble PowerPC code from a range of addresses
you specify, dumping its output to the Mops window.

You call the disassembler with one of the following words:

  ------------------------------- ---------------------------------------------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
  `disasm\_word`   `someWord`                                        Disassembles the word `someWord`.
  `disasm\_xt`     `( xt \-- )`                                      Disassembles the word with the given xt.
  `disasm\_rng`    `( from to \-- )`                                 Disassembles within the given address range.
  `disasm\_cnt`    class="STACK" nowrap \| `( from \#inst \-- )`   Starts at 'from', disassembles the given number of instructions.
  `disasm`         `( from \-- )`                                    Starts at 'from', keeps going till you hit a key or until a `blr` instruction is seen (which normally comes at the end of a definition).
  ------------------------------- ---------------------------------------------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------



