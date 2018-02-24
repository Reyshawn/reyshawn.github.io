---
title: 'Codewars.com | ES5 Generators(i) 和闭包 closure '
date: 
tags:
- 算法
- codewars
- JavaScript
categories: 
---

## Kata

Description:

This is the first part of three ([part2](http://www.codewars.com/kata/es5-generators-ii), [part3](http://www.codewars.com/kata/es5-generators-iii)).

Generators and Iterators are new ES6 features that will allow things like this:

```javascript
function* fibonacci() {
    let [prev, curr] = [0, 1];
    for (;;) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}
```

Using them in this way, we can do amazing things:

```javascript
let seq = fibonacci();
print(seq.next()); // 1
print(seq.next()); // 2
print(seq.next()); // 3
print(seq.next()); // 5
print(seq.next()); // 8
```

This is powerful, but until a few months later, ES6 will not be born.

The goal of this kata is to implement pseudo-generators with ES5.

<!-- more -->

The first thing to do is to implement the generator function:

```javascript
function generator(sequencer) {
   ...
}
```
`generator(sequencer[, arg1, arg2, …])` receives a sequencer function to generate the sequence and returns and object with a `next()` method. When the `next()` method is invoked, the next value is generated. The method could receive as well optional arguments to be passed to the sequencer function.

This is an example of a dummy sequencer:

```javascript
function dummySeq() {
  return function() {
    return "dummy";
  };
}
```
To test generator(), you could use `dummySeq()` in this way:

```javascript
var seq = generator(dummySeq);
seq.next(); // 'dummy'
seq.next(); // 'dummy'
seq.next(); // 'dummy'
....
```
When you're done, you should implement the following generators (I think the functions are self explanatory):
```javascript
function factorialSeq() {...} // 1, 1, 2, 6, 24, ...
function fibonacciSeq() {...} // 1, 1, 2, 3, 5, 8, 13, ...
function rangeSeq(start, step) {...} // rangeSeq(1, 2)  -> 1, 3, 5, 7, ...
function primeSeq() {...} // 2, 3, 5, 7, 11, 13, ...
partialSumSeq(1, 3, 7, 2, 0) {...} // 1, 4, 11, 13, 13, end
```
You can use any of them in the same way:
```javascript
var seq = generator(factorialSeq);
seq.next(); // !0 = 1
seq.next(); // !1 = 1
seq.next(); // !2 = 2
seq.next(); // !3 = 6
seq.next(); // !4 = 24
...
```
There are some sequences which are infinite and others are not. For example:

-   primeSeq: Is infinite
-   partialSumSeq: Is limited to the passed values.

When the sequence is done (in finite sequences), if you call seq.next() again, it should produce an error.

Good luck!

## Solutions

题目的大体含义是想要通过 ES5 来模拟 ES6 中才有的 generator 生成器功能。主要思路就是使用闭包 closure 这一特性：

```javascript
function generator(sequencer) {
    var args = Array.prototype.slice.call(arguments, 1);
    return {
        next: sequencer.apply(this,args)
    };
}

function fibonacciSeq() {
    var prev = 0
    var current = 1
    return function() {
        var old = current
        current = prev + current
        prev = old
        return prev
    }
}

// 直接调用
console.log(fibonacciSeq()())
// 使用 closure
var seq = fibonacciSeq()
console.log(seq())
```

关于 Closure，非常推荐阅读 Kyle Simpson 写的 *You Don't Know JS: Scope & Closures* ，不到 100 页的小册子，由浅入深，通俗易懂。Closure 简单来讲，就是在一个函数内部定义一个嵌套的子函数，并 return 它，return 这个子函数。形式就像上面代码，在 `fibonacciSeq()` 函数里 return 了一个 anonymous function，匿名函数。这样做的好处就是，把 `fibonacciSeq()` 私有变量 `prev`, `current` 保护起来，**同时又能通过返回的 anonymous function 去修改函数的私有变量**。听起来很绕。很实用，因为一般来讲，我们是无法在函数的外部去修改一个函数内部的私有变量的，但 closure 却可以。或者换句话，通过「在函数 A 中返回一个子函数」这样的操作，可以去修改函数 A 的私有变量。

这里关于 closure，主要想提及几个点：

一、`fibonacciSeq()()` 和 `seq()` 区别

二者函数的调用和执行都不同。`fibonacciSeq()()` 则是先调用函数 `fibonacciSeq()`，该函数返回一个匿名函数，再继续调用该匿名函数，得到匿名函数的返回值。所以是连续调用了两个函数，外层函数和内层函数，整个 `fibonacciSeq()` 函数中的语句都被执行了。

而使用 closure，首先定义变量 `var seq = fibonacciSeq()`，然后在调用 `seq()` 的过程中，仅仅调用执行了 `fibonacciSeq()` 里内部返回的的匿名函数，换句话说，在执行 `seq()` 的过程中， `fibonacciSeq()`  函数并没有被调用执行，整个过程真正调用执行的**只有**被嵌套的内层子函数，也就是返回的匿名函数，anonymous function。

这么一个简单区别就造成了，前者 `fibonacciSeq()()` 即便调用无数次，输出结果都是相同的，都是 `1`。而后者调用多次，却能够得到 Fibonacci 数列 `1,1,2,3,5…`。原因就在于 closure，虽然仅仅执行了匿名函数，但因为匿名函数是作为子函数存在于  `fibonacciSeq()`  函数内，所以根据 Lexical scope 的规则，内层函数是可以 access 到外层函数的变量的。所以在执行 `seq()` 的过程中，程序从内到外寻找变量  `prev`, `current`， 不仅在 `fibonacciSeq()`  找到了它的私有变量  `prev`, `current` ，而且还修改了它们的值！被修改了值的私有变量依旧保持在原来位置，即仍然作为函数的私有变量存在。这一点在文章 [Closure - The Modern JavaScript Tutorial](https://javascript.info/closure) 中有梗详细的解释，这里就不赘述了。

二、其他一些细节

在 `generator()` 中使用的 `call()` `apply()` 方法，主要是为了函数传参。 

-   `Array.prototype.slice.call(arguments, 1)` 

因为 `arguments` 是一个 array-like object，而不是真正的 array，所以无法使用 array 的诸多方法，包括 slice。`call()` 的作用就是让 `arguments` 用上 slice 方法。在这里去掉了  `arguments` 里的第一个元素，剩下元素作为一个新的 array 存储到 `args` 中。

-   `sequencer.apply(this,args)`

绑定 this 到 `sequencer ` 并将参数 `args` 传递到函数中。

参考：

-   [What are the reasons to use 'return function' in JavaScript? - Quora](https://www.quora.com/What-are-the-reasons-to-use-return-function-in-JavaScript)
-   [Closure - The Modern JavaScript Tutorial](https://javascript.info/closure) ✪
-   You Don't Know JS: Scope & Closures - Kyle Simpson