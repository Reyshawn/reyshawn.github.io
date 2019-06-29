---
title: 'JavaScript: Semicolon 二三事'
date: 2019-06-29 23:02:41
tags:
- JavaScript
---

由于 JavaScript 拥有 *Automatic Semicolon Insertion* 这样的机制，我已经很长时间在写 js 的时候不加分号了。但今天碰到了这样的一个情况：

```javascript
let i = 0

(function test () {
  console.log('hello')
})()
```

这里会提示报错：

```
TypeError: 0 is not a function
```

观察了一会儿，才发现，JavaScript 引擎一定是把第一行和第三行看成一行代码，按道理，第一行末尾应该是要自动加一个分号的。这里如果我们手动加上分号，程序就不会报错了。

```javascript
let i = 0;

(function test () {
  console.log('hello')
})()
```

关于 JavaScript 的 *Automatic Semicolon Insertion*，规则是这样的：

<!--more-->

1. 当下一行开头的代码和本行末尾的代码连不上；
2. 当下一行是以 `}` 开头；
3. 在整个文件末尾会加分号；
4. 在 `return` 所在行末尾会加分号；
5. 在 `break` 所在行末尾会加分号；
6. 在 `throw` 所在行末尾会加分号；
7. 在 `continue` 所在行末尾会加分号；

上面这个例子，就是如果不在第一行加分号，则下一行以 `(` 开头，则会被当作函数调用。相似的情况还有：

```javascript
const hey = 'hey'
const you = 'hey'
const heyYou = hey + ' ' + you

['h', 'e', 'y'].forEach((letter) => console.log(letter))
// Uncaught TypeError: Cannot read property 'forEach' of undefined
```

以及关于 return 

```javascript
(() => {
  return
  {
    color: 'white'
  }
})()
// Instead, it’s undefined, because JavaScript inserts a semicolon after return.
```

以上都是由于不写分号，完全依赖 ASI ( Automatic Semicolon Insertion ) 可能造成的错误。

Dr. Axel Rauschmayer 在 2011 年就写了一篇 blog 来阐述这个问题，以及他对于分号的态度：

> - Always add semicolons and avoid the headaches of semicolon insertion, at least for your own code. Yes, you will have to type more. But for me, semicolons *increase* the readability of code, because I’m so used to them.
> - Don’t put postfix `++` (or postfix `--`) and its operand in separate lines.
> - If the following statements have an argument, don’t put it in a separate line: `return`, `throw`, `break`, `continue`.
> - For consistency (with `return`), if an opening brace or bracket is part of a statement, don’t put it in a separate line.



参考文章：

- [Semicolons in JavaScript](https://flaviocopes.com/javascript-automatic-semicolon-insertion/)
- [Automatic semicolon insertion in JavaScript](https://2ality.com/2011/05/semicolon-insertion.html)