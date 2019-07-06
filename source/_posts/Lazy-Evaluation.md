---
title: Lazy Evaluation, foldr | 5kyu
date: 2019-07-06 12:42:24
tags:
- codewars
- JavaScript
---

关于 lazy evaluation，首先要明白两个概念：call by name 和 call by value：

```javascript
// Evaluates with call-by-name strategy
1 function callByName (a, b) {
2  if (a === 1) {
3    return 10
4  }
5  return a + b
6 }
// Evaluates with call-by-value strategy
1 function callByValue (a, b) {
2  if (a === 1) {
3    return 10
4  }
5  return a + b
6 }
```

两个函数在形式上没有什么区别，只是在运行时采取了不同的策略或态度，前者是 lazy，后者是 eager；

```shell
> callByName (1, 2 + 3)
> a === 1
> return 10

> callByValue(1, 2 + 3)
> callByValue(1, 5)
> a === 1
> return 10
```

使用 lazy evaluation，只用当真正需要读取这个变量或 expression 的时候，才会对其进行运算或 evaluate，也就是字面意义上的 call by need。

实现 lazy evaluation 有很多方法，但其核心概念则是 functional programming。即我们把所有的 variable 写成函数的形式，这样的函数通常被称为 thunk：

<!--more-->

```javascript
// Not lazy
var value = 1 + 1  // immediately evaluates to 2

// Lazy
var lazyValue = () => 1 + 1  // Evaluates to 2 when lazyValue is *invoked*

// Not lazy
var add = (x, y) => x + y
var result = add(1, 2)  // Immediately evaluates to 3

// Lazy
var addLazy = (x, y) => () => x + y;
var result = addLazy(1, 2)  // Returns a thunk which *when evaluated* results in 3.
```

理解了这一概念，就明白 codewars 上这道题目的用意了。

https://www.codewars.com/kata/foldr/javascript

题目很长，简单概括就是，我们需要实现一个 lazy evaluation 版本的 `reduceRight()` 函数。再把问题简化就是，如何实现上述所说的 call by need，举例来说，以 `indexOf` 函数为例：

```javascript
const indexOf = y => function (x, z) {
  if (x === y) {
    return 0
  } else {
    return z + 1 || -1
  }
};
```

`indexOf` 返回的是一个函数，比如 `indexOf(1)` 函数有两个参数 x 和 z，在 x 值为 1 的时候是 0，其他值时为 z+1。我们需要做的是对参数 z 实现 lazy evaluation，那么按照上述 functional programming 的概念，则应该是：

```javascript
const indexOf = y => function (x, () => someFunction()) {
  if (x === y) {
    return 0
  } else {
    return z() + 1 || -1
  }
};
```

这样，当 x 和 y 值相等时，函数直接返回值，z，也就是 someFunction 不会被调用，z 值实现了 lazy evaluation。很完美，不是吗？但问题是，`indexOf` 函数仅仅是用来测试的一个例子，对于函数内容是不可控也是未知的，我们无法亲自修改，把 `return z + 1 || -1`  改成 `return z() + 1 || -1`。

所以，问题最终就变成了，如何将一个变量，比如 `z`，在他需要使用，参与运算，被读取时才会 evaluate 它的值。答案是 `Object.prototype.valueOf()`。

> JavaScript calls the `valueOf` method to convert an object to a primitive value. You rarely need to invoke the `valueOf` method yourself; JavaScript automatically invokes it when encountering an object where a primitive value is expected.

使用 `valueOf()` ，可以

```javascript
> a = {}
{}
> a.valueOf = () => 3
[Function]
> a 
{ valueOf: [Function] }
> a + 1
4
> a.valueOf = () => true
[Function]
> !a 
false
> a && false 
false
> 
```

定义了 `valueOf` 方法后，Object a 可以像普通变量，更确切是 primitive value 那样进行运算，而且就如 lazy evaluation 那样，只有它被使用时，`valueOf` 函数才会被调用。因此，我们只需要在调用 `indexOf` 函数时这样调用：

```javascript
indexOf(1)(1, {valueOf: () => someFunction()})
```

即可。依照这样的思路，这道 codewars 问题也就迎刃而解。





参考链接：

- [Lazy Evaluation in Javascript](https://hackernoon.com/lazy-evaluation-in-javascript-84f7072631b7)
- [Meaning of Lazy Evaluation in Javascript](https://stackoverflow.com/questions/38904865/meaning-of-lazy-evaluation-in-javascript)
- [Object.prototype.valueOf()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)