---
title: Pwn 入门
description: CTF Pwn 方向入门：二进制漏洞原理与利用技术。
---

# Pwn 入门

Pwn 方向研究程序的二进制漏洞，通过构造输入控制程序执行流，最终获取目标权限或读取 Flag。

::: info 内容建设中
本分类的文章正在整理中，后续会陆续补充。可以先从以下主题开始准备：

- 程序内存布局与函数调用约定
- 栈溢出与返回地址劫持
- 格式化字符串漏洞
- ROP 与 ret2libc
- 堆漏洞（UAF、Double Free、House of 系列）
- 沙箱与 seccomp 逃逸
- pwntools 与调试技巧
:::

## 学习建议

1. 先掌握 C 语言与 x86-64 汇编基础，理解栈帧结构。
2. 熟悉 gdb、pwndbg、checksec、IDA 等工具。
3. 从最简单的栈溢出题目开始，逐步增加保护机制（Canary、NX、PIE、ASLR）。
