---
title: Pwn Basics
description: An introduction to binary exploitation for CTF pwn challenges.
---

# Pwn Basics

Pwn challenges require you to understand a program's memory and control flow, then turn a bug into code execution.

::: info In progress
This category is being written. Planned topics:

- Process memory layout and calling conventions
- Stack overflows and return address hijacking
- Format string vulnerabilities
- ROP and ret2libc
- Heap exploitation: UAF, double free and House of series
- Sandbox and seccomp escapes
- pwntools and debugging workflows
:::

## Study tips

1. Learn C and x86-64 assembly before diving into exploitation.
2. Get comfortable with gdb, pwndbg, checksec and IDA.
3. Start with simple stack overflows, then add Canary, NX, PIE and ASLR.
