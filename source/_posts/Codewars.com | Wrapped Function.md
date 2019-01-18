---
title: 'Wrapped Function'
date: 
tags:
- Algorithm
- codewars
- JavaScript
categories:
- Coding 
---

## Kata

Create a function method that allow you to wrap an existing function. The method signature would look something like this:

**Usage Example**:

```javascript
function speak(name){
   return "Hello " + name;
}

speak = speak.wrap(function(original, yourName, myName){
   greeting = original(yourName);
   return greeting + ", my name is " + myName;
})

var greeting = speak("Mary", "Kate");
```

<!-- more -->

这个题目就是给函数扩展一个 `wrap` 方法，wrap 本意是「包裹」，这里可以理解为，在原由函数功能的基础上，再次添加新的功能，可以视为对原有函数的一种增强。在本例中，`speak` 是一个简单函数，通过 `wrap` 方法，使之在 `speak` 基础之上，增加了 greeting 的功能。

## Solutions

### 1. that = this

```javascript
Function.prototype.wrap = function(fn) {
    var that = this;
    return function(arg2,arg3) {
        return fn(that,arg2,arg3);
    };
}
```

因为 `wrap` 方法的参数是一个 callback 函数，其中 `original` 参数是要能够映射到原函数中才行。这里涉及到 `this` keyword, scope 以及函数调用的问题。

在 JavaScript 中，函数调用有三种情况：

1.  `fn(arg)`
2.  `obj.child.method(arg)`
3.  ``fn.call(context,arg)`



但其实第三种调用方法才是最通用的书写形式，前两种都可以用第三种书写形式写出来，比如第一种，可以写成 `fn.call(undefined,arg)`， 第二种可以写成 `obj.child.method.call(obj.child,arg)` 。因此当 `wrap` 作为函数的方法被函数 `speak` 调用时，`this` 指代的为函数 `speak`。通过创建变量并赋值，将这种映射关系存储下来。

### 2. bind()

```javascript
Function.prototype.wrap = function(callback) {
  return callback.bind(this, this);
}
```

`bind()` 方法首先会创建一个新函数，这个新函数的函数体和 `callback` 保持一致。 `bind()` 方法本身可能带多个参数，第一个参数用于指定 `this` 的值，之后的参数作为「预制参数」传入到新函数中。预制参数的含义可以查阅文末的参考链接。

而在这个例子里，`bind()` 方法的参数是两个 `this`，第一个 `this` 仅仅指定 context，因为是 `speak()` 调用的 `wrap()`，所以 `this` 就指向 `speak()`。 第二个 `this` 则作为 `callback` 函数第一个参数的预制参数，即参数 `original`。所以 `original` 表示函数 `speak()`。剩余参数则通过实参（实际调用时使用的参数）进行传入。为了便于理解其中的参数传递，可以试着做以下实验：

```javascript
function speak(name){
   return "Hello " + name;
}

Function.prototype.wrap = function(callback) {
  return callback.bind('context',this, 's', 'this');
}

speak = speak.wrap(function(original, yourName, myName){
    console.log(original,yourName,myName)

   return ", my name is " + myName;
})


console.log(speak("Mary", "Kate")) //
```

随意改变 `callback.bind()` 的参数值，查看对应的 `console.log(original,yourName,myName)` 的输出。可以找到规律，`bind()` 方法的第一个参数仅仅指定 context，对参数传递无影响。除了第一个之外的其他参数作为预制参数，影响参数传递。

tl;dr: 

`bind()` 方法第一个参数对应原函数( bound function )的 `this`，第二个参数对应原函数( bound function )的第一个参数，但三个参数对应原函数的第二个参数，以此类推。

### 3. arrow function

```javascript
Function.prototype.wrap = function (f) {
  return (...args) => f(this, ...args)
};
```

`…args` 表明 rest paramaters，其余参数，字面意思很好理解。`=>` 为 arrow function，类似 lambda 函数，这里 return 一个新函数，新函数的第一个参数值改为 `this`，其余参数作为实参传入。原理上这种方法也是类似于预制参数。

参考：

-   [this - MDN web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
-   [this 的值到底是什么？一次说清楚 - 方应杭](https://zhuanlan.zhihu.com/p/23804247)
-   [Javascript之bind #1( 预制参数 )](https://github.com/Aaaaaaaty/Blog/issues/1)
-   [JavaScript深入之从原型到原型链 #2](https://github.com/mqyqingfeng/Blog/issues/2)
-   [Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)